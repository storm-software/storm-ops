resource "aws_iam_role" "lambda_role" {
name   = "${var.name}-iam-role"
assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "lambda.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy" {
 name         = "${var.name}-iam-policy"
 path         = "/"
 description  = "AWS IAM Policy for managing aws lambda role"
 policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": [
       "logs:CreateLogGroup",
       "logs:CreateLogStream",
       "logs:PutLogEvents"
     ],
     "Resource": "arn:aws:logs:*:*:*",
     "Effect": "Allow"
   },
   {
     "Action": [
       "secretsmanager:GetSecretValue"
     ],
     "Resource": "arn:aws:secretsmanager:*:*:*",
     "Effect": "Allow"
   },
   {
     "Action": [
       "sns:Publish"
     ],
     "Resource": "arn:aws:sns:*:*:*",
     "Effect": "Allow"
   }
 ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_role_policy_attachment" {
 role        = aws_iam_role.lambda_role.name
 policy_arn  = aws_iam_policy.lambda_policy.arn
}

# Here we attach a permission to execute a lambda function to our role
# resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
#   role = aws_iam_role.lambda_execution_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

resource "random_uuid" "lambda_source_hash" {
  keepers = {
    for filename in setunion(
      fileset(var.project_path, "**/*.rs"),
      fileset(var.project_path, "Cargo.toml"),
    ):
    filename => filemd5("${var.project_path}/${filename}")
  }
}

# Here is the definition of our lambda function
resource "aws_lambda_function" "lambda_dist" {
  function_name = var.name
  source_code_hash = "${random_uuid.lambda_source_hash.result}"
  filename = var.dist_path
  handler = "bootstrap"
  package_type = "Zip"
  runtime = "provided.al2023"

  # here we enable debug logging for our Rust run-time environment. We would change
  # this to something less verbose for production.
 environment {
   variables = {
     "RUST_LOG" = var.log_level
   }
 }

 #This attaches the role defined above to this lambda function
 role = aws_iam_role.lambda_role.arn
 depends_on  = [aws_iam_role_policy_attachment.lambda_role_policy_attachment]
}

// The Lambda Function URL that allows direct access to our function
resource "aws_lambda_function_url" "lambda_dist_function" {
   function_name = aws_lambda_function.lambda_dist.function_name
   authorization_type = "NONE"
}
