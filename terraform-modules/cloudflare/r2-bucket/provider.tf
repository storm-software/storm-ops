
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = ">= 4.52.10"
    }
  }
}

provider "cloudflare" {
  email     = var.email
  api_token = var.api_token
}
