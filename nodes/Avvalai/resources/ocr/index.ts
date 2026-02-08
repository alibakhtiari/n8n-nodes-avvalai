import { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const ocrDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['ocr'],
            },
        },
        options: [
            {
                name: 'Process',
                value: 'process',
                action: 'Process a document',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/ocr',
                    },
                },
            },
        ],
        default: 'process',
    },
    {
        displayName: 'Model Name or ID',
        name: 'model',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
            loadOptionsMethod: 'getModels',
        },
        required: true,
        default: 'mistral-ocr-latest',
        displayOptions: {
            show: {
                resource: ['ocr'],
                operation: ['process'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'model',
            },
        },
    },
    {
        displayName: 'Document URL',
        name: 'document_url',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['ocr'],
                operation: ['process'],
            },
        },
        description: 'URL of the document or image to process',
        routing: {
            send: {
                type: 'body',
                property: 'document',
                value: '={{ { "type": $parameter.document_url.match(/\\.(jpg|jpeg|png|webp)$/i) ? "image_url" : "document_url", "document_url": $parameter.document_url, "image_url": $parameter.document_url } }}',
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['ocr'],
                operation: ['process'],
            },
        },
        options: [
            {
                displayName: 'Includes Image Base64',
                name: 'include_image_base64',
                type: 'boolean',
                default: false,
                description: 'Whether to include extracted images as base64 strings',
            },
            {
                displayName: 'Table Format',
                name: 'table_format',
                type: 'options',
                options: [
                    { name: 'Markdown', value: 'markdown' },
                    { name: 'HTML', value: 'html' },
                ],
                default: 'markdown',
                description: 'Format for extracted tables',
            },
            {
                displayName: 'Pages',
                name: 'pages',
                type: 'string',
                default: '',
                description: 'Access specific pages (e.g., "0, 1, 5")',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'additionalFields', // Will be merged? No, I need to merge manually or map properties.
                // n8n collections don't auto-merge into root unless we use map or preSend.
                // I'll use preSend or flatten logic.
                // Actually, simpler to just map properties one by one in routing if possible?
                // But "additionalFields" is a collection.
                // I'll use a preSend to merge additionalFields into body.
                preSend: [
                    async function (
                        this: IExecuteSingleFunctions,
                        requestOptions: IHttpRequestOptions,
                    ): Promise<IHttpRequestOptions> {
                        const additionalFields = this.getNodeParameter('additionalFields', {}) as Record<string, unknown>;
                        const body = requestOptions.body as Record<string, unknown>;

                        Object.assign(body, additionalFields);

                        // Handle 'pages' string to array
                        if (body.pages && typeof body.pages === 'string') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            body.pages = (body.pages as string).split(',').map((p: string) => parseInt(p.trim(), 10)).filter((n: number) => !isNaN(n));
                        }

                        return requestOptions;
                    },
                ],
            },
        },
    },
];
