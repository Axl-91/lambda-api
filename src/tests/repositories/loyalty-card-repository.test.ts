import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { LoyaltyCardRepository } from '../../repositories/loyalty-card-repository';

describe('LoyaltyCardRepository', () => {
    const sendMock = jest.fn();

    let repository: LoyaltyCardRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        const dbMock = { send: sendMock };

        repository = new LoyaltyCardRepository('LoyaltyCards', dbMock);
    });

    describe('create', () => {
        it('should create a loyalty card', async () => {
            const loyaltyCard = {
                id: '123',
                customerName: 'Axel',
                points: 0,
                createdAt: '2026-08-27T00:00:00.000Z',
            };

            sendMock.mockResolvedValue({});

            await repository.create(loyaltyCard);

            expect(sendMock).toHaveBeenCalledTimes(1);
            expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
        });
    });

    describe('getById', () => {
        it('should return a loyalty card when it exists', async () => {
            const loyaltyCard = {
                id: '123',
                customerName: 'Axel',
                points: 100,
                createdAt: '2026-08-27T00:00:00.000Z',
            };

            sendMock.mockResolvedValue({
                Item: loyaltyCard,
            });

            const result = await repository.getById('123');

            expect(sendMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(loyaltyCard);
        });

        it('should return undefined when the loyalty card does not exist', async () => {
            sendMock.mockResolvedValue({
                Item: undefined,
            });

            const result = await repository.getById('non-existent-id');

            expect(sendMock).toHaveBeenCalledTimes(1);
            expect(result).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('should return all loyalty cards', async () => {
            const loyaltyCards = [
                {
                    id: '123',
                    customerName: 'Axel',
                    points: 100,
                    createdAt: '2026-08-27T00:00:00.000Z',
                },
                {
                    id: '456',
                    customerName: 'Juan',
                    points: 50,
                    createdAt: '2026-08-27T01:00:00.000Z',
                },
            ];

            sendMock.mockResolvedValue({
                Items: loyaltyCards,
            });

            const result = await repository.getAll();

            expect(sendMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(loyaltyCards);
        });

        it('should return an empty array when there are no loyalty cards', async () => {
            sendMock.mockResolvedValue({
                Items: undefined,
            });

            const result = await repository.getAll();

            expect(sendMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
        });
    });
});
