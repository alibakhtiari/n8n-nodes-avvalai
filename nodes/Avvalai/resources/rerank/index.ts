import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const rerankDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['rerank'],
            },
        },
        options: [
            {
                name: 'Rerank',
                value: 'rerank',
                action: 'Rerank documents',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/rerank',
                    },
                },
            },
        ],
        default: 'rerank',
    },
    {
        displayName: 'Model Name or ID',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Cohere Rerank v4.0 Pro', value: 'cohere-rerank-v4.0-pro' },
            { name: 'Cohere Rerank v4.0 Fast', value: 'cohere-rerank-v4.0-fast' },
            { name: 'Cohere Rerank v3.5', value: 'cohere.rerank-v3-5:0' },
            { name: 'Qwen3 Rerank', value: 'qwen3-rerank' },
        ],
        required: true,
        default: 'cohere-rerank-v4.0-pro',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
            show: {
                resource: ['rerank'],
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
        displayName: 'Query',
        name: 'query',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['rerank'],
            },
        },
        description: 'The search query to rank documents against',
        routing: {
            send: {
                type: 'body',
                property: 'query',
            },
        },
    },
    {
        displayName: 'Documents',
        name: 'documents',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['rerank'],
            },
        },
        description: 'An array of strings or objects representing the documents to be reranked',
        routing: {
            send: {
                type: 'body',
                property: 'documents',
                value: '={{typeof $value === "string" ? JSON.parse($value) : $value}}',
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
                resource: ['rerank'],
            },
        },
        options: [
            {
                displayName: 'Return Documents',
                name: 'return_documents',
                type: 'boolean',
                default: true,
                description: 'Whether to return the document content in the response',
            },
            {
                displayName: 'Top N',
                name: 'top_n',
                type: 'number',
                default: 10,
                description: 'The number of top results to return',
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
