output "r2_bucket_id" {
  value       = cloudflare_r2_bucket.r2_bucket.id
  description = "The ID of the Cloudflare R2 bucket."
}

output "r2_bucket_name" {
  value       = cloudflare_r2_bucket.r2_bucket.name
  description = "The name of the Cloudflare R2 bucket."
}
