import type {
    IExecuteSingleFunctions,
    IHttpRequestOptions,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class AvvalaiOcr implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Avvalai OCR',
        name: 'avvalaiOcr',
        icon: 'file:../Avvalai/avvalai.svg',
        group: ['transform'],
        version: 1,
        usableAsTool: true,
        subtitle: 'Extract text from documents and images',
        description:
            'Extract text from PDFs and images using Avvalai OCR (Mistral-powered). Returns structured Markdown content.',
        defaults: {
            name: 'Avvalai OCR',
        },
        codex: {
            categories: ['AI'],
            subcategories: {
                AI: ['Tools'],
                Tools: ['Other Tools'],
            },
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://docs.avalai.ir/en/api-reference/ocr',
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
        requestDefaults: {
            baseURL: 'https://api.avalai.ir/v1',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Document URL',
                name: 'document_url',
                type: 'string',
                required: true,
                default: '',
                description:
                    'URL of the document (PDF) or image (JPG, PNG, WebP) to process',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/ocr',
                    },
                    send: {
                        type: 'body',
                        property: 'document',
                        value:
                            '={{ { "type": $parameter.document_url.match(/\\.(jpg|jpeg|png|webp)$/i) ? "image_url" : "document_url", "document_url": $parameter.document_url, "image_url": $parameter.document_url } }}',
                    },
                },
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'string',
                default: 'mistral-ocr-latest',
                description: 'The OCR model to use',
                routing: {
                    send: {
                        type: 'body',
                        property: 'model',
                    },
                },
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                options: [
                    {
                        displayName: 'Extract Footer',
                        name: 'extract_footer',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to extract document footers',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'extract_footer',
                            },
                        },
                    },
                    {
                        displayName: 'Extract Header',
                        name: 'extract_header',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to extract document headers',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'extract_header',
                            },
                        },
                    },
                    {
                        displayName: 'Image Limit',
                        name: 'image_limit',
                        type: 'number',
                        default: 0,
                        description:
                            'Maximum number of images to extract per page. 0 means no limit.',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'image_limit',
                            },
                        },
                    },
                    {
                        displayName: 'Image Min Size',
                        name: 'image_min_size',
                        type: 'number',
                        default: 0,
                        description:
                            'Minimum image size in pixels to extract. Images smaller than this are skipped.',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'image_min_size',
                            },
                        },
                    },
                    {
                        displayName: 'Include Image Base64',
                        name: 'include_image_base64',
                        type: 'boolean',
                        default: false,
                        description:
                            'Whether to include extracted images as base64 strings',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'include_image_base64',
                            },
                        },
                    },
                    {
                        displayName: 'Pages',
                        name: 'pages',
                        type: 'string',
                        default: '',
                        description:
                            'Specific pages to process, comma-separated (e.g., "0, 1, 5"). Leave empty for all pages.',
                    },
                    {
                        displayName: 'Table Format',
                        name: 'table_format',
                        type: 'options',
                        options: [
                            { name: 'Markdown', value: 'markdown' },
                            { name: 'HTML', value: 'html' },
                        ],
                        default: 'markdown',
                        description: 'Format for extracted tables',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'table_format',
                            },
                        },
                    },
                ],
                routing: {
                    send: {
                        type: 'body',
                        property: 'additionalFields',
                        preSend: [
                            async function (
                                this: IExecuteSingleFunctions,
                                requestOptions: IHttpRequestOptions,
                            ): Promise<IHttpRequestOptions> {
                                const additionalFields = this.getNodeParameter(
                                    'additionalFields',
                                    {},
                                ) as Record<string, unknown>;
                                const body = requestOptions.body as Record<string, unknown>;

                                Object.assign(body, additionalFields);

                                // Convert comma-separated pages string to number array
                                if (body.pages && typeof body.pages === 'string') {
                                    body.pages = (body.pages as string)
                                        .split(',')
                                        .map((p: string) => parseInt(p.trim(), 10))
                                        .filter((n: number) => !isNaN(n));
                                }

                                return requestOptions;
                            },
                        ],
                    },
                },
            },
        ],
    };
}
