# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the cluster used in EKS."
  type = string
  nullable = false
}

# ----------------------------------------------------------------------------------------------------
# Optional VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "description" {
  description = "The description of the cluster in EKS."
  type = string
  default = "."
}

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

variable "full_name" {
  description = "The name to use when adding resources (generally includes enviroment and region)."
  type = string
  nullable = true
  default = null
}