import {
    type INodeType,
    type INodeTypeDescription,
    type ISupplyDataFunctions,
    type SupplyData,
    type ILoadOptionsFunctions,
    type INodePropertyOptions,
    NodeConnectionTypes,
} from 'n8n-workflow';
import { ChatOpenAI } from '@langchain/openai';

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
        // eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
        inputs: [],
        // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
        outputs: [NodeConnectionTypes.AiLanguageModel] as unknown as INodeTypeDescription['outputs'],
        credentials: [
            {
                name: 'avvalaiApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                typeOptions: {
                    loadOptionsMethod: 'getModels',
                },
                default: 'gpt-4o',
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
                        displayName: 'Maximum Number of Tokens',
                        name: 'maxTokens',
                        type: 'number',
                        default: -1,
                        description: 'The maximum number of tokens to generate in the completion. -1 means no limit.',
                    },
                ],
            },
        ],
    };

    methods = {
        loadOptions: {
            async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const returnData: INodePropertyOptions[] = [];
                const models = await this.helpers.requestWithAuthentication.call(this, 'avvalaiApi', {
                    method: 'GET',
                    url: 'https://api.avalai.ir/v1/models',
                });

                // Handle different response structures
                let modelList: any[] = [];
                if (Array.isArray(models)) {
                    modelList = models;
                } else if (models && Array.isArray(models.data)) {
                    modelList = models.data;
                }

                for (const model of modelList) {
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
        };

        const model = new ChatOpenAI({
            openAIApiKey: credentials.accessToken as string,
            configuration: {
                baseURL: 'https://api.avalai.ir/v1',
            },
            modelName,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
        });

        return {
            response: model,
        };
    }
}
