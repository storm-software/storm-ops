locals {
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  account_id = data.aws_caller_identity.current.account_id
  partition  = data.aws_partition.current.partition
  region     = data.aws_region.current.name

  external_role_name = try(replace(var.node_iam_role_arn, "/^(.*role/)/", ""), null)

  create_node_iam_role = var.create && var.create_node_iam_role

  node_iam_role_name          = coalesce(var.node_iam_role_name, "Karpenter-${var.cluster_name}")
  node_iam_role_policy_prefix = "arn:${local.partition}:iam::aws:policy"

  ipv4_cni_policy = { for k, v in {
    AmazonEKS_CNI_Policy = "${local.node_iam_role_policy_prefix}/AmazonEKS_CNI_Policy"
  } : k => v if var.node_iam_role_attach_cni_policy && var.cluster_ip_family == "ipv4" }
  ipv6_cni_policy = { for k, v in {
    AmazonEKS_CNI_IPv6_Policy = "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:policy/AmazonEKS_CNI_IPv6_Policy"
  } : k => v if var.node_iam_role_attach_cni_policy && var.cluster_ip_family == "ipv6" }

  enable_spot_termination = var.create && var.enable_spot_termination
  queue_name = coalesce(var.queue_name, "Karpenter-${var.cluster_name}")

  tags = {
      Environment = var.environment
      Region = var.region
      Name = var.cluster_name
  }
}
