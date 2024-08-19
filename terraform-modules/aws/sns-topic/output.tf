output "sns_topic_arn" {
  value       = aws_sns_topic_subscription.sns_topic_subscription.topic_arn
  description = "The ARN of the SNS topic."
}
