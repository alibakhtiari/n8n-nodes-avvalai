import type { INodeProperties } from 'n8n-workflow';
import { userCreateDescription } from './create';
import { userGetDescription } from './get';

const showOnlyForUsers = {
	resource: ['user'],
};

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new user',
				description: 'Create a new user',
				routing: {
					request: {
						method: 'POST',
						url: '/users',
					},
				},
			},
			{
				name: 'Credit',
				value: 'credit',
				action: 'Get credit balance',
				description: 'Get your current credit balance and usage',
				routing: {
					request: {
						method: 'GET',
						url: 'https://api.avalai.ir/user/v1/credit',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get the data of a single user',
				routing: {
					request: {
						method: 'GET',
						url: '=/users/{{$parameter.userId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get users',
				description: 'Get many users',
				routing: {
					request: {
						method: 'GET',
						url: '/users',
					},
				},
			},
			{
				name: 'Lookup Transaction',
				value: 'lookup',
				action: 'Lookup transaction',
				description: 'Lookup specific transactions by their IDs',
				routing: {
					request: {
						method: 'POST',
						url: 'https://api.avalai.ir/user/v1/transactions/lookup',
					},
				},
			},
			{
				name: 'Transactions',
				value: 'transactions',
				action: 'List transactions',
				description: 'Get a list of your API transactions',
				routing: {
					request: {
						method: 'GET',
						url: 'https://api.avalai.ir/user/v1/transactions',
					},
				},
			},
		],
		default: 'getAll',
	},
	...userGetDescription,
	...userCreateDescription,
];
