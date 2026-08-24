import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION ?? 'us-east-1',
    endpoint: process.env.SQS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'dummy',
    },
});

const queueUrl = process.env.SQS_QUEUE_URL;

if (!queueUrl) {
    throw new Error('SQS_QUEUE_URL is not configured');
}

export const sendMessage = async (message: unknown): Promise<void> => {
    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(message),
        }),
    );
};
