output "r2_bucket_id" {
  value       = cloudflare_r2_bucket.r2_bucket.id
  description = "The ID of the Cloudflare bucket."
}
