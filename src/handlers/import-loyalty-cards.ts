import { GetObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'csv-parse/sync';
import { S3Event } from 'aws-lambda';
import { s3Client } from '../infrastructure/s3-client';
import { LoyaltyCardImport } from '../models/loyalty-card-import.interface';
import { sendMessage } from '../infrastructure/sqs-client';

export const importLoyaltyCards = async (event: S3Event) => {
    const record = event.Records[0];

    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    console.log(`Reading s3://${bucket}/${key}`);

    const response = await s3Client.send(
        new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        }),
    );

    const content = await response.Body?.transformToString();

    if (!content) {
        throw new Error('CSV file is empty');
    }

    const cards: LoyaltyCardImport[] = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    console.log('Parsed CSV:', cards);

    for (const card of cards) {
        await sendMessage(card);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'CSV imported successfully',
            cards,
        }),
    };
};
