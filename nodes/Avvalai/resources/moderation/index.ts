import type { INodeProperties } from 'n8n-workflow';

const showOnlyForModeration = {
    resource: ['moderation'],
};

export const moderationDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForModeration,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a moderation',
                description: 'Classify valid text content',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/moderations',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Input',
        name: 'input',
        type: 'string',
        default: '',
        description: 'The text to classify',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForModeration,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'input',
            },
        },
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        default: 'text-moderation-latest',
        description: 'The moderation model to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForModeration,
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'Text Moderation Latest',
                value: 'text-moderation-latest',
            },
            {
                name: 'Text Moderation 007',
                value: 'text-moderation-007',
            },
            {
                name: 'Omni Moderation Latest',
                value: 'omni-moderation-latest',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'model',
            },
        },
    },
];
