import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const audioOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['audio'],
            },
        },
        options: [
            {
                name: 'Speech',
                value: 'speech',
                action: 'Create speech',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/audio/speech',
                    },
                },
            },
            {
                name: 'Transcription',
                value: 'transcription',
                action: 'Transcribe audio',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/audio/transcriptions',
                    },
                },
            },
            {
                name: 'Translation',
                value: 'translation',
                action: 'Translate audio',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/audio/translations',
                    },
                },
            },
        ],
        default: 'speech',
    },
];

const audioFields: INodeProperties[] = [
    {
        displayName: 'Model Name or ID',
        name: 'model',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getModels',
        },
        required: true,
        default: 'tts-1',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
            show: {
                resource: ['audio'],
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
                resource: ['audio'],
                operation: ['speech'],
            },
        },
        description: 'The text to generate audio for',
        routing: {
            send: {
                type: 'body',
                property: 'input',
            },
        },
    },
    {
        displayName: 'Voice',
        name: 'voice',
        type: 'options',
        options: [
            { name: 'Alloy', value: 'alloy' },
            { name: 'Ash', value: 'ash' },
            { name: 'Ballad', value: 'ballad' },
            { name: 'Coral', value: 'coral' },
            { name: 'Echo', value: 'echo' },
            { name: 'Fable', value: 'fable' },
            { name: 'Nova', value: 'nova' },
            { name: 'Onyx', value: 'onyx' },
            { name: 'Sage', value: 'sage' },
            { name: 'Shimmer', value: 'shimmer' },
            { name: 'Verse', value: 'verse' },
        ],
        default: 'alloy',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['speech'],
            },
        },
        description: 'The voice to use for speech generation',
        routing: {
            send: {
                type: 'body',
                property: 'voice',
            },
        },
    },
    {
        displayName: 'File',
        name: 'file',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['transcription', 'translation'],
            },
        },
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['audio'],
            },
        },
        options: [
            {
                displayName: 'Language',
                name: 'language',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['transcription'],
                    },
                },
                description: 'The language of the input audio in ISO-639-1 format',
            },
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['transcription', 'translation'],
                    },
                },
                description: 'Optional text to guide the model\'s style or provide context',
            },
            {
                displayName: 'Response Format',
                name: 'response_format',
                type: 'options',
                options: [
                    { name: 'JSON', value: 'json' },
                    { name: 'SRT', value: 'srt' },
                    { name: 'Text', value: 'text' },
                    { name: 'Verbose JSON', value: 'verbose_json' },
                    { name: 'VTT', value: 'vtt' },
                ],
                default: 'json',
                description: 'Format of the output',
            },
            {
                displayName: 'Speed',
                name: 'speed',
                type: 'number',
                typeOptions: { minValue: 0.25, maxValue: 4.0 },
                default: 1.0,
                displayOptions: {
                    show: {
                        operation: ['speech'],
                    },
                },
                description: 'The speed of the generated audio (0.25 to 4.0)',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: { minValue: 0, maxValue: 1 },
                default: 0,
                displayOptions: {
                    show: {
                        operation: ['transcription', 'translation'],
                    },
                },
                description: 'The sampling temperature, between 0 and 1',
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
                        if (operation === 'transcription' || operation === 'translation') {
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

export const audioDescription: INodeProperties[] = [
    ...audioOperations,
    ...audioFields,
];
