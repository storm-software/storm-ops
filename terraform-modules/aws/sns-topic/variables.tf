
# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the topic/event types."
  type = string
}

variable "aws_region" {
  description = "The AWS region to deploy the resources into."
  type = string
  default = "us-east-1"
}
