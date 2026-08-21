import { LoyaltyCard } from '../models/loyalty-card';
import { v4 as uuidv4 } from 'uuid';

export class LoyaltyCardService {
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
        return loyaltyCard;
    }
}
