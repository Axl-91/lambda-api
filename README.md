# Lambda API

Serverless REST API built with **AWS Lambda**, **API Gateway**, **DynamoDB**, **S3** and **SQS**, using **Node.js + TypeScript** and **AWS SAM**.

The entire application is developed and tested locally using Docker, SAM Local, DynamoDB Local, MinIO and ElasticMQ. 

No AWS deployment is required.

## Architecture

The project follows a simplified Clean Architecture approach:

```text
API Gateway → Lambda Handler → Service → Repository → DynamoDB
```

CSV import pipeline:

```text
CSV → MinIO (S3) → S3 Event Bridge → Lambda → ElasticMQ (SQS) → SQS Consumer → Lambda → DynamoDB
```

The current S3 flow uses a small local bridge because MinIO cannot directly invoke SAM Local Lambda endpoints.

The local SQS flow uses a small consumer because ElasticMQ cannot directly trigger SAM Local Lambda endpoints.

---

## API Endpoints

| Method | Endpoint              | Description              | Status |
| ------ | --------------------- | ------------------------ | ------ |
| POST   | `/loyalty-cards`      | Create a loyalty card    | ✅      |
| GET    | `/loyalty-cards/{id}` | Get a loyalty card by ID | ✅      |
| GET    | `/loyalty-cards`      | Get all loyalty cards    | ✅      |

---

## Progress

### Lambda Functions & REST API

* [x] POST `/loyalty-cards`
* [x] GET `/loyalty-cards/{id}`
* [x] GET `/loyalty-cards`
* [x] Input validation
* [x] Error handling

### DynamoDB & Repository

* [x] DynamoDB Local
* [x] LoyaltyCardRepository
* [x] Create / Get / GetAll operations
* [x] Service → Repository → DynamoDB
* [x] AWS configuration and permissions

### Architecture & Error Handling

* [x] Separate handlers, services and repositories
* [x] Application/domain errors
* [x] HTTP error mapping
* [x] Centralized dependency creation
* [ ] Centralized HTTP error handling if needed

### Testing

* [x] Configure Jest
* [x] Handler unit tests
* [x] Service unit tests
* [x] Repository unit tests
* [x] Test factories and fakes
* [x] Validation and error tests
* [ ] Repository integration tests
* [ ] Integration tests
* [ ] End-to-end tests

### CSV Import

* [x] MinIO configured as local S3
* [x] CSV import Lambda
* [x] CSV parsing
* [x] S3 ObjectCreated events
* [x] S3 Event Bridge
* [x] MinIO → Bridge → SAM Local
* [x] SQS
* [x] SQS-triggered Lambda
* [x] Persist imported cards through LoyaltyCardService
* [x] Retries and failed messages
* [x] Dead Letter Queue
* [x] End-to-end pipeline test

### Local Infrastructure

* [x] API Gateway / SAM Local
* [x] DynamoDB Local
* [x] MinIO
* [x] Docker network
* [x] Persistent DynamoDB storage
* [x] Persistent MinIO storage
* [x] Automatic DynamoDB table creation
* [x] Automatic S3 bucket creation
* [x] SAM Lambda network configuration
* [x] Local S3 event bridge
* [x] SQS
* [x] SQS → Lambda consumer
* [x] DLQ
* [x] Complete infrastructure in `template.yaml`
* [ ] One-command local setup

---

## Project Structure

```text
lambda-api/
├── src/
│   ├── handlers/          # Lambda handlers
│   ├── services/          # Business logic
│   ├── repositories/      # Data access
│   ├── models/            # Domain models
│   ├── errors/            # Application/domain errors
│   ├── infrastructure/    # AWS clients & dependencies
│   ├── local/             # Local development utilities
│   └── tests/             # Unit tests & test doubles
│
├── docker/
│   ├── dynamodb/          # DynamoDB initialization
│   ├── s3/                # S3/MinIO initialization
│   └── sqs/               # Local SQS configuration
│
├── events/                # Local test events & CSV files
├── template.yaml          # AWS SAM infrastructure
├── docker-compose.yml     # Local AWS infrastructure
├── jest.config.ts         # Jest configuration
└── package.json
```

---

# Local Development

## Prerequisites

* Docker
* Docker Compose
* Node.js
* npm
* AWS CLI
* AWS SAM CLI

No AWS account is required.

## 1. Install dependencies

```bash
npm install
```

## 2. Start local infrastructure

```bash
docker compose up -d
```

This starts:

* DynamoDB Local
* MinIO
* ElasticMQ (local SQS)
* Database, S3 and SQS initialization containers

Services are connected through the Docker network:

```text
lambda-api
```

DynamoDB:

```text
http://localhost:8000
```

MinIO S3 API:

```text
http://localhost:9000
```

MinIO Console:

```text
http://localhost:9001
```

ElasticMQ:

```text
http://localhost:9324
```

Local AWS credentials:

```text
Access Key: dummy
Secret Key: dummy123
Region: us-east-1
```

The `loyalty-cards` bucket, DynamoDB table and SQS queue are created automatically.

## 3. Build the SAM application

```bash
sam build
```

## 4. Start the REST API

```bash
sam local start-api --docker-network lambda-api
```

API:

```text
http://localhost:3000
```

Example:

```bash
curl -X POST http://localhost:3000/loyalty-cards \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Axel"}'
```

```bash
curl http://localhost:3000/loyalty-cards/{id}
```

```bash
curl http://localhost:3000/loyalty-cards
```

## 5. Start SAM Lambda endpoint

The local S3 bridge and SQS consumer invoke Lambda functions through SAM Local:

```bash
sam local start-lambda --docker-network lambda-api
```

SAM Lambda endpoint:

```text
http://localhost:3001
```

This exposes the Lambda functions defined in `template.yaml`, including:

```text
ImportLoyaltyCardsFunction
ProcessLoyaltyCardFunction
```

## 6. Start the S3 Event Bridge

```bash
npm run local:s3-bridge
```

The bridge listens on:

```text
http://localhost:4000
```

It receives MinIO S3 events and invokes the corresponding Lambda through SAM Local.

> The bridge is only required for the local environment. In AWS, S3 can invoke Lambda directly.

## 7. Start the local SQS consumer

```bash
npm run local:sqs-consumer
```

The consumer polls the local ElasticMQ queue and invokes `ProcessLoyaltyCardFunction` through SAM Local.

Queue:

```text
http://localhost:9324/000000000000/loyalty-cards
```

The local consumer provides the SQS → Lambda integration used during local development.

> In AWS, this integration would normally be handled by an SQS event source mapping instead of the local consumer.

## 8. Test CSV import

Upload a CSV to MinIO:

```bash
AWS_ACCESS_KEY_ID=dummy \
AWS_SECRET_ACCESS_KEY=dummy123 \
aws s3 cp events/cards.csv s3://loyalty-cards/cards.csv \
  --endpoint-url http://localhost:9000 \
  --region us-east-1
```

This triggers the local S3 event flow and invokes `ImportLoyaltyCardsFunction`.

The Lambda reads the CSV from MinIO, parses its contents and sends each loyalty card to SQS.

Example:

```text
Parsed CSV:
[
  { customerName: 'Axel' },
  { customerName: 'Juan' },
  { customerName: 'Maria' }
]
```

The SQS consumer then processes each message through `ProcessLoyaltyCardFunction`, which reuses `LoyaltyCardService` to persist the cards in DynamoDB.

## 9. Run tests

```bash
npm test
```

Jest discovers tests under:

```text
tests/**/*.test.ts
```

Unit tests use `FakeLoyaltyCardRepository` to test service logic without requiring DynamoDB.

---

## Local Architecture

<img width="1408" height="768" alt="lambda-api-flow" src="https://github.com/user-attachments/assets/72e13e92-4a10-4e35-9a2e-467ab9ba7857" />

---

## Project Goal

The goal is to reproduce a serverless AWS architecture **entirely locally** and understand how the individual AWS components interact.

Local equivalents:

* **DynamoDB Local** → DynamoDB
* **MinIO** → S3
* **ElasticMQ** → SQS
* **SAM Local** → Lambda / API Gateway
* **Docker Compose** → Local infrastructure
* **S3 Event Bridge** → Local S3 → Lambda integration
* **SQS Consumer** → Local SQS → Lambda integration
