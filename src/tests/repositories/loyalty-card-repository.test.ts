import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { LoyaltyCardRepository } from '../../repositories/loyalty-card-repository';
import { createLoyaltyCardFixture } from '../factories/loyalty-card-factory';

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
            const loyaltyCard = createLoyaltyCardFixture();

            sendMock.mockResolvedValue({});

            await repository.create(loyaltyCard);

            expect(sendMock).toHaveBeenCalledTimes(1);
            expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
        });

        it('should propagate DynamoDB errors', async () => {
            const error = new Error('DynamoDB error');

            sendMock.mockRejectedValue(error);

            const loyaltyCard = createLoyaltyCardFixture();

            await expect(repository.create(loyaltyCard)).rejects.toThrow('DynamoDB error');
        });
    });

    describe('getById', () => {
        it('should return a loyalty card when it exists', async () => {
            const loyaltyCard = createLoyaltyCardFixture();

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

        it('should propagate DynamoDB errors', async () => {
            const error = new Error('DynamoDB error');

            sendMock.mockRejectedValue(error);

            await expect(repository.getById('123')).rejects.toThrow('DynamoDB error');
        });
    });

    describe('getAll', () => {
        it('should return all loyalty cards', async () => {
            const loyaltyCards = [createLoyaltyCardFixture(), createLoyaltyCardFixture()];

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

        it('should propagate DynamoDB errors', async () => {
            const error = new Error('DynamoDB error');

            sendMock.mockRejectedValue(error);

            await expect(repository.getAll()).rejects.toThrow('DynamoDB error');
        });
    });
});
