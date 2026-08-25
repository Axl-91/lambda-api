import http from 'node:http';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import 'dotenv/config';

const region = process.env.AWS_REGION ?? 'us-east-1';
const endpoint = process.env.SAM_LAMBDA_ENDPOINT ?? 'http://127.0.0.1:3001';

const lambda = new LambdaClient({
    region,
    endpoint,
});

const server = http.createServer((req, res) => {
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end();
        return;
    }

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            console.log('S3 event received:', body);

            await lambda.send(
                new InvokeCommand({
                    FunctionName: 'ImportLoyaltyCardsFunction',
                    Payload: Buffer.from(body),
                }),
            );

            res.writeHead(200, {
                'Content-Type': 'application/json',
            });

            res.end(
                JSON.stringify({
                    message: 'Lambda invoked successfully',
                }),
            );
        } catch (error) {
            console.error('Failed to invoke Lambda:', error);

            res.writeHead(500, {
                'Content-Type': 'application/json',
            });

            res.end(
                JSON.stringify({
                    message: 'Failed to invoke Lambda',
                }),
            );
        }
    });
});

server.listen(4000, '0.0.0.0', () => {
    console.log('S3 event bridge listening on port 4000');
});
