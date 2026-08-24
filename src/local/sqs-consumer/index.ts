import {
    DeleteMessageCommand,
    ReceiveMessageCommand,
    SQSClient,
} from '@aws-sdk/client-sqs';

const sqs = new SQSClient({
    endpoint: process.env.SQS_ENDPOINT ?? 'http://localhost:9324',
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'dummy123',
    },
});

const queueUrl =
    process.env.SQS_QUEUE_URL ??
    'http://localhost:9324/000000000000/loyalty-cards';

const lambdaEndpoint =
    process.env.SAM_LAMBDA_ENDPOINT ?? 'http://localhost:3001';

const functionName = 'ProcessLoyaltyCardFunction';

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

        try {
            const response = await fetch(
                `${lambdaEndpoint}/2015-03-31/functions/${functionName}/invocations`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Records: [
                            {
                                messageId: message.MessageId,
                                receiptHandle: message.ReceiptHandle,
                                body: message.Body,
                            },
                        ],
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    `Lambda invocation failed with status ${response.status}`,
                );
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
