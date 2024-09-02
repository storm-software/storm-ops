locals {
  full_name = var.full_name != null ? var.full_name : "${var.name}-${var.environment}"
}
