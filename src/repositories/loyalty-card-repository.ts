import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { LoyaltyCard } from '../models/loyalty-card';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? 'us-east-1',
    endpoint: process.env.DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(client);

export class LoyaltyCardRepository {
    constructor(private readonly tableName: string) {}

    private mapToLoyaltyCard(item: Record<string, unknown>): LoyaltyCard {
        return {
            id: item.id as string,
            customerName: item.customerName as string,
            points: item.points as number,
            createdAt: item.createdAt as string,
        };
    }

    async create(loyaltyCard: LoyaltyCard): Promise<void> {
        await dynamoDb.send(
            new PutCommand({
                TableName: this.tableName,
                Item: loyaltyCard,
            }),
        );
    }
    async getById(id: string): Promise<LoyaltyCard | undefined> {
        const result = await dynamoDb.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { id },
            }),
        );

        return result.Item ? this.mapToLoyaltyCard(result.Item) : undefined;
    }

    async getAll(): Promise<LoyaltyCard[]> {
        const result = await dynamoDb.send(
            new ScanCommand({
                TableName: this.tableName,
            }),
        );

        return (result.Items ?? []).map((item) => this.mapToLoyaltyCard(item));
    }
}
