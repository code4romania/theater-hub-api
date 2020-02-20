variable "aws_region" {
  description = "The AWS region to use"
  default     = "eu-central-1"
}

variable "aws_azs" {
  description = "The availability zones where to create the Theater Hub API load balancer"
  default     = ["eu-central-1b", "eu-central-1c"]
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

variable "th_ecs_instance_type" {
  description = "The type of EC2 instances to use in the ECS cluster"
  default     = "t2.micro"
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
  default     = "db.t2.micro"
}

variable "th_rds_username" {
  description = "The username of the user to create in RDS"
  default     = "theaterhub"
}

variable "th_rds_password" {
  description = "The password of the user to create in RDS"
  default     = "7h3473rhu8"
}

variable "th_log_retention_days" {
  description = "The number of days to retain the Theater Hub logs in CloudWatch"
  default     = 14
}
