export class LoyaltyCardNotFoundError extends Error {
    constructor() {
        super('Loyalty card not found');
        this.name = 'LoyaltyCardNotFoundError';
    }
}

export class InvalidLoyaltyCardError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidLoyaltyCardError';
    }
}
