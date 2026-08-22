# Lambda API

Serverless REST API built with **AWS Lambda**, **API Gateway**, **DynamoDB**, **S3** and **SQS**, using **Node.js + TypeScript** and **AWS SAM**.

The entire application is developed and tested **locally** using SAM Local and Docker. No AWS deployment is required.

## Architecture

The project follows a simplified Clean Architecture approach:

```text
API Gateway
     │
     ▼
Lambda Handler
     │
     ▼
  Service
     │
     ▼
 Repository
     │
     ▼
 DynamoDB
```

For the CSV import flow:

```text
CSV
 │
 ▼
S3
 │
 ▼
Lambda
 │
 ▼
SQS
 │
 ▼
Lambda
 │
 ▼
DynamoDB
```

All AWS services are simulated locally for development and testing.

## API Endpoints

| Method | Endpoint              | Description              | Status         |
| ------ | --------------------- | ------------------------ | -------------- |
| POST   | `/loyalty-cards`      | Create a loyalty card    | 🚧 In progress |
| GET    | `/loyalty-cards/{id}` | Get a loyalty card by ID | 🚧 In progress |
| GET    | `/loyalty-cards`      | Get all loyalty cards    | 🚧 In progress |

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
* [ ] Centralize HTTP error handling if it becomes repetitive

### 5. Testing

* [x] Configure Jest
* [x] Add Lambda handler tests
* [ ] Add service unit tests
* [ ] Add repository tests
* [ ] Add validation/error tests
* [ ] Mock DynamoDB where appropriate
* [ ] Add integration tests

### 6. CSV Import Pipeline

* [ ] Configure S3 locally
* [ ] Create Lambda triggered by new CSV files
* [ ] Parse CSV files
* [ ] Send each loyalty card to SQS
* [ ] Configure SQS locally
* [ ] Create Lambda triggered by SQS
* [ ] Process SQS messages
* [ ] Reuse `LoyaltyCardService` to persist cards in DynamoDB
* [ ] Handle failed messages and retries
* [ ] Test the complete pipeline locally

```text
CSV → S3 → Lambda → SQS → Lambda → DynamoDB
```

### 7. Local AWS Infrastructure

* [x] Configure API Gateway
* [x] Configure DynamoDB
* [x] Configure Lambda permissions / IAM
* [x] Configure Lambda environment variables
* [x] Configure Docker network for local AWS services
* [ ] Configure S3
* [ ] Configure SQS
* [ ] Configure all required AWS resources in `template.yaml`
* [ ] Automate DynamoDB table creation
* [ ] Persist DynamoDB Local data across container restarts
* [ ] Make the complete architecture runnable locally
* [ ] Test the complete application locally with SAM and Docker

### 8. Project Structure & Cleanup

* [ ] Replace the `hello-world` naming
* [ ] Reorganize `lambda-api/sam-app/hello-world` into a cleaner structure
* [ ] Review Lambda, service, repository, and model organization
* [ ] Remove unnecessary duplication
* [ ] Review configuration and environment variables
* [ ] Update the README with the final local setup

## Local Development

Build the SAM application:

```bash
sam build
```

Start the local API:

```bash
sam local start-api
```

The API will be available at:

```text
http://localhost:3000
```

Example:

```bash
curl -X POST http://localhost:3000/loyalty-cards \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Axel"}'
```

Run tests:

```bash
npm test
```

## Loyalty Card Model

```typescript
interface LoyaltyCard {
    id: string;
    customerName: string;
    points: number;
    createdAt: string;
}
```

A newly created loyalty card looks like:

```json
{
    "id": "8f7c0c8e-8e5b-4a8d-9f6a-2f8e3e6d5c21",
    "customerName": "Axel",
    "points": 0,
    "createdAt": "2026-08-21T23:20:00.000Z"
}
```

## Tech Stack

* **Node.js**
* **TypeScript**
* **AWS Lambda**
* **Amazon API Gateway**
* **Amazon DynamoDB**
* **Amazon S3**
* **Amazon SQS**
* **AWS SAM**
* **Docker**
* **Jest**

## Project Goal

The goal of this project is to reproduce a serverless AWS architecture **entirely locally** and test the interaction between its components without requiring an AWS account or deploying resources to the cloud.
