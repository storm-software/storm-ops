
# ----------------------------------------------------------------------------------------------------
# REQUIRED VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "name" {
  description = "The name of the R2 Bucket."
  type = string
  nullable = false
}

variable "api_token" {
  description = "The Cloudflare API token value."
  type = string
  nullable = false
}

variable "email" {
  description = "The Cloudflare account's email address."
  type = string
  nullable = false
}

variable "zone_id" {
  description = "The Cloudflare Zone ID value."
  type = string
  nullable = false
}

variable "account_id" {
  description = "The Cloudflare Account ID value."
  type = string
  nullable = false
}

# ----------------------------------------------------------------------------------------------------
# Optional VARIABLES
# ----------------------------------------------------------------------------------------------------

variable "environment" {
  description = "The name of the environment being deployed."
  type = string
  default = "prod"
}

variable "full_name" {
  description = "The name to use when adding resources (generally includes enviroment and name)."
  type = string
  nullable = true
  default = null
}
