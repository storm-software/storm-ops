output "invoke_arn" {
  value       = aws_lambda_function.lambda_function.invoke_arn
  description = "The ARN of the SNS topic."
}

output "function_name" {
  value       = aws_lambda_function.lambda_function.function_name
  description = "The name of the lambda function."
}
