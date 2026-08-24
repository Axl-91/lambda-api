export class LambdaInvoker {
    constructor(private readonly endpoint: string) {}

    async invoke(functionName: string, payload: unknown) {
        const response = await fetch(
            `${this.endpoint}/2015-03-31/functions/${functionName}/invocations`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            },
        );

        if (!response.ok) {
            throw new Error(`Failed to invoke Lambda: ${response.status}`);
        }

        return response;
    }
}
