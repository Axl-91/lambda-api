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
* [ ] Persist the loyalty card in DynamoDB

### 2. DynamoDB & Repository

* [ ] Configure DynamoDB locally
* [ ] Create the loyalty cards table
* [ ] Create `LoyaltyCardRepository`
* [ ] Implement `create`
* [ ] Implement `get`
* [ ] Implement `getAll`
* [ ] Connect `Service → Repository → DynamoDB`

### 3. GET Endpoints

* [ ] Implement `GET /loyalty-cards/{id}`
* [ ] Implement `GET /loyalty-cards`
* [ ] Retrieve data from DynamoDB
* [ ] Handle `404 Not Found`
* [ ] Handle database errors

### 4. Architecture & Error Handling

* [ ] Separate Lambda handlers/controllers from business logic
* [ ] Keep business logic inside services
* [ ] Keep database access inside repositories
* [ ] Define application/domain errors
* [ ] Map errors to appropriate HTTP status codes (`400`, `404`, `500`, etc.)

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
* [ ] Persist cards in DynamoDB
* [ ] Test the complete pipeline locally

```text
CSV → S3 → Lambda → SQS → Lambda → DynamoDB
```

### 7. Local AWS Infrastructure

* [ ] Configure all required AWS resources in `template.yaml`
* [ ] Configure DynamoDB
* [ ] Configure S3
* [ ] Configure SQS
* [ ] Configure Lambda permissions / IAM
* [ ] Configure API Gateway
* [ ] Make the complete architecture runnable locally
* [ ] Test the complete application locally with SAM and Docker

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
