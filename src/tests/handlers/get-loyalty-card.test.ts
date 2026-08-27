import { APIGatewayProxyEvent } from 'aws-lambda';
import {
    InvalidLoyaltyCardError,
    LoyaltyCardNotFoundError,
} from '../../errors/loyalty-cards-errors';
import { getLoyaltyCard } from '../../handlers/get-loyalty-card';
import { loyaltyCardService } from '../../infrastructure/dependencies';
import { createLoyaltyCardFixture } from '../factories/loyalty-card-factory';

jest.mock('../../infrastructure/dependencies', () => ({
    loyaltyCardService: {
        getById: jest.fn(),
    },
}));

describe('getLoyaltyCard', () => {
    const getByIdMock = loyaltyCardService.getById as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createEvent = (id?: string): APIGatewayProxyEvent =>
        ({
            pathParameters: id ? { id } : null,
        }) as APIGatewayProxyEvent;

    it('should return 200 when the loyalty card exists', async () => {
        const loyaltyCard = createLoyaltyCardFixture();

        getByIdMock.mockResolvedValue(loyaltyCard);

        const result = await getLoyaltyCard(createEvent(loyaltyCard.id));

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(loyaltyCard),
        });

        expect(getByIdMock).toHaveBeenCalledWith(loyaltyCard.id);
    });

    it('should return 400 when the id is invalid', async () => {
        const error = new InvalidLoyaltyCardError('id is required');

        getByIdMock.mockRejectedValue(error);

        const result = await getLoyaltyCard(createEvent(''));

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'id is required',
            }),
        });
    });

    it('should return 404 when the loyalty card does not exist', async () => {
        const error = new LoyaltyCardNotFoundError();

        getByIdMock.mockRejectedValue(error);

        const id = crypto.randomUUID();

        const result = await getLoyaltyCard(createEvent(id));

        expect(result).toEqual({
            statusCode: 404,
            body: JSON.stringify({
                message: 'Loyalty card not found',
            }),
        });

        expect(getByIdMock).toHaveBeenCalledWith(id);
    });

    it('should return 500 when an unexpected error occurs', async () => {
        getByIdMock.mockRejectedValue(new Error('Unexpected error'));

        const id = crypto.randomUUID();

        const result = await getLoyaltyCard(createEvent(id));

        expect(result).toEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        });

        expect(getByIdMock).toHaveBeenCalledWith(id);
    });
});
