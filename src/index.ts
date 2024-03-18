
/**
 * LRPC - Lightweight RPC for TypeScript
 * 
 * A JSON based RPC library (not JSON RPC)
 * 
 * * transport layer: whatever, http, tcp, websocket...
 * * server-client model
 * * request-response model
 * * promise based
 * * exception-like error handling
 * * server listens for Requests, sends back a Response
 * * client sends Requests, ges back a Response
 * * you can use it with express.js, or whatever you want
 * * each request contains one and only one function call (no batch execution)
 * * each function call contains one and zero argument. Argument must be an object, an array or a primitive.
 * @packageDocumentation
 */

export * from './common';
export * from './LRPCServer';
export * from './LRPCClient';
