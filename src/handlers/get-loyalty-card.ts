import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { loyaltyCardService } from '../infrastructure/dependencies';
import { InvalidLoyaltyCardError, LoyaltyCardNotFoundError } from '../errors/loyalty-cards-errors';

export const getLoyaltyCard = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;
        console.log(`El id es ${id}`);

        const loyaltyCard = await loyaltyCardService.getById(id ?? '');

        return {
            statusCode: 200,
            body: JSON.stringify(loyaltyCard),
        };
    } catch (err) {
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
    }
};
