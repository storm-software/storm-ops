output "invoke_url" {
  value       = aws_api_gateway_integration.api_gateway_integration.url
  description = "The ARN of the API gateway URL."
}

output "invoke_arn" {
  value       = aws_lambda_function.lambda_function.invoke_arn
  description = "The ARN of the AWS lambda."
}

output "function_name" {
  value       = aws_lambda_function.lambda_function.function_name
  description = "The name of the lambda function."
}

output "certificate_id" {
  value       = aws_api_gateway_client_certificate.api_gateway_certificate.id
  description = "The certificate ID of the API Gateway."
}

output "certificate_arn" {
  value       = aws_api_gateway_client_certificate.api_gateway_certificate.arn
  description = "The ARN of the API Gateway's certificate."
}
