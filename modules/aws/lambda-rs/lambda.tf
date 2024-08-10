# Here we grab the compiled executable and use the archive_file package
# to convert it into the .zip file we need.
data "archive_file" "lambda_dist_archive" {
  type = "zip"
  source_file = var.dist_path
  output_path = "bootstrap.zip"
}

# Here we set up an IAM role for our Lambda function
resource "aws_iam_role" "lambda_execution_role" {
  assume_role_policy = <<EOF
  {
    "Version": "2012–10–17",
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

# Here we attach a permission to execute a lambda function to our role
resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
  role = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Here is the definition of our lambda function
resource "aws_lambda_function" "lambda_dist" {
  function_name = var.lambda_function_name
  source_code_hash = data.archive_file.lambda_dist_archive.output_base64sha256
  filename = data.archive_file.lambda_dist_archive.output_path
  handler = "func"
  runtime = "provided"

  # here we enable debug logging for our Rust run-time environment. We would change
  # this to something less verbose for production.
 environment {
   variables = {
     "RUST_LOG" = var.log_level
   }
 }

 #This attaches the role defined above to this lambda function
 role = aws_iam_role.lambda_execution_role.arn
}

// Add lambda -> DynamoDB policies to the lambda execution role
# resource "aws_iam_role_policy" "write_db_policy" {
#   name = "lambda_write_db_policy"
#   role = aws_iam_role.lambda_execution_role.name
#   policy = <<EOF
# {
#   "Version": "2012–10–17",
#   "Statement": [
#    {
#      "Sid": "",
#      "Action": [
#        "dynamodb:PutItem"
#      ],
#      "Effect": "Allow",
#      "Resource": "arn:aws:dynamodb: :${var.aws_region}::${data.aws_caller_identity.current.account_id}:table/Shop_Thermostat"
#    }
#  ]
# }
# EOF
# }

// The Lambda Function URL that allows direct access to our function
resource "aws_lambda_function_url" "lambda_dist_function" {
   function_name = aws_lambda_function.lambda_dist.function_name
   authorization_type = "NONE"
}
