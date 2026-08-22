import { LoyaltyCard } from '../models/loyalty-card';
import { v4 as uuidv4 } from 'uuid';
import { LoyaltyCardRepository } from '../repositories/loyalty-card-repository';
import { InvalidLoyaltyCardError, LoyaltyCardNotFoundError } from '../errors/loyalty-cards-errors';
import { ILoyaltyCardRepository } from '../repositories/loyalty-card-repository.interface';

export class LoyaltyCardService {
    constructor(private readonly repository: ILoyaltyCardRepository) {}

    async create(customerName: string): Promise<LoyaltyCard> {
        if (typeof customerName !== 'string') {
            throw new Error('customerName should be string');
        }
        if (customerName.trim().length === 0) {
            throw new Error('customerName is required');
        }

        const loyaltyCard: LoyaltyCard = {
            id: uuidv4(),
            customerName: customerName,
            points: 0,
            createdAt: new Date().toISOString(),
        };

        await this.repository.create(loyaltyCard);

        return loyaltyCard;
    }

    async getById(id: string): Promise<LoyaltyCard | undefined> {
        if (!id || id.trim().length === 0) {
            throw new InvalidLoyaltyCardError('id is required');
        }
        const loyaltyCard = await this.repository.getById(id);

        if (!loyaltyCard) {
            throw new LoyaltyCardNotFoundError();
        }

        return loyaltyCard;
    }

    async getAll(): Promise<LoyaltyCard[]> {
        return this.repository.getAll();
    }
}
