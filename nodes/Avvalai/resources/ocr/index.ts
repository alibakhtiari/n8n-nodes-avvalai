import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

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
                action: 'Process a document with OCR',
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
        typeOptions: {
            loadOptionsMethod: 'getModels',
        },
        required: true,
        default: 'mistral-ocr-latest',
        displayOptions: {
            show: {
                resource: ['ocr'],
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
        displayName: 'Document Type',
        name: 'documentType',
        type: 'options',
        options: [
            {
                name: 'Document URL',
                value: 'document_url',
            },
            {
                name: 'Image URL',
                value: 'image_url',
            },
        ],
        default: 'document_url',
        displayOptions: {
            show: {
                resource: ['ocr'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'document',
                value: '={{ { type: $value, [$value]: $parameter["documentUrl"] } }}',
            },
        },
    },
    {
        displayName: 'Document URL',
        name: 'documentUrl',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['ocr'],
            },
        },
        description: 'URL to the document or image (or base64 data URL)',
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
            },
        },
        options: [
            {
                displayName: 'Extract Header',
                name: 'extract_header',
                type: 'boolean',
                default: false,
                description: 'Whether to extract document headers',
            },
            {
                displayName: 'Extract Footer',
                name: 'extract_footer',
                type: 'boolean',
                default: false,
                description: 'Whether to extract document footers',
            },
            {
                displayName: 'Include Image Base64',
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
                    {
                        name: 'Markdown',
                        value: 'markdown',
                    },
                    {
                        name: 'HTML',
                        value: 'html',
                    },
                ],
                default: 'markdown',
                description: 'Format for extracted tables',
            },
        ],
        routing: {
            send: {
                type: 'body',
                preSend: [
                    async function (
                        this: IExecuteSingleFunctions,
                        requestOptions: IHttpRequestOptions,
                    ): Promise<IHttpRequestOptions> {
                        const additionalFields = this.getNodeParameter('additionalFields', {}) as Record<string, unknown>;
                        Object.assign(requestOptions.body as Record<string, unknown>, additionalFields);
                        return requestOptions;
                    },
                ],
            },
        },
    },
];
