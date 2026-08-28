import { LoyaltyCard } from '../../models/loyalty-card.interface';

export const createLoyaltyCardFixture = (): LoyaltyCard => ({
    id: crypto.randomUUID(),
    customerName: `Customer-${crypto.randomUUID()}`,
    points: Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
});
