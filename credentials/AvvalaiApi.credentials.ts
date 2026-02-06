import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class AvvalaiApi implements ICredentialType {
	name = 'avvalaiApi';

	displayName = 'Avvalai API';
	icon = 'file:avvalai.svg' as Icon;

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-avvalai?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.avalai.ir/v1',
			url: '/v1/user',
		},
	};
}
