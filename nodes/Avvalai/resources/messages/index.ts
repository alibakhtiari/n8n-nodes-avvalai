import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMessages = {
    resource: ['messages'],
};

export const messagesDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForMessages,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a message',
                description: 'Create a message',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/messages',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: '',
        description: 'The model to use. Example: anthropic.claude-sonnet-4-20250514-v1:0.',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForMessages,
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
        displayName: 'Messages',
        name: 'messages',
        type: 'json',
        default: '[]',
        description: 'Array of message objects representing the conversation history',
        required: true,
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
        displayOptions: {
            show: {
                ...showOnlyForMessages,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'messages',
            },
        },
    },
    {
        displayName: 'Max Tokens',
        name: 'max_tokens',
        type: 'number',
        default: 1024,
        description: 'Maximum number of tokens to generate',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForMessages,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'max_tokens',
            },
        },
    },
    {
        displayName: 'System',
        name: 'system',
        type: 'string',
        default: '',
        description: 'System instructions that prime the model for the conversation',
        displayOptions: {
            show: {
                ...showOnlyForMessages,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'system',
            },
        },
    },
    {
        displayName: 'Stream',
        name: 'stream',
        type: 'boolean',
        default: false,
        description: 'Whether to stream the response',
        displayOptions: {
            show: {
                ...showOnlyForMessages,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'stream',
            },
        },
    },
];
