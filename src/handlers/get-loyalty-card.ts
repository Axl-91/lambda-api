import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { loyaltyCardService } from '../infrastructure/dependencies';
import { handleHttpError } from '../utils/http-error-handler';

export const getLoyaltyCard = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;

        const loyaltyCard = await loyaltyCardService.getById(id ?? '');

        return {
            statusCode: 200,
            body: JSON.stringify(loyaltyCard),
        };
    } catch (err) {
        return handleHttpError(err);
    }
};
