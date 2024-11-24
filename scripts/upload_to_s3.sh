#!/bin/bash

# Check for required arguments
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <directory_path> <bucket_name> <s3_key_prefix>"
    echo "Example: $0 ./playwright-report my-s3-bucket reports/playwright"
    exit 1
fi

# Assign command-line arguments to variables
DIRECTORY_PATH=$1
BUCKET_NAME=$2
S3_KEY_PREFIX=$3

# Upload the directory to the S3 bucket
echo "Uploading $DIRECTORY_PATH to s3://$BUCKET_NAME/$S3_KEY_PREFIX/"
aws s3 cp --recursive "$DIRECTORY_PATH" "s3://$BUCKET_NAME/$S3_KEY_PREFIX/"

# Check if the upload was successful
if [ $? -ne 0 ]; then
    echo "Failed to upload files to S3."
    exit 1
fi

# Generate a pre-signed URL for the index.html file
INDEX_HTML_KEY="$S3_KEY_PREFIX/index.html"
REPORT_URL="https://e2e-qa-report.teamgamdom.com/$INDEX_HTML_KEY"


# Output the presigned URL
echo "REPORT URL for index.html: $REPORT_URL"

# Export the pre-signed URL as an environment variable by writing it to a file
echo "REPORT_URL=$REPORT_URL" >> $GITHUB_ENV
