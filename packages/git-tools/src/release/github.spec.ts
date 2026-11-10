import type { StormWorkspaceConfig } from "@storm-software/config/types";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { inspect } from "node:util";
import { isUserAnOrganizationMember } from "./github";

// Keep release rendering/configuration out of the membership API tests.
jest.mock("@storm-software/config-tools/get-config", () => ({}));
jest.mock("../utilities", () => ({}));
jest.mock("../utilities/changelog-utils", () => ({}));

describe("isUserAnOrganizationMember", () => {
  const config = { organization: "storm-software" } as StormWorkspaceConfig;
  const originalEnv = process.env;
  const originalAdapter = axios.defaults.adapter;

  beforeEach(() => {
    process.env = { ...originalEnv, STORM_BOT_GITHUB_TOKEN: "test-pat-secret" };
  });

  afterEach(() => {
    process.env = originalEnv;
    axios.defaults.adapter = originalAdapter;
  });

  function respond(status: number, message?: string) {
    axios.defaults.adapter = async request => {
      const response = {
        status,
        statusText: String(status),
        data: { message },
        headers: new AxiosHeaders({ "x-github-request-id": "test-request-id" }),
        config: request
      };
      if (request.validateStatus && !request.validateStatus(status)) {
        throw new AxiosError(
          message,
          "ERR_BAD_RESPONSE",
          request,
          {},
          response
        );
      }
      return response;
    };
  }

  it("accepts confirmed membership", async () => {
    respond(204);
    await expect(
      isUserAnOrganizationMember("sullivanpj", config)
    ).resolves.toBe(true);
  });

  it.each([
    [401, "Bad credentials"],
    [403, "Resource not accessible by personal access token"],
    [429, "API rate limit exceeded"],
    [500, "Internal Server Error"]
  ])("reports HTTP %s instead of non-membership", async (status, message) => {
    respond(status, message);
    const error = await isUserAnOrganizationMember("sullivanpj", config).catch(
      error => error
    );
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(`HTTP ${status}`);
    expect(error.message).toContain(message);
    expect(error.message).toContain("STORM_BOT_GITHUB_TOKEN");
    expect(error.message).toContain("test-request-id");
    expect(inspect(error, { depth: 10 })).not.toContain("test-pat-secret");
    expect(error.cause).toBeUndefined();
  });

  it("explains that a 404 can mean missing membership or token access", async () => {
    respond(404, "Not Found");
    await expect(
      isUserAnOrganizationMember("sullivanpj", config)
    ).rejects.toThrow(/HTTP 404.*membership.*access/i);
  });

  it("reports network failure without exposing the request", async () => {
    axios.defaults.adapter = async request => {
      throw new AxiosError("connect ECONNRESET", "ECONNRESET", request);
    };
    await expect(
      isUserAnOrganizationMember("sullivanpj", config)
    ).rejects.toThrow(/ECONNRESET/);
  });

  it.each(["STORM_BOT_GITHUB_TOKEN", "GITHUB_TOKEN", "GH_TOKEN"])(
    "identifies %s as the selected credential",
    async source => {
      delete process.env.STORM_BOT_GITHUB_TOKEN;
      delete process.env.GITHUB_TOKEN;
      delete process.env.GH_TOKEN;
      process.env[source] = "test-pat-secret";
      respond(401, "Bad credentials");
      await expect(
        isUserAnOrganizationMember("sullivanpj", config)
      ).rejects.toThrow(`token source: ${source}`);
    }
  );

  it("redacts the credential even if an upstream error echoes it", async () => {
    respond(401, "Rejected test-pat-secret");
    const error = await isUserAnOrganizationMember("sullivanpj", config).catch(
      error => error
    );
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("[REDACTED]");
    expect(inspect(error, { depth: 10 })).not.toContain("test-pat-secret");
  });

  it("reports missing organization configuration", async () => {
    await expect(
      isUserAnOrganizationMember("sullivanpj", {} as StormWorkspaceConfig)
    ).rejects.toThrow(/no organization/i);
  });

  it("does not silently treat an unexpected success response as non-membership", async () => {
    respond(200);
    await expect(
      isUserAnOrganizationMember("sullivanpj", config)
    ).rejects.toThrow(/HTTP 200/);
  });
});
