provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}


# TODO: do something with this group?
resource "aws_security_group" "th_sec_group" {
  name        = "theater-hub-security-group"
  description = "Security group for the Theater Hub app."

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

resource "aws_ecs_task_definition" "th_api_task_def" {
  family = "theater-hub"
  # network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"] # FARGATE is the other option
  cpu                      = var.th_api_ecs_cpu
  memory                   = var.th_api_ecs_memory

  container_definitions = templatefile(
    "task-definitions/theater-hub-api.json",
    {
      AWS_REGION          = var.aws_region,
      TH_API_ECS_CPU      = var.th_api_ecs_cpu,
      TH_API_ECS_MEMORY   = var.th_api_ecs_memory,
      TH_API_DOCKER_IMAGE = var.th_api_docker_image
    }
  )
}

resource "aws_lb_target_group" "th_api_target_group" {
  name     = "theather-hub-api-target-group"
  port     = 80
  protocol = "HTTP"
}


resource "aws_ecs_service" "theater_hub_api" {
  name            = "th-api-ecs-service"
  cluster         = aws_ecs_cluster.th_ecs_cluster.arn
  task_definition = aws_ecs_task_definition.th_api_task_def.arn

  desired_count = 1

  #security_groups = [aws_security_group.th_sec_group.arn]

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0

  load_balancer {
    target_group_arn = "${aws_lb_target_group.th_api_target_group.arn}"
    container_name   = "theater-hub-api"
    container_port   = 8081
  }
}

