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
                        url: '=/search/{{$parameter.search_tool_name}}',
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
        required: true,
        default: 'perplexity-search',
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
            },
        },
        description: 'The search provider to use. Each tool has different strengths and pricing.',
        options: [
            {
                name: 'DataForSEO ($0.003/query)',
                value: 'dataforseo-search',
                description: 'Most affordable — advanced filtering, device/OS simulation',
            },
            {
                name: 'Exa AI ($0.025/query)',
                value: 'exa_ai-search',
                description: 'Semantic neural search — best for research papers and academic content',
            },
            {
                name: 'Firecrawl ($0.008/query)',
                value: 'firecrawl-search',
                description: 'Search with web scraping and content extraction',
            },
            {
                name: 'Google PSE ($0.005/query)',
                value: 'google_pse-search',
                description: 'Google-powered customizable search',
            },
            {
                name: 'Parallel AI ($0.004/query)',
                value: 'parallel_ai-search',
                description: 'Fast parallel processing — supports multiple queries',
            },
            {
                name: 'Parallel AI Pro ($0.009/query)',
                value: 'parallel_ai-search-pro',
                description: 'Enhanced parallel search with better result quality',
            },
            {
                name: 'Perplexity ($0.005/query)',
                value: 'perplexity-search',
                description: 'AI-powered search with high-quality results',
            },
            {
                name: 'Tavily ($0.008/query)',
                value: 'tavily-search',
                description: 'General web search with country filtering',
            },
            {
                name: 'Tavily Advanced ($0.016/query)',
                value: 'tavily-search-advanced',
                description: 'Advanced search with enhanced filtering and result quality',
            },
        ],
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
        description: 'The search query string',
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
        typeOptions: {
            minValue: 1,
            maxValue: 20,
        },
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
        displayName: 'Depth',
        name: 'depth',
        type: 'number',
        typeOptions: {
            minValue: 1,
            maxValue: 700,
        },
        default: 20,
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
                search_tool_name: ['dataforseo-search'],
            },
        },
        description: 'Number of search results to retrieve (max 700). Unlike Max Results which caps at 20, this controls the DataForSEO crawl depth.',
        routing: {
            send: {
                type: 'body',
                property: 'depth',
            },
        },
    },
    {
        displayName: 'Time-Based Search',
        name: 'tbs',
        type: 'options',
        options: [
            { name: 'Any Time', value: '' },
            { name: 'Past Day', value: 'qdr:d' },
            { name: 'Past Hour', value: 'qdr:h' },
            { name: 'Past Month', value: 'qdr:m' },
            { name: 'Past Week', value: 'qdr:w' },
            { name: 'Past Year', value: 'qdr:y' },
        ],
        default: '',
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
                search_tool_name: ['firecrawl-search'],
            },
        },
        description: 'Filter results by time period (Firecrawl only)',
        routing: {
            send: {
                type: 'body',
                property: 'tbs',
            },
        },
    },
    {
        displayName: 'Location',
        name: 'location',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
                search_tool_name: ['firecrawl-search'],
            },
        },
        description: 'Geographic location filter (e.g. "San Francisco,California,United States"). Firecrawl only.',
        routing: {
            send: {
                type: 'body',
                property: 'location',
            },
        },
    },
    {
        displayName: 'Processor',
        name: 'processor',
        type: 'options',
        options: [
            { name: 'Base', value: 'base' },
            { name: 'Pro', value: 'pro' },
        ],
        default: 'base',
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
                search_tool_name: ['parallel_ai-search', 'parallel_ai-search-pro'],
            },
        },
        description: 'Processing engine to use (Parallel AI only)',
        routing: {
            send: {
                type: 'body',
                property: 'processor',
            },
        },
    },
    {
        displayName: 'Max Characters Per Result',
        name: 'max_chars_per_result',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                resource: ['search'],
                operation: ['search'],
                search_tool_name: ['parallel_ai-search', 'parallel_ai-search-pro'],
            },
        },
        description: 'Maximum characters per result snippet. 0 means no limit. (Parallel AI only)',
        routing: {
            send: {
                type: 'body',
                property: 'max_chars_per_result',
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
                description:
                    'Country for search results. Format depends on provider: full name for DataForSEO/Tavily (e.g. "United States"), ISO code for others.',
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
                description: 'Device type to simulate (DataForSEO only)',
            },
            {
                displayName: 'Domain Filter',
                name: 'search_domain_filter',
                type: 'string',
                default: '',
                description:
                    'Comma-separated list of domains to filter results (e.g. "arxiv.org, nature.com"). Max 20 domains.',
            },
            {
                displayName: 'Language Code',
                name: 'language_code',
                type: 'string',
                default: '',
                description: 'Language code for results, e.g. "en", "de" (DataForSEO only)',
            },
            {
                displayName: 'Max Tokens Per Page',
                name: 'max_tokens_per_page',
                type: 'number',
                default: 1024,
                description: 'Maximum tokens per page to process. Default: 1024.',
            },
            {
                displayName: 'OS',
                name: 'os',
                type: 'string',
                default: '',
                description:
                    'Operating system to simulate, e.g. "windows", "macos", "android", "ios" (DataForSEO only)',
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
                        const additionalFields = this.getNodeParameter('additionalFields', {}) as Record<
                            string,
                            unknown
                        >;
                        const body = requestOptions.body as Record<string, unknown>;

                        // Merge additional fields into body, skipping empty strings
                        for (const [key, value] of Object.entries(additionalFields)) {
                            if (value !== '' && value !== undefined) {
                                body[key] = value;
                            }
                        }

                        // Convert comma-separated domain filter string to array
                        if (body.search_domain_filter && typeof body.search_domain_filter === 'string') {
                            body.search_domain_filter = (body.search_domain_filter as string)
                                .split(',')
                                .map((d: string) => d.trim())
                                .filter((d: string) => d);
                        }

                        return requestOptions;
                    },
                ],
            },
        },
    },
];
