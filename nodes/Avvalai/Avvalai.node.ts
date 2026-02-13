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
import {
	AVVALAI_BASE_URL,
	fetchModelList,
	isNonChatMode,
	looksLikeNonChatId,
	loadProviderOptions,
} from './helpers';

export class Avvalai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Avvalai',
		name: 'avvalai',
		icon: 'file:avvalai.svg',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Avvalai API',
		defaults: {
			name: 'Avvalai',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'avvalaiApi', required: true }],
		requestDefaults: {
			baseURL: AVVALAI_BASE_URL,
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
					{ name: 'Audio', value: 'audio' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Image', value: 'images' },
					{ name: 'OCR', value: 'ocr' },
					{ name: 'Search', value: 'search' },
					{ name: 'Video', value: 'video' },
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
				return loadProviderOptions(this);
			},
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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

				const modelList = await fetchModelList(this);
				const returnData: INodePropertyOptions[] = [];

				for (const model of modelList) {
					if (resource === 'chat') {
						// Skip models that are definitively non-chat by mode
						if (isNonChatMode(model)) continue;

						// For models without an explicit chat/responses mode, use ID heuristics
						if (model.mode !== 'chat' && model.mode !== 'responses') {
							if (looksLikeNonChatId(model.id || '')) continue;
						}

						// Filter by provider if selected
						if (provider && model.owned_by !== provider) continue;
					} else if (resource === 'images') {
						let operation = 'generations';
						try {
							operation = this.getNodeParameter('operation') as string;
						} catch {
							// Fallback
						}

						const isImage =
							operation === 'edits'
								? model.id &&
								(model.id.includes('dall-e-2') || model.mode === 'image_edit')
								: (model.id && model.id.includes('dall-e')) ||
								model.mode === 'image' ||
								model.mode === 'image_generation';

						if (!isImage) continue;
					} else if (resource === 'audio') {
						const isAudio =
							(model.id && model.id.includes('tts')) ||
							model.mode === 'text_to_speech';
						if (!isAudio) continue;
					} else if (resource === 'video') {
						const isVideo =
							(model.id && (model.id.includes('sora') || model.id.includes('veo'))) ||
							model.mode === 'video_generation';
						if (!isVideo) continue;
					} else if (resource === 'ocr') {
						const isOcr =
							(model.id && model.id.includes('ocr')) || model.mode === 'ocr';
						if (!isOcr) continue;
					} else if (resource === 'search') {
						// Search uses a dedicated tool selector, not model selection
						continue;
					}

					if (model.id) {
						returnData.push({ name: model.id, value: model.id });
					}
				}

				return returnData;
			},
		},
	};
}
