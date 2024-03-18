
import lrpc = require('../src');

import * as chai from 'chai';
import * as http from 'http';
import express = require('express');

describe('LRPC', async () =>
{
	it('Basic usage', async () =>
	{
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

		let result = await client.func1("John");

		chai.assert.equal(result, 'Hello John');
	})
})
