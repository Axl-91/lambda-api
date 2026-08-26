import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

const region = process.env.AWS_REGION ?? 'us-east-1';

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'dummy123',
};

const queueUrl = process.env.SQS_QUEUE_URL ?? 'http://localhost:9324/000000000000/loyalty-cards';

const lambdaEndpoint = process.env.SAM_LAMBDA_ENDPOINT ?? 'http://localhost:3001';

const functionName = 'ProcessLoyaltyCardFunction';

const sqs = new SQSClient({
    endpoint: process.env.SQS_ENDPOINT ?? 'http://localhost:9324',
    region,
    credentials,
});

const lambda = new LambdaClient({
    endpoint: lambdaEndpoint,
    region,
    credentials,
});

const poll = async () => {
    const result = await sqs.send(
        new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10,
        }),
    );

    if (!result.Messages?.length) {
        return;
    }

    for (const message of result.Messages) {
        if (!message.Body || !message.ReceiptHandle) {
            continue;
        }

        const recordMsg = JSON.stringify({
            Records: [
                {
                    messageId: message.MessageId,
                    receiptHandle: message.ReceiptHandle,
                    body: message.Body,
                },
            ],
        });

        try {
            const result = await lambda.send(
                new InvokeCommand({
                    FunctionName: functionName,
                    Payload: Buffer.from(recordMsg),
                }),
            );

            if (result.FunctionError) {
                throw new Error(`Lambda execution failed: ${result.FunctionError}`);
            }

            await sqs.send(
                new DeleteMessageCommand({
                    QueueUrl: queueUrl,
                    ReceiptHandle: message.ReceiptHandle,
                }),
            );

            console.log('Message processed successfully:', message.MessageId);
        } catch (error) {
            console.error('Failed to process message:', error);
        }
    }
};

const start = async () => {
    console.log('SQS consumer started');
    console.log(`Queue: ${queueUrl}`);
    console.log(`Lambda: ${functionName}`);

    while (true) {
        await poll();
    }
};

start().catch((error) => {
    console.error('SQS consumer failed:', error);
    process.exit(1);
});
