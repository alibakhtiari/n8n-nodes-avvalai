import {
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { chatDescription } from './resources/chat';
import { imagesDescription } from './resources/images';
import { audioDescription } from './resources/audio';
import { videoDescription } from './resources/video';
import { ocrDescription } from './resources/ocr';
import { searchDescription } from './resources/search';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
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
						name: 'Image',
						value: 'images',
					},
					{
						name: 'OCR',
						value: 'ocr',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Video',
						value: 'video',
					},
				],
				default: 'chat',
			},
			...chatDescription,
			...imagesDescription,
			...audioDescription,
			...videoDescription,
			...ocrDescription,
			...searchDescription,
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

				let resource = 'chat';
				try {
					resource = this.getNodeParameter('resource') as string;
				} catch {
					// Fallback
				}

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
					// Filter based on resource
					if (resource === 'chat') {
						if (model.mode !== 'chat' && model.mode !== 'responses') {
							if (model.mode && (model.mode === 'chat' || model.mode === 'responses')) {
								// OK
							} else {
								const lowerId = model.id.toLowerCase();
								if (
									lowerId.includes('image') ||
									lowerId.includes('dall-e') ||
									lowerId.includes('stable-diffusion') ||
									lowerId.includes('midjourney') ||
									lowerId.includes('flux') ||
									lowerId.includes('audio') ||
									lowerId.includes('video') ||
									lowerId.includes('embed') ||
									lowerId.includes('tts') ||
									lowerId.includes('ocr')
								) {
									continue;
								}
							}

							// Explicitly exclude embedding mode if present
							if (model.mode === 'embedding') {
								continue;
							}
						}

						// Filter by provider if selected (only for chat resource for now as we only added the field to chat)
						// But technically getModels runs for both.
						// If resource is chat, we check provider.
						if (provider && model.owned_by !== provider) {
							continue;
						}

					} else if (resource === 'images') {
						let operation = 'generations';
						try {
							operation = this.getNodeParameter('operation') as string;
						} catch {
							// Fallback
						}


						// Filter for image models
						let isImage = false;
						if (operation === 'edits') {
							// Strict filter for edits
							isImage = (model.id && (model.id.includes('dall-e-2') || model.mode === 'image_edit'));
						} else {
							// Default / Generations
							// Include anything that looks like an image model
							isImage = (model.id && model.id.includes('dall-e')) || model.mode === 'image' || model.mode === 'image_generation';
						}

						if (!isImage) {
							continue;
						}
					} else if (resource === 'audio') {
						// Filter for TTS models
						if (model.id.includes('tts') || (model.mode && model.mode === 'text_to_speech')) {
							// OK
						} else {
							continue;
						}
					} else if (resource === 'video') {
						// Filter for Video models
						if (model.id.includes('sora') || model.id.includes('veo') || (model.mode && model.mode === 'video_generation')) {
							// OK
						} else {
							continue;
						}
					} else if (resource === 'ocr') {
						// Filter for OCR models
						if (model.id.includes('ocr') || (model.mode && model.mode === 'ocr')) {
							// OK
						} else {
							continue;
						}
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
}

