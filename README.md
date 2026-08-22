# Lambda API

Serverless REST API built with **AWS Lambda**, **API Gateway**, **DynamoDB**, **S3** and **SQS**, using **Node.js + TypeScript** and **AWS SAM**.

The entire application is developed and tested **locally** using SAM Local and Docker. No AWS deployment is required.

## Architecture

The project follows a simplified Clean Architecture approach:

```text
API Gateway → Lambda Handler → Service → Repository → DynamoDB
```

For the CSV import flow:

```text
CSV → S3 → Lambda → SQS → Lambda → DynamoDB
```

All AWS services are simulated locally for development and testing.

## API Endpoints

| Method | Endpoint              | Description              | Status |
| ------ | --------------------- | ------------------------ | ------ |
| POST   | `/loyalty-cards`      | Create a loyalty card    | ✅ Done |
| GET    | `/loyalty-cards/{id}` | Get a loyalty card by ID | ✅ Done |
| GET    | `/loyalty-cards`      | Get all loyalty cards    | ✅ Done |

## Progress

### 1. Create Loyalty Card

* [x] Create `POST /loyalty-cards` endpoint
* [x] Create `createLoyaltyCard` Lambda handler
* [x] Create `LoyaltyCard` model
* [x] Create `LoyaltyCardService`
* [x] Validate `customerName`
* [x] Generate a UUID for the loyalty card
* [x] Initialize `points` to `0`
* [x] Generate `createdAt`
* [x] Test the endpoint locally with SAM
* [x] Persist the loyalty card in DynamoDB

### 2. DynamoDB & Repository

* [x] Configure DynamoDB locally
* [x] Create the loyalty cards table
* [x] Create `LoyaltyCardRepository`
* [x] Implement `create`
* [x] Implement `get`
* [x] Implement `getAll`
* [x] Connect `Service → Repository → DynamoDB`
* [x] Configure DynamoDB environment variables
* [x] Configure Lambda DynamoDB permissions
* [x] Map DynamoDB items to `LoyaltyCard`

### 3. GET Endpoints

* [x] Implement `GET /loyalty-cards/{id}`
* [x] Implement `GET /loyalty-cards`
* [x] Retrieve data from DynamoDB
* [x] Handle `404 Not Found`
* [x] Handle database errors
* [x] Test both endpoints locally with SAM

### 4. Architecture & Error Handling

* [x] Separate Lambda handlers/controllers from business logic
* [x] Keep business logic inside services
* [x] Keep database access inside repositories
* [x] Define application/domain errors
* [x] Map errors to appropriate HTTP status codes (`400`, `404`, `500`, etc.)
* [x] Centralize service/repository dependency creation
* [ ] Centralize HTTP error handling if it becomes repetitive

### 5. Testing

* [x] Configure Jest
* [x] Add Lambda handler tests
* [x] Add service unit tests
* [ ] Add repository tests
* [ ] Add validation/error tests
* [ ] Mock DynamoDB where appropriate
* [ ] Add integration tests

### 6. CSV Import Pipeline

* [x] Configure S3 locally
* [x] Create Lambda triggered by new CSV files
* [x] Parse CSV files
* [ ] Send each loyalty card to SQS
* [ ] Configure SQS locally
* [ ] Create Lambda triggered by SQS
* [ ] Process SQS messages
* [ ] Reuse `LoyaltyCardService` to persist cards in DynamoDB
* [ ] Handle failed messages and retries
* [ ] Test the complete pipeline

```text
CSV → S3 → Lambda → SQS → Lambda → DynamoDB
```

### 7. Local AWS Infrastructure

* [x] Configure API Gateway
* [x] Configure DynamoDB
* [x] Configure Lambda permissions / IAM
* [x] Configure Lambda environment variables
* [x] Configure shared Docker network (`lambda-api`)
* [x] Configure persistent DynamoDB volume
* [x] Automate DynamoDB table creation
* [x] Configure SAM to use the shared Docker network
* [ ] Configure S3
* [ ] Configure SQS
* [ ] Configure all required AWS resources in `template.yaml`
* [ ] Make the complete architecture runnable locally
* [ ] Test the complete application locally with SAM and Docker

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
├── template.yaml
├── samconfig.toml
├── tsconfig.json
├── jest.config.ts
├── package.json
├── package-lock.json
├── docker-compose.yml
├── docker/
│   └── dynamodb/
│       └── init.sh
└── README.md
```

## Local Development

The local environment uses **Docker Compose for AWS infrastructure** and **AWS SAM Local for the Lambda/API layer**.

### 1. Start local AWS infrastructure

Start DynamoDB Local and automatically initialize the `LoyaltyCards` table:

```bash
docker compose up
```

This starts:

* DynamoDB Local
* DynamoDB initialization container
* Persistent DynamoDB storage

The DynamoDB container is connected to the shared Docker network:

```text
lambda-api
```

The `dynamodb-init` container automatically creates the `LoyaltyCards` table if it does not already exist.

DynamoDB Local is available from the host at:

```text
http://localhost:8000
```

Inside the Docker network, Lambda containers access it through:

```text
http://dynamodb:8000
```

### 2. Build the SAM application

In another terminal:

```bash
sam build
```

### 3. Start the local API with SAM

Start SAM Local using the same Docker network as DynamoDB:

```bash
sam local start-api --docker-network lambda-api
```

This is important because the Lambda containers created by SAM need to communicate with DynamoDB using the Docker hostname:

```text
dynamodb:8000
```

The local API will be available at:

```text
http://localhost:3000
```

### 4. Test the API

Create a loyalty card:

```bash
curl -X POST http://localhost:3000/loyalty-cards \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Axel"}'
```

Get a loyalty card by ID:

```bash
curl http://localhost:3000/loyalty-cards/{id}
```

Get all loyalty cards:

```bash
curl http://localhost:3000/loyalty-cards
```

### 5. Run tests

```bash
npm test
```

## Project Goal

The goal of this project is to reproduce a serverless AWS architecture **entirely locally** and test the interaction between its components without requiring an AWS account or deploying resources to the cloud.
