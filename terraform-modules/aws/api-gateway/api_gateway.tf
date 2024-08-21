locals {
  full_name = "${var.environment}_${var.region}_${var.name}"
}

resource "aws_api_gateway_rest_api" "api_gateway_rest_api" {
  name        = "${local.full_name}_rest-api"
  description = var.description

  tags = {
      Environment = var.environment
      Region = var.region
      Name = var.name
  }
}

resource "aws_api_gateway_client_certificate" "api_gateway_certificate" {
  description = "The ${var.name} API Gateway's client certificate"

  tags = {
      Environment = var.environment
      Region = var.region
      Name = var.name
  }
}

resource "aws_api_gateway_resource" "api_gateway_proxy_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gateway_rest_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.api_gateway_rest_api.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "api_gateway_proxy_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.api_gateway_rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.api_gateway_proxy_resource.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_gateway_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gateway_rest_api.id}"
  resource_id = "${aws_api_gateway_method.api_gateway_proxy_method.resource_id}"
  http_method = "${aws_api_gateway_method.api_gateway_proxy_method.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.uri
}

resource "aws_api_gateway_method" "api_gateway_proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.api_gateway_rest_api.id}"
  resource_id   = "${aws_api_gateway_rest_api.api_gateway_rest_api.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_gateway_integration_root" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gateway_rest_api.id}"
  resource_id = "${aws_api_gateway_method.api_gateway_proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.api_gateway_proxy_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.uri
}

resource "aws_api_gateway_deployment" "api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  stage_name  = var.name

  depends_on = [
    aws_api_gateway_integration.api_gateway_integration,
    aws_api_gateway_integration.api_gateway_integration_root,
  ]
}
