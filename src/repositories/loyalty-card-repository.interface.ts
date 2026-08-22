import { LoyaltyCard } from '../models/loyalty-card';

export interface ILoyaltyCardRepository {
    create(card: LoyaltyCard): Promise<void>;
    getById(id: string): Promise<LoyaltyCard | undefined>;
    getAll(): Promise<LoyaltyCard[]>;
}
