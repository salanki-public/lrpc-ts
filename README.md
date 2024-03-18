
LRPC - Lightweight RPC for TypeScript

A JSON based RPC library (not JSON RPC)

## Features

*   transport layer: whatever, http, tcp, websocket...
*   server-client model
*   request-response model
*   promise based
*   exception-like error handling
*   server listens for Requests, sends back a Response
*   client sends Requests, ges back a Response
*   you can use it with express.js, or whatever you want
*   each request contains one and only one function call (no batch execution)
*   each function call contains one and zero argument. Argument must be an object, an array or a primitive.

```typescript

		type Func3Input =
			{
				field1: number;
				arr: string[];
				something:
				{
					a: number;
					b: number;
				}
			}

		interface ITestAPI
		{
			func1(s: string): Promise<string>;
			func2(): Promise<void>;
			func3(input: Func3Input): Promise<number[]>;
		}

		class TestImpl implements ITestAPI
		{
			async func1(s: string): Promise<string>
			{
				return "Hello " + s;
			}

			async func2(): Promise<void>
			{
				console.log('Func2 called');
			}

			async func3(input: Func3Input): Promise<number[]>
			{
				console.log('Another dummy function');
				return [];
			}
		}

		let target = new TestImpl();

		let lrpcServer = new lrpc.LRPCServer();
		lrpc.addFunctionsToLRPCServer(lrpcServer, target);

		let app = express();
		app.use(express.json());
		app.post("/",lrpcServer.express());
		let server = http.createServer(app);
		server.listen(3000, "localhost");

		let client = lrpc.createLRPCClientInterface<ITestAPI>(
			new lrpc.LRPCClient(
				new lrpc.LRPCClientFetchTransport("http://localhost:3000")
			)
		);


```

## Installation
