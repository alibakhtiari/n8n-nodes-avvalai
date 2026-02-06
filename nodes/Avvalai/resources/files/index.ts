import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFiles = {
    resource: ['files'],
};

export const filesDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForFiles,
        },
        options: [
            {
                name: 'Content',
                value: 'content',
                action: 'Get file content',
                description: 'Download the content of a file',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/files/{{$parameter.fileId}}/content',
                        encoding: 'arraybuffer',
                    },
                    output: {
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Upload a file',
                description: 'Upload a file that can be used across various endpoints',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/files',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                    send: {
                        type: 'body',
                        property: 'file',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a file',
                description: 'Delete a file',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/files/{{$parameter.fileId}}',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a file',
                description: 'Get information about a specific file',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/files/{{$parameter.fileId}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'List files',
                description: 'Returns a list of files that belong to your organization',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/files',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'File ID',
        name: 'fileId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForFiles,
                operation: ['get', 'delete', 'content'],
            },
        },
        description: 'The ID of the file',
    },
    {
        displayName: 'Binary File',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForFiles,
                operation: ['create'],
            },
        },
        description: 'The binary property name containing the file to upload',
        routing: {
            send: {
                type: 'body',
                property: 'file',
                value: '={{$binary[$value]}}',
            },
        },
    },
    {
        displayName: 'Purpose',
        name: 'purpose',
        type: 'options',
        default: 'user_data',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForFiles,
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'Assistants',
                value: 'assistants',
            },
            {
                name: 'Batch',
                value: 'batch',
            },
            {
                name: 'Evals',
                value: 'evals',
            },
            {
                name: 'Fine Tune',
                value: 'fine-tune',
            },
            {
                name: 'Others',
                value: 'others',
            },
            {
                name: 'User Data',
                value: 'user_data',
            },
            {
                name: 'Vision',
                value: 'vision',
            },
        ],
        description: 'The intended purpose of the uploaded file',
        routing: {
            send: {
                type: 'body',
                property: 'purpose',
            },
        },
    },
];
