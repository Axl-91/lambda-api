import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const region = process.env.AWS_REGION ?? 'us-east-1';

const credentials = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? 'dummy',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? 'dummy123',
};

const endpoint = process.env.S3_ENDPOINT ?? 'http://localhost:9000';
const bucket = process.env.S3_BUCKET ?? 'loyalty-cards';

const main = async () => {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error('Usage: npm run local:upload-csv -- <file>');
        process.exit(1);
    }

    if (!existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    try {
        await execFileAsync(
            'aws',
            [
                's3',
                'cp',
                filePath,
                `s3://${bucket}/`,
                '--endpoint-url',
                endpoint,
                '--region',
                region,
            ],
            {
                env: {
                    ...process.env,
                    ...credentials,
                },
            },
        );

        console.log(`CSV uploaded successfully: ${filePath}`);
    } catch (error) {
        console.error('Failed to upload CSV:', error);
        process.exit(1);
    }
};

main().catch((error) => {
    console.error('Upload script failed:', error);
    process.exit(1);
});
