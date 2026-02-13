import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class AvvalaiSearch implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Avvalai Search',
        name: 'avvalaiSearch',
        icon: 'file:../Avvalai/avvalai.svg',
        group: ['transform'],
        version: 1,
        usableAsTool: true,
        subtitle: '={{$parameter.search_tool_name}}',
        description:
            'Search the web using Avvalai — 9 providers including Perplexity, Tavily, DataForSEO, Exa AI, Firecrawl, Google PSE, and Parallel AI',
        defaults: {
            name: 'Avvalai Search',
        },
        codex: {
            categories: ['AI'],
            subcategories: {
                AI: ['Tools'],
                Tools: ['Search'],
            },
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://docs.avalai.ir/en/api-reference/search',
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
                displayName: 'Search Tool',
                name: 'search_tool_name',
                type: 'options',
                required: true,
                default: 'perplexity-search',
                description:
                    'The search provider to use. Each tool has different strengths and pricing.',
                options: [
                    {
                        name: 'DataForSEO ($0.003/query)',
                        value: 'dataforseo-search',
                        description:
                            'Most affordable — advanced filtering, device/OS simulation',
                    },
                    {
                        name: 'Exa AI ($0.025/query)',
                        value: 'exa_ai-search',
                        description:
                            'Semantic neural search — best for research papers and academic content',
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
                        description:
                            'Fast parallel processing — supports multiple queries',
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
                        description:
                            'Advanced search with enhanced filtering and result quality',
                    },
                ],
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/search/{{$parameter.search_tool_name}}',
                    },
                },
            },
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                required: true,
                default: '',
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
                description: 'Maximum number of search results to return (1-20)',
                typeOptions: {
                    minValue: 1,
                    maxValue: 20,
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
                options: [
                    {
                        displayName: 'Country',
                        name: 'country',
                        type: 'string',
                        default: '',
                        description:
                            'Country filter. Format varies by provider (e.g., "us" for DataForSEO, "united states" for Tavily).',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'country',
                            },
                        },
                    },
                    {
                        displayName: 'Device',
                        name: 'device',
                        type: 'options',
                        options: [
                            { name: 'Desktop', value: 'desktop' },
                            { name: 'Mobile', value: 'mobile' },
                        ],
                        default: 'desktop',
                        description: 'Device type for search simulation (DataForSEO only)',
                        displayOptions: {
                            show: {
                                '/search_tool_name': ['dataforseo-search'],
                            },
                        },
                        routing: {
                            send: {
                                type: 'body',
                                property: 'device',
                            },
                        },
                    },
                    {
                        displayName: 'Domain Filter',
                        name: 'search_domain_filter',
                        type: 'string',
                        default: '',
                        description:
                            'Comma-separated list of domains to filter results (max 20)',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'search_domain_filter',
                                value:
                                    '={{ $value ? $value.split(",").map(d => d.trim()) : undefined }}',
                            },
                        },
                    },
                    {
                        displayName: 'Language',
                        name: 'language',
                        type: 'string',
                        default: '',
                        description: 'Language for search results (DataForSEO only)',
                        displayOptions: {
                            show: {
                                '/search_tool_name': ['dataforseo-search'],
                            },
                        },
                        routing: {
                            send: {
                                type: 'body',
                                property: 'language',
                            },
                        },
                    },
                    {
                        displayName: 'Max Tokens Per Page',
                        name: 'max_tokens_per_page',
                        type: 'number',
                        default: 1024,
                        description: 'Maximum tokens per page to process',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'max_tokens_per_page',
                            },
                        },
                    },
                    {
                        displayName: 'Operating System',
                        name: 'os',
                        type: 'options',
                        options: [
                            { name: 'Android', value: 'android' },
                            { name: 'iOS', value: 'ios' },
                            { name: 'Linux', value: 'linux' },
                            { name: 'macOS', value: 'macos' },
                            { name: 'Windows', value: 'windows' },
                        ],
                        default: 'windows',
                        description:
                            'Operating system for search simulation (DataForSEO only)',
                        displayOptions: {
                            show: {
                                '/search_tool_name': ['dataforseo-search'],
                            },
                        },
                        routing: {
                            send: {
                                type: 'body',
                                property: 'os',
                            },
                        },
                    },
                    {
                        displayName: 'Scrape Content',
                        name: 'scrape',
                        type: 'boolean',
                        default: false,
                        description:
                            'Whether to scrape and return full content from result pages (Firecrawl only)',
                        displayOptions: {
                            show: {
                                '/search_tool_name': ['firecrawl-search'],
                            },
                        },
                        routing: {
                            send: {
                                type: 'body',
                                property: 'scrape',
                            },
                        },
                    },
                    {
                        displayName: 'Timeout',
                        name: 'timeout',
                        type: 'number',
                        default: 60000,
                        description:
                            'Timeout in milliseconds (Firecrawl and Parallel AI only)',
                        displayOptions: {
                            show: {
                                '/search_tool_name': [
                                    'firecrawl-search',
                                    'parallel_ai-search',
                                    'parallel_ai-search-pro',
                                ],
                            },
                        },
                        routing: {
                            send: {
                                type: 'body',
                                property: 'timeout',
                            },
                        },
                    },
                ],
            },
        ],
    };
}
