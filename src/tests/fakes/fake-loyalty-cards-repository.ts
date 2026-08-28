import { LoyaltyCard } from '../../models/loyalty-card.interface';
import { ILoyaltyCardRepository } from '../../repositories/loyalty-card-repository.interface';

export class FakeLoyaltyCardRepository implements ILoyaltyCardRepository {
    private cards: LoyaltyCard[] = [];

    async create(card: LoyaltyCard): Promise<void> {
        this.cards.push(card);
    }

    async getById(id: string): Promise<LoyaltyCard | undefined> {
        return this.cards.find((card) => card.id === id);
    }

    async getAll(): Promise<LoyaltyCard[]> {
        return this.cards;
    }
}
