# Lambda API

Serverless REST API built with **AWS Lambda**, **API Gateway**, **DynamoDB**, **S3** and **SQS**, using **Node.js + TypeScript** and **AWS SAM**.

The entire application is developed and tested **locally** using Docker, SAM Local, DynamoDB Local and MinIO. No AWS deployment is required.

## Architecture

The project follows a simplified Clean Architecture approach:

```text
API Gateway → Lambda Handler → Service → Repository → DynamoDB
```

CSV import pipeline:

```text
CSV → S3 → Lambda → SQS → Lambda → DynamoDB
```

The current S3 flow uses a small local bridge because MinIO cannot directly invoke SAM Local Lambda endpoints.

---

## API Endpoints

| Method | Endpoint              | Description              | Status |
| ------ | --------------------- | ------------------------ | ------ |
| POST   | `/loyalty-cards`      | Create a loyalty card    | ✅      |
| GET    | `/loyalty-cards/{id}` | Get a loyalty card by ID | ✅      |
| GET    | `/loyalty-cards`      | Get all loyalty cards    | ✅      |

---

## Progress

### Create Loyalty Card

* [x] POST `/loyalty-cards`
* [x] LoyaltyCard model
* [x] LoyaltyCardService
* [x] Input validation
* [x] UUID generation
* [x] Initial points
* [x] Creation timestamp
* [x] DynamoDB persistence

### DynamoDB & Repository

* [x] DynamoDB Local
* [x] Loyalty cards table
* [x] LoyaltyCardRepository
* [x] Create / Get / GetAll operations
* [x] Service → Repository → DynamoDB
* [x] Environment configuration
* [x] Lambda permissions
* [x] DynamoDB item mapping

### Architecture & Error Handling

* [x] Separate handlers, services and repositories
* [x] Application/domain errors
* [x] HTTP error mapping
* [x] Centralized dependency creation
* [ ] Centralized HTTP error handling if needed

### Testing

* [x] Jest
* [x] Handler tests
* [x] Service unit tests
* [x] FakeLoyaltyCardRepository
* [ ] Repository integration tests
* [ ] Additional validation/error tests
* [ ] Integration tests

### CSV Import

* [x] MinIO configured as local S3
* [x] CSV import Lambda
* [x] CSV parsing
* [x] S3 ObjectCreated events
* [x] S3 Event Bridge
* [x] MinIO → Bridge → SAM Local
* [ ] SQS
* [ ] SQS-triggered Lambda
* [ ] Persist imported cards through LoyaltyCardService
* [ ] Retries and failed messages
* [ ] Dead Letter Queue
* [ ] End-to-end pipeline test

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
* [ ] SQS
* [ ] SQS → Lambda event source
* [ ] DLQ
* [ ] Complete infrastructure in `template.yaml`
* [ ] One-command local setup

---

## Project Structure

```text
lambda-api/
├── src/
│   ├── handlers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── errors/
│   └── infrastructure/
│       └── dependencies.ts
├── tests/
├── events/
├── docker/
│   ├── dynamodb/
│   │   └── init.sh
│   └── s3/
│       └── init.sh
├── template.yaml
├── samconfig.toml
├── tsconfig.json
├── jest.config.ts
├── package.json
├── docker-compose.yml
└── README.md
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
* Database and S3 initialization containers

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

Local MinIO credentials:

```text
Access Key: dummy
Secret Key: dummy123
```

The `loyalty-cards` bucket and DynamoDB table are created automatically.

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

The S3 bridge invokes Lambda through SAM Local:

```bash
sam local start-lambda --docker-network lambda-api
```

SAM Lambda endpoint:

```text
http://localhost:3001
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

## 7. Test CSV import

Upload a CSV to MinIO:

```bash
AWS_ACCESS_KEY_ID=dummy \
AWS_SECRET_ACCESS_KEY=dummy123 \
aws s3 cp events/cards.csv s3://loyalty-cards/cards.csv \
  --endpoint-url http://localhost:9000 \
  --region us-east-1
```

This triggers the local S3 event flow and invokes `ImportLoyaltyCardsFunction`.

The Lambda reads the CSV from MinIO and parses its contents.

Example:

```text
Parsed CSV:
[
  { customerName: 'Axel' },
  { customerName: 'Juan' },
  { customerName: 'Maria' }
]
```

## 8. Run tests

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

<img width="1376" height="768" alt="lambda-api-flow" src="https://github.com/user-attachments/assets/093e7bcd-61ab-4f8d-896e-aeda62615ba2" />

---

## Project Goal

The goal is to reproduce a serverless AWS architecture **entirely locally** and understand how the individual AWS components interact.

Local equivalents:

* **DynamoDB Local** → DynamoDB
* **MinIO** → S3
* **SAM Local** → Lambda / API Gateway
* **Docker Compose** → Local infrastructure
* **S3 Event Bridge** → Local S3 → Lambda integration

The final objective is to make the complete architecture reproducible locally while keeping the application structure close to a real AWS environment.
