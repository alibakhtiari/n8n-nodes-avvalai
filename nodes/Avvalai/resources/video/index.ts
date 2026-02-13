import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const videoDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['video'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a video',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/videos',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a video',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/videos/{{$parameter.id}}',
                    },
                },
            },
            {
                name: 'Download',
                value: 'download',
                action: 'Download a video',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/videos/{{$parameter.id}}/content',
                        encoding: 'arraybuffer',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a video status',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/videos/{{$parameter.id}}',
                    },
                },
            },
            {
                name: 'List',
                value: 'list',
                action: 'List all videos',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/videos',
                    },
                },
            },
            {
                name: 'Remix',
                value: 'remix',
                action: 'Remix a video',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/videos/{{$parameter.id}}/remix',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Video ID',
        name: 'id',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['get', 'delete', 'remix', 'download'],
            },
        },
        description: 'The ID of the video',
    },
    {
        displayName: 'Model Name or ID',
        name: 'model',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
            loadOptionsMethod: 'getModels',
        },
        required: true,
        default: 'sora-2',
        displayOptions: {
            show: {
                resource: ['video'],
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
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['create', 'remix'],
            },
        },
        description: 'A text description of the desired video. Maximum length is 1000 characters.',
        routing: {
            send: {
                type: 'body',
                property: 'prompt',
            },
        },
    },
    {
        displayName: 'Seconds',
        name: 'seconds',
        type: 'string',
        default: '4',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['create'],
            },
        },
        description: 'Duration of the video in seconds (1-20). Defaults to 4.',
        routing: {
            send: {
                type: 'body',
                property: 'seconds',
            },
        },
    },
    {
        displayName: 'Size',
        name: 'size',
        type: 'options',
        options: [
            { name: '720x1280 (Portrait)', value: '720x1280' },
            { name: '1280x720 (Landscape)', value: '1280x720' },
            { name: '1024x1792 (High-Res Portrait)', value: '1024x1792' },
            { name: '1792x1024 (High-Res Landscape)', value: '1792x1024' },
        ],
        default: '720x1280',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['create'],
            },
        },
        description: 'The resolution of the video',
        routing: {
            send: {
                type: 'body',
                property: 'size',
            },
        },
    },
    {
        displayName: 'Number of Variants',
        name: 'n_variants',
        type: 'number',
        typeOptions: {
            minValue: 1,
            maxValue: 2,
        },
        default: 1,
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['create'],
            },
        },
        description: 'Number of video variants to generate (1-2)',
        routing: {
            send: {
                type: 'body',
                property: 'n_variants',
            },
        },
    },
    {
        displayName: 'Style',
        name: 'style',
        type: 'options',
        options: [
            { name: 'Natural', value: 'natural' },
            { name: 'Vivid', value: 'vivid' },
        ],
        default: 'natural',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['create'],
            },
        },
        description: 'The visual style of the generated video',
        routing: {
            send: {
                type: 'body',
                property: 'style',
            },
        },
    },
    {
        displayName: 'Input Reference Image',
        name: 'input_reference',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['create'],
            },
        },
        description: 'The binary property name containing the image to use as reference',
        routing: {
            send: {
                type: 'body',
                preSend: [
                    async function (
                        this: IExecuteSingleFunctions,
                        requestOptions: IHttpRequestOptions,
                    ): Promise<IHttpRequestOptions> {
                        const inputReference = this.getNodeParameter('input_reference', '') as string;
                        if (inputReference) {
                            requestOptions.headers = requestOptions.headers || {};
                            requestOptions.headers['Content-Type'] = 'multipart/form-data';
                        }
                        return requestOptions;
                    },
                ],
            },
        },
    },
];
