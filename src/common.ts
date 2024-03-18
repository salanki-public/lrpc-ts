
/** Function type */
export type LRPCFunction = (arg?: any) => Promise<any>;

/** The fields of an LRPC request */
export type LRPCRequest =
	{
		/** Must be 'lrpc' */
		lrpc: string;

		/** The name of the function to call */
		functionName: string;

		/** The argument to pass to the function */
		arg?: any;
	}

export type LRPCResponse =
	{
		lrpc: string;
		status: boolean;
		retValue?: any;
		error?: LRPCError;
	}

export type LRPCError =
	{
		errorCode: number;
		errorString?: string;
		errorDetails?: any;
	}

export const LRPC_STRING = 'lrpc';

export const ErrorCodes =
{
	E_UNKNOWN: -1,
	E_REQUEST_IS_EMPTY: -2,
	E_REQUEST_LRPC_FIELD_ERROR: -3,
	E_FUNCTION_NOT_FOUND: -4,
	E_RESPONSE_IS_EMPTY: -5,
	E_RESPONSE_LRPC_FIELD_ERROR: -6,
	E_TRANSPORT: -7
}

export const ErrorStrings =
[
	'',
	'Unknown error',
	'Request is empty',
	'Request lrpc field not found or misformatted',
	'Function not found',
	'Response is empty',
	'Response lrpc field not found or misformatted',
	'Transport error'
]

export function throwLRPCError(
	errorCode: number,
	errorString?: string,
	errorDetails?: any
)
{
	let ex: LRPCError =
	{
		errorCode: errorCode,
		errorString: errorString,
		errorDetails: errorDetails
	}

	throw ex;
}

export function throwLRPCBuiltInError(
	errorCode: number,
	errorDetails?: any
)
{
	throwLRPCError(errorCode, ErrorStrings[-errorCode], errorDetails);
}
