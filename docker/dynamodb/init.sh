#!/bin/sh

echo "Waiting for DynamoDB..."

until aws dynamodb list-tables \
  --endpoint-url http://dynamodb:8000 \
  --region us-east-1 >/dev/null 2>&1
do
  sleep 2
done

echo "DynamoDB is ready."

if aws dynamodb describe-table \
  --table-name LoyaltyCards \
  --endpoint-url http://dynamodb:8000 \
  --region us-east-1 >/dev/null 2>&1
then
  echo "LoyaltyCards already exists."
else
  echo "Creating LoyaltyCards..."

  aws dynamodb create-table \
    --table-name LoyaltyCards \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://dynamodb:8000 \
    --region us-east-1

  echo "LoyaltyCards created."
fi

echo "DynamoDB initialization complete."
