locals {
  full_name = "${var.environment}.${var.region}.${var.name}"
}

resource "aws_api_gateway_rest_api" "api_gateway_rest_api" {
  name        = "${local.full_name}.rest-api"
  description = var.description

  tags = {
      Environment = var.environment
      Region = var.region
  }
}

resource "aws_api_gateway_client_certificate" "api_gateway_certificate" {
  description = "The ${ var.name } API Gateway's client certificate"

  tags = {
      Environment = var.environment
      Region = var.region
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
  uri                     = aws_lambda_function.lambda_function.invoke_arn
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
  uri                     = aws_lambda_function.lambda_function.invoke_arn
}

resource "aws_api_gateway_deployment" "api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  stage_name  = var.name

  depends_on = [
    aws_api_gateway_integration.api_gateway_integration,
    aws_api_gateway_integration.api_gateway_integration_root,
  ]
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.api_gateway_rest_api.execution_arn}/*/*"
}
