import { APIGatewayProxyEvent } from 'aws-lambda';
import { getLoyaltyCards } from '../../handlers/get-loyalty-cards';
import { loyaltyCardService } from '../../infrastructure/dependencies';
import { createLoyaltyCardFixture } from '../factories/loyalty-card-factory';

jest.mock('../../infrastructure/dependencies', () => ({
    loyaltyCardService: {
        getAll: jest.fn(),
    },
}));

describe('getLoyaltyCards', () => {
    const getAllMock = loyaltyCardService.getAll as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const event = {} as APIGatewayProxyEvent;

    it('should return 200 with all loyalty cards', async () => {
        const loyaltyCards = [createLoyaltyCardFixture(), createLoyaltyCardFixture()];

        getAllMock.mockResolvedValue(loyaltyCards);

        const result = await getLoyaltyCards(event);

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(loyaltyCards),
        });

        expect(getAllMock).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when an error occurs', async () => {
        getAllMock.mockRejectedValue(new Error('Unexpected error'));

        const result = await getLoyaltyCards(event);

        expect(result).toEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        });

        expect(getAllMock).toHaveBeenCalledTimes(1);
    });
});
