import {
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { chatDescription } from './resources/chat';
import { imagesDescription } from './resources/images';

export class Avvalai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Avvalai',
		name: 'avvalai',
		icon: 'file:avvalai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Avvalai API',
		defaults: {
			name: 'Avvalai',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'avvalaiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.avalai.ir/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Image',
						value: 'images',
					},
				],
				default: 'chat',
			},
			...chatDescription,
			...imagesDescription,
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
}
