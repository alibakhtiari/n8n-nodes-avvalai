import {
    type ILoadOptionsFunctions,
    type INodePropertyOptions,
    type INodeType,
    type INodeTypeDescription,
    type ISupplyDataFunctions,
    type SupplyData,
    NodeConnectionTypes,
} from 'n8n-workflow';

import {
    AVVALAI_BASE_URL,
    fetchModelList,
    isNonChatMode,
    looksLikeNonChatId,
} from '../Avvalai/helpers';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class AvvalaiChatModel implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Avvalai Chat Model',
        name: 'avvalaiChatModel',
        icon: 'file:../Avvalai/avvalai.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter.modelId}}',
        description: 'Use Avvalai chat models in your AI workflows',
        defaults: {
            name: 'Avvalai Chat Model',
        },
        codex: {
            categories: ['AI'],
            subcategories: {
                AI: ['Language Models'],
                'Language Models': ['Chat Models (Recommended)'],
            },
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://docs.avalai.ir/en/api-reference/chat',
                    },
                ],
            },
        },
        credentials: [
            {
                name: 'avvalaiApi',
                required: true,
            },
        ],
        inputs: [],
        outputs: [NodeConnectionTypes.AiLanguageModel],
        outputNames: ['Model'],
        properties: [
            {
                displayName: 'Model Name or ID',
                name: 'modelId',
                type: 'options',
                default: '',
                required: true,
                description:
                    'The model to use for chat completions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                typeOptions: {
                    loadOptionsMethod: 'getModels',
                },
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                options: [
                    {
                        displayName: 'Frequency Penalty',
                        name: 'frequencyPenalty',
                        type: 'number',
                        typeOptions: {
                            minValue: -2,
                            maxValue: 2,
                            numberPrecision: 1,
                        },
                        default: 0,
                        description:
                            'Positive values penalize new tokens based on their frequency in the text so far',
                    },
                    {
                        displayName: 'Maximum Number of Tokens',
                        name: 'maxTokens',
                        type: 'number',
                        default: -1,
                        description:
                            'The maximum number of tokens to generate. -1 uses the model default.',
                    },
                    {
                        displayName: 'Presence Penalty',
                        name: 'presencePenalty',
                        type: 'number',
                        typeOptions: {
                            minValue: -2,
                            maxValue: 2,
                            numberPrecision: 1,
                        },
                        default: 0,
                        description:
                            'Positive values penalize new tokens based on whether they appear in the text so far',
                    },
                    {
                        displayName: 'Sampling Temperature',
                        name: 'temperature',
                        type: 'number',
                        typeOptions: {
                            minValue: 0,
                            maxValue: 2,
                            numberPrecision: 1,
                        },
                        default: 0.7,
                        description:
                            'Controls randomness. Lower values are more focused, higher values are more random.',
                    },
                    {
                        displayName: 'Top P',
                        name: 'topP',
                        type: 'number',
                        typeOptions: {
                            minValue: 0,
                            maxValue: 1,
                            numberPrecision: 1,
                        },
                        default: 1,
                        description:
                            'Nucleus sampling: the model considers tokens with top_p probability mass',
                    },
                ],
            },
        ],
    };

    methods = {
        loadOptions: {
            async getModels(
                this: ILoadOptionsFunctions,
            ): Promise<INodePropertyOptions[]> {
                const models = await fetchModelList(this);

                return models
                    .filter((m) => {
                        if (isNonChatMode(m)) return false;
                        if (looksLikeNonChatId(m.id)) return false;
                        return true;
                    })
                    .map((m) => ({
                        name: m.id,
                        value: m.id,
                    }));
            },
        },
    };

    async supplyData(
        this: ISupplyDataFunctions,
        itemIndex: number,
    ): Promise<SupplyData> {
        const credentials = await this.getCredentials('avvalaiApi');
        const modelId = this.getNodeParameter('modelId', itemIndex) as string;
        const options = this.getNodeParameter('options', itemIndex, {}) as {
            temperature?: number;
            maxTokens?: number;
            topP?: number;
            frequencyPenalty?: number;
            presencePenalty?: number;
        };

        // Dynamic require — @langchain/openai is provided by n8n at runtime
        const langchainOpenai = eval('require')("@langchain/openai") as Record<string, unknown>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const model = new (langchainOpenai.ChatOpenAI as any)({
            openAIApiKey: credentials.accessToken as string,
            modelName: modelId,
            temperature: options.temperature ?? 0.7,
            maxTokens: options.maxTokens === -1 ? undefined : options.maxTokens,
            topP: options.topP,
            frequencyPenalty: options.frequencyPenalty,
            presencePenalty: options.presencePenalty,
            configuration: {
                baseURL: AVVALAI_BASE_URL,
            },
        });

        return {
            response: model,
        };
    }
}
