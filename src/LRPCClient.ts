
import * as common from './common';

export interface ILRPCClientTransport
{
	callFunction(request: common.LRPCRequest): Promise<common.LRPCResponse>;
}

export class LRPCClient
{
	constructor(
		private lrpcClientTransport: ILRPCClientTransport
	)
	{

	}

	async callFunction(functionName: string, arg?: any): Promise<any>
	{
		let request: common.LRPCRequest =
		{
			lrpc: common.LRPC_STRING,
			functionName: functionName,
			arg: arg
		}

		let response: common.LRPCResponse;
		response = await this.lrpcClientTransport.callFunction(request);

		if (!response) common.throwLRPCBuiltInError(common.ErrorCodes.E_RESPONSE_IS_EMPTY);
		if (response.lrpc !== common.LRPC_STRING) common.throwLRPCBuiltInError(common.ErrorCodes.E_REQUEST_LRPC_FIELD_ERROR);
		if (!response.status)
		{
			if (response.error) throw response.error;
			common.throwLRPCBuiltInError(common.ErrorCodes.E_UNKNOWN);
		}
		return response.retValue;
	}
}

export class LRPCClientFetchTransport implements ILRPCClientTransport
{
	constructor(
		private url: string,
		private method: string = 'POST'
	)
	{

	}

	async callFunction(request: common.LRPCRequest): Promise<common.LRPCResponse>
	{
		let response: common.LRPCResponse =
		{
			lrpc: common.LRPC_STRING,
			status: true
		};

		let res = await fetch(this.url,
			{
				method: this.method,
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(request),
			});

		if (res.status != 200)
		{
			common.throwLRPCBuiltInError(common.ErrorCodes.E_TRANSPORT);
		} else
		{
			response = await res.json();
		}

		return response;
	}
}

export function createLRPCClientInterface<T>(lrpcClient: LRPCClient): T
{
	return new Proxy({},
		{
			get(target: any, key: string, props: PropertyDescriptor)
			{
				return async (...args: any[]) =>
				{
					return await lrpcClient.callFunction(key, args[0]);
				}
			}
		}) as T
}
