import { APIGatewayProxyResult } from 'aws-lambda';
import { InvalidLoyaltyCardError, LoyaltyCardNotFoundError } from '../errors/loyalty-cards-errors';

export const handleHttpError = (err: unknown): APIGatewayProxyResult => {
    console.log(err);

    if (err instanceof InvalidLoyaltyCardError) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }

    if (err instanceof LoyaltyCardNotFoundError) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }

    return {
        statusCode: 500,
        body: JSON.stringify({
            message: 'Internal server error',
        }),
    };
};
