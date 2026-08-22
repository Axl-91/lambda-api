import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { expect, describe, it } from '@jest/globals';
import { createLoyaltyCard } from '../../handlers/create-loyalty-card';

describe('Create loyalty card', () => {
    it('creates a loyalty card with valid data', async () => {
        console.log('TODO');
    });
});
