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
import { OpenAIEmbeddings } from '@langchain/openai';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class AvvalaiEmbeddingModel implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Avvalai Embedding Model',
        name: 'avvalaiEmbeddingModel',
        icon: 'file:avvalai.svg',
        group: ['transform'],
        version: 1,
        description: 'Embedding model from Avvalai',
        defaults: {
            name: 'Avvalai Embedding Model',
        },
        codex: {
            categories: ['AI'],
        },
        inputs: [],
        outputs: [NodeConnectionTypes.AiEmbedding] as unknown as INodeTypeDescription['outputs'],
        credentials: [
            {
                name: 'avvalaiApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Model Name or ID',
                name: 'model',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                typeOptions: {
                    loadOptionsMethod: 'getModels',
                },
                default: '',
                required: true,
            },
            {
                displayName: 'Strip Newlines',
                name: 'stripNewLines',
                type: 'boolean',
                default: false,
                description: 'Whether to strip newlines from the input text. This is recommended by some providers.',
            },
            {
                displayName: 'Batch Size',
                name: 'batchSize',
                type: 'number',
                default: 512,
                description: 'The number of documents to embed in a single batch',
            },
        ],
    };

    methods = {
        loadOptions: {
            async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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

                for (const model of modelList) {
                    // Filter for embedding models
                    // API returns "mode": "embedding" for embedding models
                    const isEmbedding = model.mode === 'embedding' || (model.id && model.id.toLowerCase().includes('embed'));

                    if (isEmbedding) {
                        if (model.id) {
                            returnData.push({
                                name: model.id,
                                value: model.id,
                            });
                        }
                    }
                }

                return returnData;
            },
        },
    };

    async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
        const credentials = await this.getCredentials('avvalaiApi');
        const modelName = this.getNodeParameter('model', itemIndex) as string;
        const stripNewLines = this.getNodeParameter('stripNewLines', itemIndex) as boolean;
        const batchSize = this.getNodeParameter('batchSize', itemIndex) as number;

        const model = new OpenAIEmbeddings({
            openAIApiKey: credentials.accessToken as string,
            configuration: {
                baseURL: 'https://api.avalai.ir/v1',
            },
            modelName,
            stripNewLines,
            batchSize,
        });

        return {
            response: model,
        };
    }
}
