import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LoyaltyCardService } from './services/loyalty-card-service';
import { LoyaltyCardRepository } from './repositories/loyalty-card-repository';
import { InvalidLoyaltyCardError, LoyaltyCardNotFoundError } from './errors/loyalty-cards-errors';

const repository = new LoyaltyCardRepository(process.env.LOYALTY_CARDS_TABLE!);

const loyaltyCardService = new LoyaltyCardService(repository);

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
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
