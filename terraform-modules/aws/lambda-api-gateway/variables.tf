
# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the API gateway."
  type = string
  nullable = false
}

variable "lambda_name" {
  description = "The name of the lambda function."
  type = string
  nullable = false
}

variable "lambda_invoke_arn" {
  description = "The invoke ARN of the lambda function."
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

variable "description" {
  description = "The description of the API gateway."
  type = string
  default = "The API Gateway used as input to invoke a lambda function."
}

variable "environment" {
  description = "The name of the environment being deployed."
  type = string
  default = "production"
}
