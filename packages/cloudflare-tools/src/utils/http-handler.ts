import { NodeHttpHandler } from "@smithy/node-http-handler";
import { HttpHandler } from "@smithy/protocol-http";

/**
 * Create a HTTP handler with a 5-minute timeout
 *
 * @returns A NodeHttp2Handler instance with custom request and session timeouts
 */
export function createHttpHandler(): HttpHandler<any> | NodeHttpHandler {
  return NodeHttpHandler.create({
    connectionTimeout: 5 * 60 * 1000, // 5 minutes
    requestTimeout: 5 * 60 * 1000 // 5 minutes
  });
}
