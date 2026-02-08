import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

export const chatDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['chat'],
            },
        },
        options: [
            {
                name: 'Completion',
                value: 'completion',
                description: 'Create a completion for the chat message',
                action: 'Create a completion',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/chat/completions',
                    },
                },
            },
        ],
        default: 'completion',
    },
    {
        displayName: 'Provider',
        name: 'provider',
        type: 'options',
        description: 'Filter models by provider',
        typeOptions: {
            loadOptionsMethod: 'getProviders',
        },
        default: '',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['completion'],
            },
        },
    },
    {
        displayName: 'Model Name or ID',
        name: 'model',
        type: 'options',
        description: 'The model which will generate the completion. <a href="https://docs.avalai.ir/en/models/model-details">Check models</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
            loadOptionsMethod: 'getModels',
            loadOptionsDependsOn: ['provider'],
        },
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['completion'],
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
        name: 'messagesUi',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        placeholder: 'Add Message',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['completion'],
            },
        },
        default: {
            values: [
                {
                    role: 'user',
                    content: '',
                },
            ],
        },
        options: [
            {
                name: 'values',
                displayName: 'Values',
                values: [
                    {
                        displayName: 'Role',
                        name: 'role',
                        type: 'options',
                        options: [
                            {
                                name: 'System',
                                value: 'system',
                            },
                            {
                                name: 'User',
                                value: 'user',
                            },
                            {
                                name: 'Assistant',
                                value: 'assistant',
                            },
                            {
                                name: 'Tool',
                                value: 'tool',
                            },
                        ],
                        default: 'user',
                    },
                    {
                        displayName: 'Content',
                        name: 'content',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'messages',
                value: '={{$value.values}}',
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
                resource: ['chat'],
                operation: ['completion'],
            },
        },
        options: [
            {
                displayName: 'Frequency Penalty',
                name: 'frequency_penalty',
                type: 'number',
                typeOptions: {
                    minValue: -2,
                    maxValue: 2,
                },
                default: 0,
                description: 'Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model\'s likelihood to repeat the same line verbatim.',
            },
            {
                displayName: 'Max Tokens',
                name: 'max_tokens',
                type: 'number',
                default: 2048,
                description: 'The maximum number of tokens to generate in the chat completion',
            },
            {
                displayName: 'Presence Penalty',
                name: 'presence_penalty',
                type: 'number',
                typeOptions: {
                    minValue: -2,
                    maxValue: 2,
                },
                default: 0,
                description: 'Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model\'s likelihood to talk about new topics.',
            },
            {
                displayName: 'Response Format',
                name: 'response_format',
                type: 'options',
                options: [
                    {
                        name: 'Text',
                        value: 'text',
                    },
                    {
                        name: 'JSON Object',
                        value: 'json_object',
                    },
                ],
                default: 'text',
                description: 'An object specifying the format that the model must output',
            },
            {
                displayName: 'Seed',
                name: 'seed',
                type: 'number',
                default: 0,
                description: 'If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result',
            },
            {
                displayName: 'Stop',
                name: 'stop',
                type: 'string',
                default: '',
                description: 'Up to 4 sequences where the API will stop generating further tokens',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 2,
                },
                default: 1,
                description: 'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
            },
            {
                displayName: 'Top P',
                name: 'top_p',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 1,
                },
                default: 1,
                description: 'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass',
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
                        if (additionalFields.response_format) {
                            additionalFields.response_format = { type: additionalFields.response_format as string };
                        }
                        Object.assign(requestOptions.body as Record<string, unknown>, additionalFields);
                        return requestOptions;
                    },
                ],
            },
        },
    },
];
