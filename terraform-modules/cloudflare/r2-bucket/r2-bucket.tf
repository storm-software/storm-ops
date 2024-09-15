resource "cloudflare_r2_bucket" "r2_bucket" {
  account_id = var.account_id
  name       = "${local.full_name}-r2-bucket"
}
