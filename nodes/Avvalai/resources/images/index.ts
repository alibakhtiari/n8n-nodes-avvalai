import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const imagesDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['images'],
            },
        },
        options: [
            {
                name: 'Generate',
                value: 'generations',
                action: 'Generate an image',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/images/generations',
                    },
                },
            },
            {
                name: 'Edit',
                value: 'edits',
                action: 'Edit an image',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/images/edits',
                    },
                },
            },
        ],
        default: 'generations',
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
        default: '',
        displayOptions: {
            show: {
                resource: ['images'],
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
                resource: ['images'],
            },
        },
        description: 'A text description of the desired image(s). Maximum length is 1000 characters.',
        routing: {
            send: {
                type: 'body',
                property: 'prompt',
            },
        },
    },
    {
        displayName: 'Image',
        name: 'image',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['images'],
                operation: ['edits'],
            },
        },
        description: 'The binary property name containing the image to edit',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['images'],
            },
        },
        options: [
            {
                displayName: 'N',
                name: 'n',
                type: 'number',
                default: 1,
                description: 'The number of images to generate',
            },
            {
                displayName: 'Quality',
                name: 'quality',
                type: 'options',
                options: [
                    {
                        name: 'Standard',
                        value: 'standard',
                    },
                    {
                        name: 'HD',
                        value: 'hd',
                    },
                ],
                default: 'standard',
                description: 'The quality of the image generation',
            },
            {
                displayName: 'Response Format',
                name: 'response_format',
                type: 'options',
                options: [
                    {
                        name: 'URL',
                        value: 'url',
                    },
                    {
                        name: 'B64 JSON',
                        value: 'b64_json',
                    },
                ],
                default: 'url',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
            },
            {
                displayName: 'Size',
                name: 'size',
                type: 'options',
                options: [
                    {
                        name: '1024x1024',
                        value: '1024x1024',
                    },
                    {
                        name: '1024x1792',
                        value: '1024x1792',
                    },
                    {
                        name: '1792x1024',
                        value: '1792x1024',
                    },
                ],
                default: '1024x1024',
                description: 'The size of the generated images',
            },
            {
                displayName: 'Style',
                name: 'style',
                type: 'options',
                options: [
                    {
                        name: 'Vivid',
                        value: 'vivid',
                    },
                    {
                        name: 'Natural',
                        value: 'natural',
                    },
                ],
                default: 'vivid',
                description: 'The style of the generated images',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: '',
                description: 'A unique identifier representing your end-user, which can help monitor and detect abuse',
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

                        const operation = this.getNodeParameter('operation') as string;
                        if (operation === 'edits') {
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
