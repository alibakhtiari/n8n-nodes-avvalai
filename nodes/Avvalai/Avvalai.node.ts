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
import { videosDescription } from './resources/videos';
import { moderationDescription } from './resources/moderation';
import { filesDescription } from './resources/files';
import { messagesDescription } from './resources/messages';
import { fineTuningDescription } from './resources/fine-tuning';
import { batchDescription } from './resources/batch';
import { assistantsDescription } from './resources/assistants';

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
						name: 'Assistant',
						value: 'assistants',
					},
					{
						name: 'Audio',
						value: 'audio',
					},
					{
						name: 'Batch',
						value: 'batch',
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
						name: 'File',
						value: 'files',
					},
					{
						name: 'Fine-Tuning',
						value: 'fine-tuning',
					},
					{
						name: 'Image',
						value: 'images',
					},
					{
						name: 'Message',
						value: 'messages',
					},
					{
						name: 'Model',
						value: 'model',
					},
					{
						name: 'Moderation',
						value: 'moderation',
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
					{
						name: 'Video',
						value: 'videos',
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
			...videosDescription,
			...moderationDescription,
			...filesDescription,
			...messagesDescription,
			...fineTuningDescription,
			...batchDescription,
			...assistantsDescription,
		],
	};
}
