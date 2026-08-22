import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { loyaltyCardService } from '../infrastructure/dependencies';

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
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
