import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

/** Base URL for the Avvalai API — single source of truth. */
export const AVVALAI_BASE_URL = 'https://api.avalai.ir/v1';

/**
 * Model ID substrings that indicate a non-chat model.
 * Used by both Avvalai (multi-resource) and AvvalaiChatModel to exclude
 * image-generation, audio, video, embedding, and OCR models from chat lists.
 */
const NON_CHAT_ID_PATTERNS = [
    'image',
    'dall-e',
    'stable-diffusion',
    'midjourney',
    'flux',
    'audio',
    'video',
    'embed',
    'tts',
    'ocr',
] as const;

/**
 * Modes that are definitively not chat-compatible.
 */
const NON_CHAT_MODES = new Set([
    'image',
    'image_generation',
    'image_edit',
    'audio',
    'text_to_speech',
    'moderation',
    'video_generation',
    'embedding',
    'ocr',
]);

/**
 * Fetches the model list from the Avvalai API and returns a normalized array.
 * Handles both direct array and `{ data: [...] }` response shapes, as well
 * as string responses that need parsing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchModelList(context: ILoadOptionsFunctions): Promise<any[]> {
    try {
        const raw = await context.helpers.httpRequestWithAuthentication.call(context, 'avvalaiApi', {
            method: 'GET',
            url: `${AVVALAI_BASE_URL}/models`,
        });

        let parsed = raw;
        if (typeof raw === 'string') {
            try {
                parsed = JSON.parse(raw);
            } catch {
                return [];
            }
        }

        if (Array.isArray(parsed)) {
            return parsed;
        }

        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            const data = (parsed as Record<string, unknown>).data;
            if (Array.isArray(data)) {
                return data;
            }
        }
    } catch {
        // Return empty array instead of throwing to prevent n8n UI "Error fetching options" red box
        // This is crucial for n8n community nodes when credentials aren't set yet.
        return [];
    }

    return [];
}

/**
 * Extracts unique provider names from the model list and returns them
 * as n8n option items.  Shared by Avvalai.node and AvvalaiChatModel.node.
 */
export async function loadProviderOptions(
    context: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
    const modelList = await fetchModelList(context);
    const providers = new Set<string>();

    for (const model of modelList) {
        if (model.owned_by) {
            providers.add(model.owned_by);
        }
    }

    return Array.from(providers).map((provider) => ({
        name: provider,
        value: provider,
    }));
}

/**
 * Returns `true` if a model should be excluded from a chat model list
 * based on its `mode` field.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNonChatMode(model: any): boolean {
    return model.mode != null && NON_CHAT_MODES.has(model.mode);
}

/**
 * Returns `true` if a model ID looks like a non-chat model (image gen, tts, etc.).
 */
export function looksLikeNonChatId(modelId: string): boolean {
    const lower = modelId.toLowerCase();
    return NON_CHAT_ID_PATTERNS.some((pattern) => lower.includes(pattern));
}
