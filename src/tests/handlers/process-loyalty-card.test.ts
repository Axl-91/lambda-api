import { SQSEvent } from 'aws-lambda';
import { processLoyaltyCard } from '../../handlers/process-loyalty-card';
import { loyaltyCardService } from '../../infrastructure/dependencies';

jest.mock('../../infrastructure/dependencies', () => ({
    loyaltyCardService: {
        create: jest.fn(),
    },
}));

describe('processLoyaltyCard', () => {
    const createMock = loyaltyCardService.create as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createEvent = (customerNames: string[]): SQSEvent =>
        ({
            Records: customerNames.map((customerName) => ({
                body: JSON.stringify({
                    customerName,
                }),
            })),
        }) as SQSEvent;

    it('should create a loyalty card from an SQS message', async () => {
        const customerName = `Customer-${crypto.randomUUID()}`;

        createMock.mockResolvedValue(undefined);

        await processLoyaltyCard(createEvent([customerName]));

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith(customerName);
    });

    it('should process multiple SQS messages', async () => {
        const customerNames = [
            `Customer-${crypto.randomUUID()}`,
            `Customer-${crypto.randomUUID()}`,
            `Customer-${crypto.randomUUID()}`,
        ];

        createMock.mockResolvedValue(undefined);

        await processLoyaltyCard(createEvent(customerNames));

        expect(createMock).toHaveBeenCalledTimes(3);

        expect(createMock).toHaveBeenNthCalledWith(1, customerNames[0]);
        expect(createMock).toHaveBeenNthCalledWith(2, customerNames[1]);
        expect(createMock).toHaveBeenNthCalledWith(3, customerNames[2]);
    });
});
