import { APIGatewayProxyEvent } from 'aws-lambda';
import { createLoyaltyCard } from '../../handlers/create-loyalty-card';
import { loyaltyCardService } from '../../infrastructure/dependencies';
import { createLoyaltyCardFixture } from '../factories/loyalty-card-factory';

jest.mock('../../infrastructure/dependencies', () => ({
    loyaltyCardService: {
        create: jest.fn(),
    },
}));

describe('createLoyaltyCard', () => {
    const createMock = loyaltyCardService.create as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createEvent = (body: string | null): APIGatewayProxyEvent =>
        ({
            body,
        }) as APIGatewayProxyEvent;

    it('should return 201 when the loyalty card is created', async () => {
        const loyaltyCard = createLoyaltyCardFixture();
        const customerName = loyaltyCard.customerName;

        createMock.mockResolvedValue(loyaltyCard);

        const result = await createLoyaltyCard(createEvent(JSON.stringify({ customerName })));

        expect(result).toEqual({
            statusCode: 201,
            body: JSON.stringify(loyaltyCard),
        });

        expect(createMock).toHaveBeenCalledWith(customerName);
    });

    it('should return 500 when the customer name is missing', async () => {
        createMock.mockRejectedValue(new Error('customerName is required'));

        const result = await createLoyaltyCard(createEvent(null));

        expect(result).toEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        });

        expect(createMock).toHaveBeenCalledWith(undefined);
    });

    it('should return 500 when the request body contains invalid JSON', async () => {
        const result = await createLoyaltyCard(createEvent('invalid-json'));

        expect(result).toEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        });

        expect(createMock).not.toHaveBeenCalled();
    });
});
