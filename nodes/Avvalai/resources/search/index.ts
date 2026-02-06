import { INodeProperties, IHttpRequestOptions, IExecuteSingleFunctions } from 'n8n-workflow';

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
        displayName: 'Search Tool',
        name: 'search_tool_name',
        type: 'options',
        options: [
            { name: 'DataForSEO Search', value: 'dataforseo-search' },
            { name: 'Exa AI Search', value: 'exa_ai-search' },
            { name: 'Firecrawl Search', value: 'firecrawl-search' },
            { name: 'Google PSE Search', value: 'google_pse-search' },
            { name: 'Parallel AI Search', value: 'parallel_ai-search' },
            { name: 'Parallel AI Search Pro', value: 'parallel_ai-search-pro' },
            { name: 'Perplexity Search', value: 'perplexity-search' },
            { name: 'Tavily Search', value: 'tavily-search' },
            { name: 'Tavily Search Advanced', value: 'tavily-search-advanced' },
        ],
        required: true,
        default: 'tavily-search',
        displayOptions: {
            show: {
                resource: ['search'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'search_tool_name',
            },
        },
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
            },
        },
        description: 'Search query. Can be a single string or array of strings.',
        routing: {
            send: {
                type: 'body',
                property: 'query',
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
            },
        },
        options: [
            {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
                description: 'Country filter. Format varies by provider.',
            },
            {
                displayName: 'Max Results',
                name: 'max_results',
                type: 'number',
                typeOptions: { minValue: 1, maxValue: 20 },
                default: 10,
                description: 'Maximum number of results (1-20)',
            },
            {
                displayName: 'Max Tokens Per Page',
                name: 'max_tokens_per_page',
                type: 'number',
                default: 1024,
                description: 'Maximum tokens per page to process',
            },
            {
                displayName: 'Search Domain Filter',
                name: 'search_domain_filter',
                type: 'string',
                default: '',
                description: 'Comma-separated list of domains to filter results',
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
                        if (additionalFields.search_domain_filter) {
                            additionalFields.search_domain_filter = (additionalFields.search_domain_filter as string)
                                .split(',')
                                .map((d: string) => d.trim());
                        }
                        Object.assign(requestOptions.body as Record<string, unknown>, additionalFields);
                        return requestOptions;
                    },
                ],
            },
        },
    },
];
