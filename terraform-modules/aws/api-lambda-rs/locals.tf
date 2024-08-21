locals {
  full_name = var.full_name ? var.full_name : "${var.environment}_${var.region}_${var.name}"
}
