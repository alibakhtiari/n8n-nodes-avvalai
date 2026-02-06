import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFineTuning = {
    resource: ['fine-tuning'],
};

export const fineTuningDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForFineTuning,
        },
        options: [
            {
                name: 'Cancel',
                value: 'cancel',
                action: 'Cancel a fine tuning job',
                description: 'Immediately cancel a fine-tune job',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/fine-tuning/jobs/{{$parameter.jobId}}/cancel',
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create a fine tuning job',
                description: 'Creates a job that fine-tunes a specified model from a given dataset',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/fine-tuning/jobs',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a fine tuning job',
                description: 'Get info about a fine-tuning job',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/fine-tuning/jobs/{{$parameter.jobId}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'List fine tuning jobs',
                description: 'List your organization\'s fine-tuning jobs',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/fine-tuning/jobs',
                    },
                },
            },
            {
                name: 'List Events',
                value: 'listEvents',
                action: 'List fine tuning events',
                description: 'Get status updates for a fine-tuning job',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/fine-tuning/jobs/{{$parameter.jobId}}/events',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForFineTuning,
                operation: ['get', 'cancel', 'listEvents'],
            },
        },
        description: 'The ID of the fine-tuning job',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'gpt-3.5-turbo',
        description: 'The name of the model to fine-tune',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForFineTuning,
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
        displayName: 'Training File ID',
        name: 'training_file',
        type: 'string',
        default: '',
        description: 'The ID of an uploaded file that contains training data',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForFineTuning,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'training_file',
            },
        },
    },
    {
        displayName: 'Validation File ID',
        name: 'validation_file',
        type: 'string',
        default: '',
        description: 'The ID of an uploaded file that contains validation data',
        displayOptions: {
            show: {
                ...showOnlyForFineTuning,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'validation_file',
            },
        },
    },
    {
        displayName: 'Hyperparameters',
        name: 'hyperparameters',
        type: 'collection',
        placeholder: 'Add Hyperparameter',
        default: {},
        displayOptions: {
            show: {
                ...showOnlyForFineTuning,
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Batch Size',
                name: 'batch_size',
                type: 'number',
                default: 1,
                description: 'Number of examples in each batch',
            },
            {
                displayName: 'Learning Rate Multiplier',
                name: 'learning_rate_multiplier',
                type: 'number',
                default: 1,
                description: 'Scaling factor for the learning rate',
            },
            {
                displayName: 'Number of Epochs',
                name: 'n_epochs',
                type: 'number',
                default: 1,
                description: 'The number of epochs to train the model for',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'hyperparameters',
            },
        },
    },
    {
        displayName: 'Suffix',
        name: 'suffix',
        type: 'string',
        default: '',
        description: 'A string of up to 40 characters that will be added to your fine-tuned model name',
        displayOptions: {
            show: {
                ...showOnlyForFineTuning,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'suffix',
            },
        },
    },
];
