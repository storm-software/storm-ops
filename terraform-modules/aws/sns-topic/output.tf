output "sns_topic_arn" {
  value       = aws_sns_topic.sns_topic.arn
  description = "The ARN of the SNS topic."
}
