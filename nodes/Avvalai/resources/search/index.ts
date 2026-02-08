import { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const searchDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['search'],
            },
        },
        options: [
            {
                name: 'Search',
                value: 'search',
                action: 'Perform a web search',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/search',
                    },
                },
            },
        ],
        default: 'search',
    },
    {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
            },
        },
        description: 'The search query',
        routing: {
            send: {
                type: 'body',
                property: 'query',
            },
        },
    },
    {
        displayName: 'Max Results',
        name: 'max_results',
        type: 'number',
        default: 10,
        description: 'Maximum number of results to return (1-20)',
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'max_results',
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
            },
        },
        options: [
            {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
                description: 'Country for search results (e.g., "United States")',
            },
            {
                displayName: 'Device',
                name: 'device',
                type: 'options',
                options: [
                    { name: 'Desktop', value: 'desktop' },
                    { name: 'Mobile', value: 'mobile' },
                    { name: 'Tablet', value: 'tablet' },
                ],
                default: 'desktop',
                description: 'Device type to simulate',
            },
            {
                displayName: 'Domain Filter',
                name: 'search_domain_filter',
                type: 'string',
                default: '',
                description: 'Comma-separated list of domains to filter results',
            },
            {
                displayName: 'Language Code',
                name: 'language_code',
                type: 'string',
                default: '',
                description: 'Language code for results (e.g., "en")',
            },
            {
                displayName: 'OS',
                name: 'os',
                type: 'string',
                default: '',
                description: 'Operating system to simulate (e.g., "windows", "macos")',
            },
        ],
        routing: {
            send: {
                type: 'body',
                preSend: [
                    async function (
                        this: IExecuteSingleFunctions,
                        requestOptions: IHttpRequestOptions,
                    ): Promise<IHttpRequestOptions> {
                        const additionalFields = this.getNodeParameter('additionalFields', {}) as Record<string, unknown>;
                        const body = requestOptions.body as Record<string, unknown>;

                        Object.assign(body, additionalFields);

                        if (body.search_domain_filter && typeof body.search_domain_filter === 'string') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            body.search_domain_filter = (body.search_domain_filter as string).split(',').map((d: string) => d.trim()).filter((d: string) => d);
                        }

                        // Ensure search_tool_name is set if not present?
                        // Api supports defaulting to dataforseo-search if omitted? 
                        // Docs say: "search_tool_name": "dataforseo-search".
                        // I'll add it explicitly just in case.
                        if (!body.search_tool_name) {
                            body.search_tool_name = 'dataforseo-search';
                        }

                        return requestOptions;
                    },
                ],
            },
        },
    },
];
