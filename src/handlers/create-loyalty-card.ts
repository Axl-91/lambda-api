import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { loyaltyCardService } from '../infrastructure/dependencies';
import { handleHttpError } from '../utils/http-error-handler';

export const createLoyaltyCard = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body ?? '{}');
        const loyaltyCard = await loyaltyCardService.create(body.customerName);

        return {
            statusCode: 201,
            body: JSON.stringify(loyaltyCard),
        };
    } catch (err) {
        return handleHttpError(err);
    }
};
