import { NodeHttp2Handler } from "@smithy/node-http-handler";
import { HttpHandler } from "@smithy/protocol-http";

/**
 * Create a HTTP handler with a 5-minute timeout
 *
 * @returns A NodeHttp2Handler instance with custom request and session timeouts
 */
export function createHttpHandler(): HttpHandler<any> | NodeHttp2Handler {
  return NodeHttp2Handler.create({
    requestTimeout: 20 * 60 * 1000, // 20 minutes
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentStreams: 100
  });
}
