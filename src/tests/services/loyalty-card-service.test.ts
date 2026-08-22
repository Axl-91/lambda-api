import { LoyaltyCardNotFoundError } from '../../errors/loyalty-cards-errors';
import { LoyaltyCardService } from '../../services/loyalty-card-service';
import { FakeLoyaltyCardRepository } from '../fakes/fake-loyalty-cards-repository';
jest.mock('uuid');

describe('LoyaltyCardService', () => {
    let repository: FakeLoyaltyCardRepository;
    let service: LoyaltyCardService;

    beforeEach(() => {
        repository = new FakeLoyaltyCardRepository();
        service = new LoyaltyCardService(repository);
    });

    describe('create', () => {
        it('should create a loyalty card', async () => {
            const customerName = 'Axel';

            const result = await service.create(customerName);

            expect(result).toMatchObject({
                customerName,
                points: 0,
            });

            expect(result.id).toBeDefined();
            expect(result.createdAt).toBeDefined();
        });

        it('should persist the created loyalty card', async () => {
            const result = await service.create('Axel');

            const storedCard = await repository.getById(result.id);

            expect(storedCard).toEqual(result);
        });
    });

    describe('get', () => {
        it('should return a loyalty card by id', async () => {
            const createdCard = await service.create('Axel');

            const result = await service.getById(createdCard.id);

            expect(result).toEqual(createdCard);
        });

        it('should throw LoyaltyCardNotFoundError when the loyalty card does not exist', async () => {
            await expect(service.getById('non-existent-id')).rejects.toThrow(
                LoyaltyCardNotFoundError,
            );
        });
    });

    describe('getAll', () => {
        it('should return all loyalty cards', async () => {
            await service.create('Axel');
            await service.create('Juan');
            await service.create('Maria');

            const result = await service.getAll();

            expect(result).toHaveLength(3);
            expect(result.map((card) => card.customerName)).toEqual(['Axel', 'Juan', 'Maria']);
        });

        it('should return an empty array when there are no loyalty cards', async () => {
            const result = await service.getAll();

            expect(result).toEqual([]);
        });
    });
});
