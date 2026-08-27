import { S3Event } from 'aws-lambda';
import { importLoyaltyCards } from '../../handlers/import-loyalty-cards';
import { s3Client } from '../../infrastructure/s3-client';
import { sendMessage } from '../../infrastructure/sqs-client';

jest.mock('../../infrastructure/s3-client', () => ({
    s3Client: {
        send: jest.fn(),
    },
}));

jest.mock('../../infrastructure/sqs-client', () => ({
    sendMessage: jest.fn(),
}));

describe('importLoyaltyCards', () => {
    const s3SendMock = s3Client.send as jest.Mock;
    const sendMessageMock = sendMessage as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createEvent = (bucket: string, key: string): S3Event =>
        ({
            Records: [
                {
                    s3: {
                        bucket: {
                            name: bucket,
                        },
                        object: {
                            key,
                        },
                    },
                },
            ],
        }) as S3Event;

    it('should import loyalty cards from CSV and send them to SQS', async () => {
        const bucket = `bucket-${crypto.randomUUID()}`;
        const key = 'loyalty-cards.csv';

        const csv = `customerName
Axel
Juan
Maria`;

        const event = createEvent(bucket, key);

        s3SendMock.mockResolvedValue({
            Body: {
                transformToString: jest.fn().mockResolvedValue(csv),
            },
        });

        sendMessageMock.mockResolvedValue(undefined);

        const result = await importLoyaltyCards(event);

        expect(s3SendMock).toHaveBeenCalledTimes(1);
        expect(sendMessageMock).toHaveBeenCalledTimes(3);

        expect(sendMessageMock).toHaveBeenNthCalledWith(1, {
            customerName: 'Axel',
        });

        expect(sendMessageMock).toHaveBeenNthCalledWith(2, {
            customerName: 'Juan',
        });

        expect(sendMessageMock).toHaveBeenNthCalledWith(3, {
            customerName: 'Maria',
        });

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                message: 'CSV imported successfully',
                cards: [
                    { customerName: 'Axel' },
                    { customerName: 'Juan' },
                    { customerName: 'Maria' },
                ],
            }),
        });
    });

    it('should throw an error when the CSV file is empty', async () => {
        const bucket = `bucket-${crypto.randomUUID()}`;
        const key = 'loyalty-cards.csv';

        const event = createEvent(bucket, key);

        s3SendMock.mockResolvedValue({
            Body: {
                transformToString: jest.fn().mockResolvedValue(''),
            },
        });

        await expect(importLoyaltyCards(event)).rejects.toThrow('CSV file is empty');

        expect(s3SendMock).toHaveBeenCalledTimes(1);
        expect(sendMessageMock).not.toHaveBeenCalled();
    });
});
