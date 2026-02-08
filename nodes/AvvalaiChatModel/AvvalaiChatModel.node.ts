import {
    type INodeType,
    type INodeTypeDescription,
    type ISupplyDataFunctions,
    type SupplyData,
    type ILoadOptionsFunctions,
    type INodePropertyOptions,
    NodeConnectionTypes,
} from 'n8n-workflow';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { ChatOpenAI } from '@langchain/openai';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class AvvalaiChatModel implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Avvalai Chat Model',
        name: 'avvalaiChatModel',
        icon: 'file:avvalai.svg',
        group: ['transform'],
        version: 1,
        description: 'Language model from Avvalai',
        defaults: {
            name: 'Avvalai Chat Model',
        },
        codex: {
            categories: ['AI'],
        },

        inputs: [],

        outputs: [NodeConnectionTypes.AiLanguageModel] as unknown as INodeTypeDescription['outputs'],
        credentials: [
            {
                name: 'avvalaiApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Provider Name or ID',
                name: 'provider',
                type: 'options',
                description: 'Filter models by provider. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                typeOptions: {
                    loadOptionsMethod: 'getProviders',
                },
                default: '',
            },
            {
                displayName: 'Model Name or ID',
                name: 'model',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                typeOptions: {
                    loadOptionsMethod: 'getModels',
                    loadOptionsDependsOn: ['provider'],
                },
                // default: 'gpt-4o', // Removed default
                default: '',
                required: true,
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                options: [
                    {
                        displayName: 'Maximum Number of Tokens',
                        name: 'maxTokens',
                        type: 'number',
                        default: -1,
                        description: 'The maximum number of tokens to generate in the completion. -1 means no limit.',
                    },
                    {
                        displayName: 'Search Context Size',
                        name: 'search_context_size',
                        type: 'options',
                        options: [
                            { name: 'Low', value: 'low' },
                            { name: 'Medium', value: 'medium' },
                            { name: 'High', value: 'high' },
                        ],
                        default: 'medium',
                        displayOptions: {
                            show: {
                                web_search: [true],
                            },
                        },
                        description: 'Controls how much context is retrieved from the web',
                    },
                    {
                        displayName: 'Temperature',
                        name: 'temperature',
                        type: 'number',
                        typeOptions: {
                            minValue: 0,
                            maxValue: 1,
                        },
                        default: 0.7,
                        description: 'Sampling temperature to use',
                    },
                    {
                        displayName: 'User Location (City)',
                        name: 'user_location_city',
                        type: 'string',
                        default: '',
                        displayOptions: {
                            show: {
                                web_search: [true],
                            },
                        },
                        description: 'City name (e.g., London)',
                    },
                    {
                        displayName: 'User Location (Country)',
                        name: 'user_location_country',
                        type: 'string',
                        default: '',
                        displayOptions: {
                            show: {
                                web_search: [true],
                            },
                        },
                        description: 'Two-letter ISO country code (e.g., US, GB)',
                    },
                    {
                        displayName: 'Web Search',
                        name: 'web_search',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to enable web search grounding',
                    },
                ],
            },
        ],
    };

    methods = {
        loadOptions: {
            async getProviders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const returnData: INodePropertyOptions[] = [];
                const models = await this.helpers.httpRequestWithAuthentication.call(this, 'avvalaiApi', {
                    method: 'GET',
                    url: 'https://api.avalai.ir/v1/models',
                });

                // Handle string response
                let responseData = models;
                if (typeof models === 'string') {
                    try {
                        responseData = JSON.parse(models);
                    } catch {
                        // Ignore parse error
                    }
                }

                // Handle different response structures
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let modelList: any[] = [];
                if (Array.isArray(responseData)) {
                    modelList = responseData;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } else if (responseData && Array.isArray((responseData as any).data)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    modelList = (responseData as any).data;
                }

                const providers = new Set<string>();
                for (const model of modelList) {
                    if (model.owned_by) {
                        providers.add(model.owned_by);
                    }
                }

                for (const provider of providers) {
                    returnData.push({
                        name: provider,
                        value: provider,
                    });
                }

                return returnData;
            },
            async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const returnData: INodePropertyOptions[] = [];
                let provider = '';
                try {
                    provider = this.getNodeParameter('provider') as string;
                } catch {
                    // Fallback
                }

                const models = await this.helpers.httpRequestWithAuthentication.call(this, 'avvalaiApi', {
                    method: 'GET',
                    url: 'https://api.avalai.ir/v1/models',
                });

                // Handle string response
                let responseData = models;
                if (typeof models === 'string') {
                    try {
                        responseData = JSON.parse(models);
                    } catch {
                        // Ignore parse error
                    }
                }

                // Handle different response structures
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let modelList: any[] = [];
                if (Array.isArray(responseData)) {
                    modelList = responseData;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } else if (responseData && Array.isArray((responseData as any).data)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    modelList = (responseData as any).data;
                }

                for (const model of modelList) {

                    // Filter out known non-chat models
                    if (model.mode === 'image' || model.mode === 'image_generation' || model.mode === 'audio' || model.mode === 'moderation' || model.mode === 'video_generation' || model.mode === 'embedding') {
                        continue;
                    }

                    // Robust filtering by ID for models that might have missing/null mode
                    const lowerId = model.id.toLowerCase();
                    if (
                        lowerId.includes('image') ||
                        lowerId.includes('dall-e') ||
                        lowerId.includes('stable-diffusion') ||
                        lowerId.includes('midjourney') ||
                        lowerId.includes('flux') ||
                        lowerId.includes('audio') ||
                        lowerId.includes('video') ||
                        lowerId.includes('text-to-speech') ||
                        lowerId.includes('speech-to-text') ||
                        lowerId.includes('whisper') ||
                        lowerId.includes('tts') ||
                        lowerId.includes('stt') ||
                        lowerId.includes('embed')
                    ) {
                        // Double check it's not a chat model with "image" in the name (unlikely for "chat" models, but possible for multi-modal)
                        // But usually "image" in ID means image generation model in this API.
                        // Exception: "vision" models are chat models. "image" usually means generation.
                        // Let's be safe.
                        if (!lowerId.includes('vision')) {
                            continue;
                        }
                    }
                    // Explicitly allow 'chat', 'responses', and potentially null/undefined (legacy models)
                    // If we want to be strict but allow null:
                    // if (model.mode && model.mode !== 'chat' && model.mode !== 'responses') continue;
                    // But better to blacklist the wrong ones.

                    // Filter by provider if selected
                    // OpenAI models often have owned_by 'openai' or 'system'
                    if (provider && model.owned_by !== provider) {
                        continue;
                    }

                    if (model.id) {
                        returnData.push({
                            name: model.id,
                            value: model.id,
                        });
                    }
                }

                return returnData;
            },
        },
    };

    async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
        const credentials = await this.getCredentials('avvalaiApi');
        const modelName = this.getNodeParameter('model', itemIndex) as string;
        const options = this.getNodeParameter('options', itemIndex, {}) as {
            temperature?: number;
            maxTokens?: number;
            web_search?: boolean;
            search_context_size?: string;
            user_location_country?: string;
            user_location_city?: string;
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelKwargs: Record<string, any> = {};

        if (options.web_search) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const searchTool: any = {
                type: 'web_search',
            };

            if (options.search_context_size) {
                searchTool.search_context_size = options.search_context_size;
            }

            if (options.user_location_country || options.user_location_city) {
                searchTool.user_location = {
                    type: 'approximate',
                };
                if (options.user_location_country) searchTool.user_location.country = options.user_location_country;
                if (options.user_location_city) searchTool.user_location.city = options.user_location_city;
            }

            modelKwargs.tools = [searchTool];
        }

        const model = new ChatOpenAI({
            openAIApiKey: credentials.accessToken as string,
            configuration: {
                baseURL: 'https://api.avalai.ir/v1',
            },
            modelName,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
            modelKwargs,
        });

        return {
            response: model,
        };
    }
}
