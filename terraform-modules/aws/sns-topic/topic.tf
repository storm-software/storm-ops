locals {
  full_name = "${var.environment}.${var.region}.${var.name}"
}

resource "aws_sns_topic" "sns_topic" {
  name = "${ local.full_name }.topic"

  tags = {
    Environment = var.environment
    Region = var.region
  }
}

resource "aws_sqs_queue" "dead_letter_queue" {
  name = "${ local.full_name }.dead-letter-queue"

  tags = {
    Environment = var.environment
    Region = var.region
  }
}

resource "aws_sqs_queue" "sqs_queue" {
    name = "${ local.full_name }.queue"
    redrive_policy  = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.dead_letter_queue.arn}\",\"maxReceiveCount\":5}"
    visibility_timeout_seconds = 300

    tags = {
        Environment = var.environment
        Region = var.region
    }
}

resource "aws_sns_topic_subscription" "sns_topic_subscription" {
    topic_arn = "${aws_sns_topic.sns_topic.arn}"
    protocol  = "sqs"
    endpoint  = "${aws_sqs_queue.sqs_queue.arn}"
}

resource "aws_sqs_queue_policy" "sqs_queue_policy" {
    queue_url = "${aws_sqs_queue.sqs_queue.id}"

    policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.sqs_queue.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.sns_topic.arn}"
        }
      }
    }
  ]
}
POLICY
}
