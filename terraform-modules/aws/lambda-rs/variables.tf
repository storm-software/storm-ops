
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

variable "region" {
  description = "The AWS region to deploy the resources into."
  type = string
  default = "us-east-1"
}

variable "environment" {
  description = "The name of the environment being deployed."
  type = string
  default = "prod"
}

variable "topic_arn" {
  description = "The ARN of a SNS Topic. Written to the `STORM_TOPIC_ID` envrionment variable."
  type = string
  nullable = true
  default = null
}

variable "log_level" {
  description = "Log level for the Lambda runtime. Written to the `STORM_LOG_LEVEL` envrionment variable"
  type = string
  default = "info"
}

variable "log_retention_in_days" {
  description = "The number of days to retain the logs for the lambda function."
  type = number
  default = 30
}

variable "workspace_root" {
  description = "The workspace root path."
  type = string
  default = "/"
}

variable "full_name" {
  description = "The name to use when adding resources (generally includes enviroment and region)."
  type = string
  nullable = true
  default = null
}
