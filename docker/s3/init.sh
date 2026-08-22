#!/bin/sh

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

echo "S3 initialization complete."
