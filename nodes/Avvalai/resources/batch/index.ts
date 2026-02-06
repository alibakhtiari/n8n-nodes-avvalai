import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBatch = {
    resource: ['batch'],
};

export const batchDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForBatch,
        },
        options: [
            {
                name: 'Cancel',
                value: 'cancel',
                action: 'Cancel a batch',
                description: 'Cancels an in-progress batch',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/batches/{{$parameter.batchId}}/cancel',
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create a batch',
                description: 'Creates and executes a batch from an uploaded file of requests',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/batches',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a batch',
                description: 'Retrieves a batch',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/batches/{{$parameter.batchId}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'List batches',
                description: 'List your organization\'s batches',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/batches',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Batch ID',
        name: 'batchId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForBatch,
                operation: ['get', 'cancel'],
            },
        },
        description: 'The ID of the batch',
    },
    {
        displayName: 'Input File ID',
        name: 'input_file_id',
        type: 'string',
        default: '',
        description: 'The ID of an uploaded file that contains requests for the new batch',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForBatch,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'input_file_id',
            },
        },
    },
    {
        displayName: 'Endpoint',
        name: 'endpoint',
        type: 'options',
        default: '/v1/chat/completions',
        description: 'The endpoint to be used for all requests in the batch',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForBatch,
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'Chat Completions',
                value: '/v1/chat/completions',
            },
            {
                name: 'Completions',
                value: '/v1/completions',
            },
            {
                name: 'Embeddings',
                value: '/v1/embeddings',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'endpoint',
            },
        },
    },
    {
        displayName: 'Completion Window',
        name: 'completion_window',
        type: 'options',
        default: '24h',
        description: 'The time frame within which the batch should be processed',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForBatch,
                operation: ['create'],
            },
        },
        options: [
            {
                name: '24h',
                value: '24h',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'completion_window',
            },
        },
    },
    {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'collection',
        placeholder: 'Add Metadata',
        default: {},
        displayOptions: {
            show: {
                ...showOnlyForBatch,
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                description: 'The key of the metadata',
            },
            {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'The value of the metadata',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'metadata',
            },
        },
    },
];
