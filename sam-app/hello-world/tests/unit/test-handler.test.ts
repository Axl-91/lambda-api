import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLoyaltyCard, helloWorldLambda } from '../../app';
import { expect, describe, it } from '@jest/globals';

describe('Hello world function', () => {
    it('GET /hello with valid data', async () => {
        const event = {
            httpMethod: 'GET',
        } as APIGatewayProxyEvent;

        const result: APIGatewayProxyResult = await helloWorldLambda(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'hello world',
            }),
        );
    });
});

describe('Create loyalty card', () => {
    it('creates a loyalty card with valid data', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                name: 'Axel',
            }),
        } as APIGatewayProxyEvent;

        const result: APIGatewayProxyResult = await createLoyaltyCard(event);

        expect(result.statusCode).toEqual(201);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Created',
            }),
        );
    });
});
