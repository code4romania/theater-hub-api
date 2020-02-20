provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}


# TODO: do something with this group?
resource "aws_security_group" "th_sec_group" {
  name        = "theater-hub-security-group"
  description = "Security group for the Theater Hub app."
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = var.th_api_port
    to_port     = var.th_api_port
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "th-api-db" {
  allocated_storage       = 10
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "11.5"
  instance_class          = var.th_rds_instance_class
  identifier              = "theater-hub-db"
  name                    = "TheaterHub"
  username                = var.th_rds_username
  password                = var.th_rds_password
  parameter_group_name    = "default.postgres11"
  backup_retention_period = 30
}

resource "aws_ecs_cluster" "th_ecs_cluster" {
  name = "theater-hub-ecs-cluster"
}

resource "aws_cloudwatch_log_group" "th_log_group" {
  name              = "theater_hub"
  retention_in_days = var.th_log_retention_days
}

# resource "aws_autoscaling_group" "th-api-as-group" {
#   vpc_id               = aws_vpc.main.id
#   availability_zones   = ["${var.aws_azs}"]
#   name                 = "Theater Hub API AS Group"
#   min_size             = 1
#   max_size             = 1
#   desired_capacity     = 1
#   health_check_type    = "EC2"
#   launch_configuration = "${aws_launch_configuration.th-api-launch-config.name}"
#   #vpc_zone_identifier  = ["${aws_subnet.main.id}"]
# }

# resource "aws_launch_configuration" "th-api-launch-config" {
#   name                 = "Theather Hub API Launch Config"
#   image_id             = "${lookup(var.aws_amis, var.aws_region)}"
#   instance_type        = "${var.th_ecs_instance_type}"
#   security_groups      = ["${aws_security_group.th_sec_group.id}"]
#   iam_instance_profile = "${aws_iam_instance_profile.th_ecs_instance_profile.name}"
#   # TODO: is there a good way to make the key configurable sanely?
#   # key_name                    = "${aws_key_pair.alex.key_name}"
#   associate_public_ip_address = false
#   #user_data                   = "#!/bin/bash\necho ECS_CLUSTER='${var.ecs_cluster_name}' > /etc/ecs/ecs.config"
# }


resource "aws_ecs_task_definition" "th_api_task_def" {
  family = "theater-hub"
  # network_mode             = "awsvpc">
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.th_api_ecs_cpu
  memory                   = var.th_api_ecs_memory
  # execution_role_arn       = aws_iam_role.th_ecs_task_execution_role.id

  container_definitions = templatefile(
    "task-definitions/theater-hub-api.json",
    {
      AWS_REGION           = var.aws_region,
      TH_API_ECS_CPU       = var.th_api_ecs_cpu,
      TH_API_ECS_MEMORY    = var.th_api_ecs_memory,
      TH_API_DOCKER_IMAGE  = var.th_api_docker_image,
      TH_POSTGRES_HOSTNAME = aws_db_instance.th-api-db.address,
      TH_POSTGRES_USERNAME = var.th_rds_username,
      TH_POSTGRES_PASSWORD = var.th_rds_password
    }
  )
}

# resource "aws_elb" "th_api_lb" {
#   name            = "theater-hub-api-lb"
#   security_groups = ["${aws_security_group.th_sec_group.id}"]
#   #subnets         = ["${aws_subnet.main.id}"]
#   availability_zones = var.aws_azs

#   listener {
#     lb_protocol = "http"
#     lb_port     = 8081

#     instance_protocol = "http"
#     instance_port     = 8081
#   }

#   health_check {
#     healthy_threshold   = 3
#     unhealthy_threshold = 2
#     timeout             = 3
#     #target              = "HTTP:8081/hello-world"
#     target   = "TCP:8081"
#     interval = 5
#   }

#   #cross_zone_load_balancing = true
# }


# Fetch AZs in the current region
data "aws_availability_zones" "available" {}

resource "aws_vpc" "main" {
  cidr_block = "172.17.0.0/16"
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}


# Route the public subnet traffic through the IGW
resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.main.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.gw.id}"
}

# Create a NAT gateway with an EIP for each private subnet to get internet connectivity
resource "aws_eip" "gw" {
  count      = length(var.aws_azs)
  vpc        = true
  depends_on = ["aws_internet_gateway.gw"]
}

resource "aws_nat_gateway" "gw" {
  count         = length(var.aws_azs)
  subnet_id     = "${element(aws_subnet.public.*.id, count.index)}"
  allocation_id = "${element(aws_eip.gw.*.id, count.index)}"
}

# Create a new route table for the private subnets
# And make it route non-local traffic through the NAT gateway to the internet
resource "aws_route_table" "private" {
  count  = length(var.aws_azs)
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = "${element(aws_nat_gateway.gw.*.id, count.index)}"
  }
}

# Explicitely associate the newly created route tables to the private subnets (so they don't default to the main route table)
resource "aws_route_table_association" "private" {
  count          = length(var.aws_azs)
  subnet_id      = "${element(aws_subnet.private.*.id, count.index)}"
  route_table_id = "${element(aws_route_table.private.*.id, count.index)}"
}

resource "aws_subnet" "public" {
  count                   = length(var.aws_azs)
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, length(var.aws_azs) + count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count             = length(var.aws_azs)
  cidr_block        = "${cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)}"
  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  vpc_id            = "${aws_vpc.main.id}"
}


resource "aws_alb" "th_alb" {
  name            = "th-alb"
  subnets         = aws_subnet.public.*.id
  security_groups = [aws_security_group.th_sec_group.id]
}

resource "aws_alb_target_group" "th_api_target_group" {
  name        = "theather-hub-api-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
}

resource "aws_alb_listener" "th-api-listener" {
  load_balancer_arn = aws_alb.th_alb.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.th_api_target_group.id}"
    type             = "forward"
  }
}



resource "aws_ecs_service" "theater_hub_api" {
  name            = "th-api-ecs-service"
  cluster         = aws_ecs_cluster.th_ecs_cluster.id
  task_definition = aws_ecs_task_definition.th_api_task_def.id

  desired_count = 1

  launch_type = "FARGATE"

  #security_groups = [aws_security_group.th_sec_group.id]

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0

  network_configuration {
    security_groups = ["${aws_security_group.th_sec_group.id}"]
    subnets         = aws_subnet.private.*.id
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.th_api_target_group.id
    #elb_name       = aws_alb.th_alb.name
    container_name = "theater-hub-api"
    container_port = 8081
  }
}

# TODO: Route53 record mapping to the LB

# resource "aws_iam_role" "th_host_role" {
#   name               = "ecs_host_role"
#   assume_role_policy = file("policies/th-ecs-role.json")
# }

# resource "aws_iam_policy" "th_ecs_service_role_policy" {
#   name   = "th-ecs-task-execution-policy"
#   policy = file("policies/th-ecs-service-role-policy.json")
# }

# resource "aws_iam_role" "th_ecs_task_execution_role" {
#   name               = "th-ecs-task-execution-role"
#   assume_role_policy = <<EOF
# {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Action": "sts:AssumeRole",
#             "Principal": {
#             "Service": [
#                 "s3.amazonaws.com",
#                 "lambda.amazonaws.com",
#                 "ecs.amazonaws.com"
#             ]
#             },
#             "Effect": "Allow",
#             "Sid": ""
#         }
#     ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "th_policy_attachment" {
#   role       = aws_iam_role.th_ecs_task_execution_role.name
#   policy_arn = aws_iam_policy.th_ecs_execution_iam_policy.id
# }



# resource "aws_iam_instance_profile" "th_ecs_instance_profile" {
#   name  = "th-ecs-instance-profile"
#   path  = "/"
#   roles = ["${aws_iam_role.th_ecs_host_role.name}"]
# }
