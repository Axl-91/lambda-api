import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LoyaltyCard } from './models/loyalty-card';

export const getLoyaltyCards = async (
    _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify([
                {
                    id: '10',
                    customerName: 'Axel',
                    points: 0,
                    createdAt: new Date().toISOString(),
                },
            ]),
        };
    } catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

export const getLoyaltyCard = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;

        return {
            statusCode: 200,
            body: JSON.stringify({
                id,
                customerName: 'Axel',
                points: 0,
                createdAt: new Date().toISOString(),
            }),
        };
    } catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

export const createLoyaltyCard = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body ?? '{}');
        const loyaltyCard: LoyaltyCard = {
            id: '1',
            customerName: body.customer_name,
            points: 0,
            createdAt: new Date().toISOString(),
        };

        console.log(loyaltyCard);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Created',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
