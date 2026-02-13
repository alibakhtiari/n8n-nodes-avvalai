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
export class AvvalaiEmbeddingModel implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Avvalai Embedding Model',
        name: 'avvalaiEmbeddingModel',
        icon: 'file:../Avvalai/avvalai.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter.modelId}}',
        description: 'Use Avvalai embedding models in your AI workflows',
        defaults: {
            name: 'Avvalai Embedding Model',
        },
        codex: {
            categories: ['AI'],
            subcategories: {
                AI: ['Embeddings'],
            },
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://docs.avalai.ir/en/api-reference/embeddings',
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
        outputs: [NodeConnectionTypes.AiEmbedding],
        outputNames: ['Embedding'],
        properties: [
            {
                displayName: 'Model Name or ID',
                name: 'modelId',
                type: 'options',
                default: '',
                required: true,
                description:
                    'The embedding model to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
                        displayName: 'Dimensions',
                        name: 'dimensions',
                        type: 'number',
                        default: 0,
                        description:
                            'The number of dimensions for the output embeddings. 0 uses model default. Only supported by some models.',
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
                        if (m.mode === 'embedding') return true;
                        if (looksLikeNonChatId(m.id) && !isNonChatMode(m.mode)) {
                            return m.id.toLowerCase().includes('embed');
                        }
                        return false;
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
            dimensions?: number;
        };

        // Dynamic require — @langchain/openai is provided by n8n at runtime
        const langchainOpenai = eval('require')("@langchain/openai") as Record<string, unknown>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const embeddings = new (langchainOpenai.OpenAIEmbeddings as any)({
            openAIApiKey: credentials.accessToken as string,
            modelName: modelId,
            ...(options.dimensions && options.dimensions > 0
                ? { dimensions: options.dimensions }
                : {}),
            configuration: {
                baseURL: AVVALAI_BASE_URL,
            },
        });

        return {
            response: embeddings,
        };
    }
}
