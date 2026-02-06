import { INodeProperties } from 'n8n-workflow';

export const modelsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['models'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get a model',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/models/{{$parameter["modelId"]}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get many models',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/models',
                    },
                },
            },
        ],
        default: 'getAll',
    },
    {
        displayName: 'Model ID',
        name: 'modelId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['models'],
                operation: ['get'],
            },
        },
        description: 'The ID of the model to retrieve',
    },
];
