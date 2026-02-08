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
							// Check if it's missing mode but has chat-like ID?
							// Logic in ChatModel is "exclude audio/image", here it's "include chat/responses".
							// The user complained that Chat resource causes issues too.
							// Let's adopt the exclusion logic here too for consistency, OR strict inclusion.
							// Currently strict inclusion: mode MUST be chat or responses.
							// The user said "works now but it has a chat too , it loads image models still".
							// This implies strict inclusion FAILED to exclude them.
							// So they MUST have mode='chat' or 'responses' OR undefined and passing through?
							// Wait, earlier I saw "mode": "image_generation".
							// If strict inclusion is active, how did "image_generation" pass `!== 'chat'`?
							// It shouldn't pass.
							// Unless model.mode is undefined? then `undefined !== 'chat'` is TRUE.
							// So we must check if mode exists?
							if (model.mode && (model.mode === 'chat' || model.mode === 'responses')) {
								// OK
							} else {
								// Skip if mode is present and not chat
								// But what if mode is missing?
								// If mode is missing, we should probably exclude it unless ID looks like a chat model?
								// Or checking ID for "image"?
								const lowerId = model.id.toLowerCase();
								if (
									lowerId.includes('image') ||
									lowerId.includes('dall-e') ||
									lowerId.includes('stable-diffusion') ||
									lowerId.includes('midjourney') ||
									lowerId.includes('flux') ||
									lowerId.includes('audio') ||
									lowerId.includes('video')
								) {
									continue;
								}
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
