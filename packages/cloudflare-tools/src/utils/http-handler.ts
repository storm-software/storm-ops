import { NodeHttp2Handler } from "@smithy/node-http-handler";

/**
 * Create a HTTP handler with a 5-minute timeout
 *
 * @returns A NodeHttp2Handler instance with a 5-minute request timeout
 */
export function createHttpHandler() {
  return new NodeHttp2Handler({
    requestTimeout: 5 * 60 * 1000,
    sessionTimeout: 5 * 60 * 1000
  });
}
