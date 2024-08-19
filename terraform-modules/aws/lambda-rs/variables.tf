
# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the function used in the lambda."
  type = string
  nullable = false
}

variable "dist_path" {
  description = "The output zip's path for the lambda."
  type = string
  nullable = false
}

variable "project_path" {
  description = "The source project path for the lambda."
  type = string
  nullable = false
}

# ----------------------------------------------------------------------------------------------------
# Optional VARIABLES
# ----------------------------------------------------------------------------------------------------


variable "aws_region" {
  description = "The AWS region to deploy the resources into."
  type = string
  default = "us-east-1"
}

variable "log_level" {
  description = "Log level for the Lambda runtime. Written to the `STORM_LOG_LEVEL` envrionment variable"
  type = string
  default = "info"
}

variable "environment" {
  description = "The name of the environment being deployed."
  type = string
  default = "production"
}

variable "topic_arn" {
  description = "The ARN of a SNS Topic. Written to the `STORM_TOPIC_ID` envrionment variable."
  type = string
  nullable = true
}
