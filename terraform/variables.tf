variable "aws_region" {
  description = "The AWS region to use"
  default     = "eu-central-1"
}

variable "aws_profile" {
  description = "The AWS credentials profile to use"
  default     = "th-builder"
}

variable "th_api_port" {
  description = "The port on which the Theather Hub API runs"
  default     = 443
}

variable "th_api_ecs_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = 256
}

variable "th_api_ecs_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = 512
}

variable "th_api_docker_image" {
  description = "Docker image to run in the ECS cluster"
  default     = "adongy/hostname-docker:latest"
}
