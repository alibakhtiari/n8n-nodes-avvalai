import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const audioDescription: INodeProperties[] = [
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
                name: 'Synthesize',
                value: 'synthesize',
                action: 'Synthesize text to speech',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/text:synthesize',
                    },
                },
            },
        ],
        default: 'synthesize',
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['synthesize'],
            },
        },
        description: 'The text to synthesize (max 4000 bytes)',
        routing: {
            send: {
                type: 'body',
                property: 'input.text',
            },
        },
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
        default: 'gemini-2.5-flash-tts',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['synthesize'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'voice.model_name',
            },
        },
    },
    {
        displayName: 'Language Code',
        name: 'language_code',
        type: 'string',
        required: true,
        default: 'en-US',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['synthesize'],
            },
        },
        description: 'BCP-47 language code (e.g., "en-US", "fa-IR")',
        routing: {
            send: {
                type: 'body',
                property: 'voice.languageCode',
            },
        },
    },
    {
        displayName: 'Voice Name',
        name: 'voice_name',
        type: 'options',
        options: [
            { name: 'Aoede (Strong, Authoritative)', value: 'Aoede' },
            { name: 'Charon (Deep, Resonant)', value: 'Charon' },
            { name: 'Fenrir (Storytelling Quality)', value: 'Fenrir' },
            { name: 'Kore (Neutral, Balanced)', value: 'Kore' },
            { name: 'Puck (Bright, Energetic)', value: 'Puck' },
            { name: 'Zephyr (Smooth, Professional)', value: 'Zephyr' },
        ],
        default: 'Kore',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['synthesize'],
            },
        },
        description: 'Voice name to use for synthesis',
        routing: {
            send: {
                type: 'body',
                property: 'voice.name',
            },
        },
    },
    {
        displayName: 'Audio Encoding',
        name: 'audio_encoding',
        type: 'options',
        options: [
            { name: 'ALAW', value: 'ALAW' },
            { name: 'LINEAR16', value: 'LINEAR16' },
            { name: 'MP3', value: 'MP3' },
            { name: 'MULAW', value: 'MULAW' },
            { name: 'OGG_OPUS', value: 'OGG_OPUS' },
        ],
        required: true,
        default: 'MP3',
        displayOptions: {
            show: {
                resource: ['audio'],
                operation: ['synthesize'],
            },
        },
        description: 'Audio format for the output',
        routing: {
            send: {
                type: 'body',
                property: 'audioConfig.audioEncoding',
            },
        },
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
                operation: ['synthesize'],
            },
        },
        options: [
            {
                displayName: 'Styling Prompt',
                name: 'styling_prompt',
                type: 'string',
                default: '',
                description: 'Instructions for how to speak the text (e.g., "Say it excitedly")',
            },
            {
                displayName: 'Sample Rate (Hz)',
                name: 'sample_rate_hertz',
                type: 'number',
                default: 24000,
                description: 'Sample rate in Hz. Only applicable for LINEAR16 encoding.',
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
                        const body = requestOptions.body as Record<string, unknown>;

                        if (additionalFields.styling_prompt) {
                            if (!body.input) body.input = {};
                            (body.input as Record<string, unknown>).prompt = additionalFields.styling_prompt;
                        }

                        if (additionalFields.sample_rate_hertz) {
                            if (!body.audioConfig) body.audioConfig = {};
                            (body.audioConfig as Record<string, unknown>).sampleRateHertz = additionalFields.sample_rate_hertz;
                        }

                        return requestOptions;
                    },
                ],
            },
        },
    },
];
