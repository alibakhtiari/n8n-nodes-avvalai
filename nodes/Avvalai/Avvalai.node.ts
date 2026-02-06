import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { userDescription } from './resources/user';
import { companyDescription } from './resources/company';
import { modelsDescription } from './resources/models';
import { chatDescription } from './resources/chat';
import { embeddingsDescription } from './resources/embeddings';
import { imagesDescription } from './resources/images';
import { audioDescription } from './resources/audio';
import { ocrDescription } from './resources/ocr';
import { rerankDescription } from './resources/rerank';
import { searchDescription } from './resources/search';

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
						name: 'Audio',
						value: 'audio',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Embedding',
						value: 'embeddings',
					},
					{
						name: 'Image',
						value: 'images',
					},
					{
						name: 'Model',
						value: 'model',
					},
					{
						name: 'OCR',
						value: 'ocr',
					},
					{
						name: 'Rerank',
						value: 'rerank',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},
			...userDescription,
			...companyDescription,
			...modelsDescription,
			...chatDescription,
			...embeddingsDescription,
			...imagesDescription,
			...audioDescription,
			...ocrDescription,
			...rerankDescription,
			...searchDescription,
		],
	};
}
