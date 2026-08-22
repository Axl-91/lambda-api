import { LoyaltyCardRepository } from '../repositories/loyalty-card-repository';
import { LoyaltyCardService } from '../services/loyalty-card-service';

const repository = new LoyaltyCardRepository(process.env.LOYALTY_CARDS_TABLE!);

export const loyaltyCardService = new LoyaltyCardService(repository);
