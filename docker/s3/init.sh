#!/bin/sh

set -e

echo "Waiting for MinIO..."

until aws s3api list-buckets \
  --endpoint-url http://minio:9000 \
  --region us-east-1
do
  echo "MinIO is not ready yet..."
  sleep 2
done

echo "MinIO is ready."

if aws s3api head-bucket \
  --bucket loyalty-cards \
  --endpoint-url http://minio:9000 \
  --region us-east-1
then
  echo "Bucket loyalty-cards already exists."
else
  echo "Creating bucket loyalty-cards..."

  aws s3api create-bucket \
    --bucket loyalty-cards \
    --endpoint-url http://minio:9000 \
    --region us-east-1

  echo "Bucket loyalty-cards created."
fi

echo "Configuring MinIO client..."

mc alias set local http://minio:9000 dummy dummy123

echo "Configuring S3BRIDGE webhook..."

if mc event list local/loyalty-cards | grep -q "arn:minio:sqs::S3BRIDGE:webhook"; then
    echo "S3BRIDGE webhook already configured."
else
    mc event add local/loyalty-cards \
        arn:minio:sqs::S3BRIDGE:webhook \
        --event put

    echo "S3BRIDGE webhook configured."
fi

echo "S3 initialization complete."
