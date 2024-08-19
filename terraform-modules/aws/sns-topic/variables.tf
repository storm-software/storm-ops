
# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the topic/event types."
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

variable "environment" {
  description = "The name of the environment being deployed."
  type = string
  default = "prod"
}
