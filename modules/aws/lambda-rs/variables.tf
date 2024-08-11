
# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the function used in the lambda."
  type = string
}

variable "aws_region" {
  description = "The AWS region to deploy the resources into."
  default = "us-east-1"
}

variable "log_level" {
  description = "Log level for the Lambda runtime."
  default = "debug"
}

variable "dist_path" {
  description = "The binary path for the lambda."
  type = string
}


