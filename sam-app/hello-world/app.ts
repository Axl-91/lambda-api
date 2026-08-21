import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LoyaltyCard } from './models/loyalty-card';

export const helloWorldLambda = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
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

export const createLoyaltyCard = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
