import { SQSEvent } from 'aws-lambda';
import { loyaltyCardService } from '../infrastructure/dependencies';

export const processLoyaltyCard = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const card = JSON.parse(record.body);

        await loyaltyCardService.create(card.customerName);
    }
};
