
import * as common from './common';

export class LRPCServer
{
	addFunction(functionName: string, func: common.LRPCFunction)
	{
		this.functions[functionName] = func;
	}

	express()
	{
		return (req: any, res: any) =>
		{
			res.json(this.processLRPCRequest(req.body));
		}
	}

	async processLRPCRequest(request: common.LRPCRequest): Promise<common.LRPCResponse>
	{
		let response: common.LRPCResponse =
		{
			lrpc: common.LRPC_STRING,
			status: true
		}

		try
		{
			if (!request) common.throwLRPCBuiltInError(common.ErrorCodes.E_REQUEST_IS_EMPTY);
			if (request.lrpc !== common.LRPC_STRING) common.throwLRPCBuiltInError(common.ErrorCodes.E_REQUEST_LRPC_FIELD_ERROR);
			let f = this.functions[request.functionName];
			if (!f) common.throwLRPCBuiltInError(common.ErrorCodes.E_FUNCTION_NOT_FOUND);

			response.retValue = await f(request.arg);
		} catch (e)
		{
			response.status = false;
			let ex = e as common.LRPCError;
			if (ex.errorCode)
			{
				response.error =
				{
					errorCode: ex.errorCode,
					errorString: ex.errorString,
					errorDetails: ex.errorDetails
				}
			} else
			{
				response.error =
				{
					errorCode: common.ErrorCodes.E_UNKNOWN,
					errorString: common.ErrorStrings[-common.ErrorCodes.E_UNKNOWN]
				}
			}
		}

		return response;
	}

	private functions: { [key: string]: common.LRPCFunction } = {};
}

export function addFunctionsToLRPCServer(
	lrpcServer: LRPCServer,
	target: any
)
{
	for (let key in Object.getOwnPropertyDescriptors(Object.getPrototypeOf(target)))
	{
		lrpcServer.addFunction(key, target[key].bind(target));
	}
}
