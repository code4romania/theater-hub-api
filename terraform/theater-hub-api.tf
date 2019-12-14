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

resource "aws_ecs_cluster" "th_ecs_cluster" {
  name = "theater-hub-ecs-cluster"
}

resource "aws_ecs_task_definition" "th_api_task_def" {
  family = "theater-hub"
  # network_mode             = "awsvpc"
  # requires_compatibilities = ["FARGATE"]
  cpu    = var.th_api_ecs_cpu
  memory = var.th_api_ecs_memory

  container_definitions = <<EOF
[
  {
    "name": "theater-hub-api-instance",
    "image": "${var.th_api_docker_image}",
    "cpu": ${var.th_api_ecs_cpu},
    "memory": ${var.th_api_ecs_memory}

  }
]
EOF
}

/*
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-region": "${var.aws_region}",
        "awslogs-group": "theater_hub",
        "awslogs-stream-prefix": "theater_hub"
      }
    }
*/


resource "aws_ecs_service" "theater_hub_api" {
  name            = "th-api-ecs-service"
  cluster         = aws_ecs_cluster.th_ecs_cluster.arn
  task_definition = aws_ecs_task_definition.th_api_task_def.arn

  desired_count = 1

  #security_groups = [aws_security_group.th_sec_group.arn]

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0
}

