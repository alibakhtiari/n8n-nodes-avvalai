import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const embeddingsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
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
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['embeddings'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create embeddings',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/embeddings',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Model Name or ID',
        name: 'model',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getModels',
        },
        required: true,
        default: 'text-embedding-3-small',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
            show: {
                resource: ['embeddings'],
                operation: ['create'],
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
        displayName: 'Input',
        name: 'input',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['embeddings'],
                operation: ['create'],
            },
        },
        description: 'Input text to get embeddings for',
        routing: {
            send: {
                type: 'body',
                property: 'input',
            },
        },
    },
];
