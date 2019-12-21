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
  default     = "code4romania/theater-hub-api:latest"
}

variable "th_rds_instance_class" {
  description = "The type of instance to use for the RDS db"
  default     = "t2.micro"
}

variable "th_rds_username" {
  description = "The username of the user to create in RDS"
  default     = "theater-hub"
}
variable "th_rds_password" {
  description = "The password of the user to create in RDS"
  default     = "7h3473rhu8"
}
