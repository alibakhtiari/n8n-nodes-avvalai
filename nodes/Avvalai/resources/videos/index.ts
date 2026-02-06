import type { INodeProperties } from 'n8n-workflow';

const showOnlyForVideos = {
    resource: ['videos'],
};

export const videosDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForVideos,
        },
        options: [
            {
                name: 'Content',
                value: 'content',
                action: 'Get video content',
                description: 'Get content of a generated video',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/videos/{{$parameter.videoId}}/content',
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                action: 'Create a video',
                description: 'Create a new video generation',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/videos',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a video',
                description: 'Delete a video generation',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/videos/{{$parameter.videoId}}',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a video',
                description: 'Get a video generation object',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/videos/{{$parameter.videoId}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'List videos',
                description: 'Get many video generations',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/videos',
                    },
                },
            },
            {
                name: 'Remix',
                value: 'remix',
                action: 'Remix a video',
                description: 'Remix an existing video',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/videos/{{$parameter.videoId}}/remix',
                    },
                },
            },
        ],
        default: 'create',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        displayOptions: {
            show: {
                ...showOnlyForVideos,
                operation: ['create', 'remix'],
            },
        },
        options: [
            {
                name: 'Sora 2',
                value: 'sora-2',
            },
            {
                name: 'Sora 2 Pro',
                value: 'sora-2-pro',
            },
            {
                name: 'Veo 3.1 Fast Generate',
                value: 'veo-3.1-fast-generate-001',
            },
            {
                name: 'Veo 3.1 Generate',
                value: 'veo-3.1-generate-001',
            },
        ],
        default: 'sora-2',
        description: 'The model to use for video generation. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        required: true,
    },
    {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: '',
        placeholder: 'A calico cat playing a piano on stage under dramatic spotlights',
        description: 'A text description of the desired video',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForVideos,
                operation: ['create', 'remix'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'prompt',
            },
        },
    },
    {
        displayName: 'Duration (Seconds)',
        name: 'seconds',
        type: 'number',
        default: 4,
        description: 'Duration of the video in seconds',
        displayOptions: {
            show: {
                ...showOnlyForVideos,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'seconds',
                value: '={{$value.toString()}}',
            },
        },
    },
    {
        displayName: 'Size',
        name: 'size',
        type: 'options',
        default: '720x1280',
        description: 'The resolution of the generated video',
        displayOptions: {
            show: {
                ...showOnlyForVideos,
                operation: ['create'],
            },
        },
        options: [
            {
                name: '1024x1792',
                value: '1024x1792',
            },
            {
                name: '1080x1920',
                value: '1080x1920',
            },
            {
                name: '1280x720',
                value: '1280x720',
            },
            {
                name: '1792x1024',
                value: '1792x1024',
            },
            {
                name: '1920x1080',
                value: '1920x1080',
            },
            {
                name: '720x1280',
                value: '720x1280',
            },
        ],
        routing: {
            send: {
                type: 'body',
                property: 'size',
            },
        },
    },
    {
        displayName: 'Input Reference (Base64)',
        name: 'input_reference',
        type: 'string',
        default: '',
        description: 'The image file to use as reference for video generation',
        displayOptions: {
            show: {
                ...showOnlyForVideos,
                operation: ['create'],
            },
        },
        routing: {
            send: {
                type: 'body',
                property: 'input_reference',
            },
        },
    },
    {
        displayName: 'Video ID',
        name: 'videoId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                ...showOnlyForVideos,
                operation: ['get', 'delete', 'remix', 'content'],
            },
        },
        description: 'The ID of the video',
    },
];
