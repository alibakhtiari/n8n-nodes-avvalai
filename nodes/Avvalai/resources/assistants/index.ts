import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAssistants = {
    resource: ['assistants'],
};

export const assistantsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForAssistants,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create an assistant',
                description: 'Create an assistant with a model and instructions',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/assistants',
                        headers: {
                            'OpenAI-Beta': 'assistants=v2',
                        },
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
        default: 'gpt-4o',
        description: 'ID of the model to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForAssistants,
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
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the assistant',
        displayOptions: {
            show: {
                ...showOnlyForAssistants,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'name',
            },
        },
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The description of the assistant',
        displayOptions: {
            show: {
                ...showOnlyForAssistants,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'description',
            },
        },
    },
    {
        displayName: 'Instructions',
        name: 'instructions',
        type: 'string',
        default: '',
        description: 'The system instructions that the assistant uses',
        displayOptions: {
            show: {
                ...showOnlyForAssistants,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'instructions',
            },
        },
    },
];
