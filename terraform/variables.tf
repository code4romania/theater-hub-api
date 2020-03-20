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
  default     = 8081
}

variable "th_api_ecs_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = 256
}

variable "th_api_token_secret" {
  description = "The secret key used by the API. You can generate it with echo \"$(openssl rand -base64 32)\""
}

variable "th_api_facebook_app_id" {
  description = "The Facebook App ID"
}

variable "th_api_facebook_app_secret" {
  description = "The Facebook App secret"
}

variable "th_api_google_app_id" {
  description = "The Google App ID"
}

variable "th_api_google_app_secret" {
  description = "The Google App secret"
}

variable "th_api_youtube_api_key" {
  description = "The Youtube Api key"
}

variable "th_client_base_url" {
  description = "The URL used to access the client. The site's domain name, basically."
  default = "www.theaterhub.ro"
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
