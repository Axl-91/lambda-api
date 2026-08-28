import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { loyaltyCardService } from '../infrastructure/dependencies';
import { handleHttpError } from '../utils/http-error-handler';

export const getLoyaltyCards = async (
    _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const loyaltyCards = await loyaltyCardService.getAll();

        return {
            statusCode: 200,
            body: JSON.stringify(loyaltyCards),
        };
    } catch (err) {
        return handleHttpError(err);
    }
};
