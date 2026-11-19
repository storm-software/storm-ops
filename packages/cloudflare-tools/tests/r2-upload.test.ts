import { S3Client } from "@aws-sdk/client-s3";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout } from "node:timers/promises";
import { uploadFile, uploadFiles } from "../src/utils/r2-bucket-helpers";

function createClient(
  statuses: (number | Error)[],
  onRequest = async () => {}
) {
  const requests: {
    hostname: string;
    path: string;
    body: Buffer;
    version?: string;
  }[] = [];
  const client = new S3Client({
    region: "auto",
    endpoint: "https://r2.example.test",
    credentials: { accessKeyId: "test", secretAccessKey: "test" },
    // Exercise our retry boundary even when the SDK has exhausted its budget.
    maxAttempts: 1,
    requestChecksumCalculation: "WHEN_REQUIRED",
    requestHandler: {
      async handle(request) {
        requests.push({
          hostname: request.hostname,
          path: request.path,
          body: Buffer.from(request.body),
          version: request.headers["x-amz-meta-version"]
        });
        const statusCode = statuses.shift() ?? 200;
        await onRequest();
        if (statusCode instanceof Error) {
          throw statusCode;
        }
        return {
          response: {
            statusCode,
            headers: { "content-type": "application/xml", etag: '"test"' },
            body: Buffer.from(
              statusCode === 200
                ? ""
                : `<Error><Code>${statusCode === 503 ? "ServiceUnavailable" : "AccessDenied"}</Code><Message>Upload failed</Message></Error>`
            )
          }
        };
      }
    }
  });
  return { client, requests };
}

test("recovers from R2 503 without changing the glyph bytes, key, or version", async () => {
  const { client, requests } = createClient([503, 200]);
  await uploadFile(
    client,
    "storm-public",
    "fonts/storm-serif",
    "pbf/Italic/21504-21759.pbf",
    "1.0.72",
    "\x00\xff\x80glyph"
  );
  assert.equal(requests.length, 2);
  for (const request of requests) {
    assert.equal(request.path, "/fonts/storm-serif/pbf/Italic/21504-21759.pbf");
    assert.equal(request.hostname, "storm-public.r2.example.test");
    assert.deepEqual(
      request.body,
      Buffer.from([0, 255, 128, 103, 108, 121, 112, 104])
    );
    assert.equal(request.version, "1.0.72");
  }
  client.destroy();
});

test("stops after bounded attempts when R2 remains unavailable", async () => {
  const { client, requests } = createClient(Array(10).fill(503));
  await assert.rejects(
    uploadFile(client, "bucket", "fonts", "glyph.pbf", "1.0.0", "glyph"),
    { name: "ServiceUnavailable" }
  );
  assert.equal(requests.length, 4);
  client.destroy();
});

for (const failure of [
  429,
  Object.assign(new Error("Connection reset"), { code: "ECONNRESET" })
]) {
  test(`recovers from ${typeof failure === "number" ? "throttling" : "a connection reset"}`, async () => {
    const { client, requests } = createClient([failure, 200]);
    await uploadFile(client, "bucket", "fonts", "glyph.pbf", "1.0.0", "glyph");
    assert.equal(requests.length, 2);
    client.destroy();
  });
}

test("stops retrying when a transient failure is followed by access denied", async () => {
  const { client, requests } = createClient([503, 403]);
  await assert.rejects(
    uploadFile(client, "bucket", "fonts", "glyph.pbf", "1.0.0", "glyph"),
    { name: "AccessDenied" }
  );
  assert.equal(requests.length, 2);
  client.destroy();
});

for (const status of [400, 403, 404]) {
  test(`does not retry permanent HTTP ${status} errors`, async () => {
    const { client, requests } = createClient([status]);
    await assert.rejects(
      uploadFile(client, "bucket", "fonts", "glyph.pbf", "1.0.0", "glyph")
    );
    assert.equal(requests.length, 1);
    client.destroy();
  });
}

test("dry run sends no requests", async () => {
  const { client, requests } = createClient([]);
  await uploadFile(
    client,
    "bucket",
    "fonts",
    "glyph.pbf",
    "1.0.0",
    "glyph",
    undefined,
    true
  );
  assert.equal(requests.length, 0);
  client.destroy();
});

test("bounds concurrent file uploads and uploads every generated file", async t => {
  const root = await mkdtemp(join(tmpdir(), "r2-upload-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = Array.from({ length: 25 }, (_, i) => join(root, `${i}.pbf`));
  await Promise.all(
    files.map(file => writeFile(file, Buffer.from([0, 255, 128])))
  );
  let active = 0;
  let peak = 0;
  const { client, requests } = createClient([], async () => {
    active++;
    peak = Math.max(peak, active);
    await setTimeout(10);
    active--;
  });
  t.after(() => client.destroy());
  await uploadFiles(client, "bucket", "fonts", root, [...files, root], "1.0.0");
  assert.ok(peak <= 8, `Too many concurrent uploads: ${peak}`);
  assert.ok(peak > 1, "Uploads should run concurrently");
  assert.equal(active, 0);
  assert.equal(requests.length, 25);
  assert.equal(new Set(requests.map(request => request.path)).size, 25);
  for (const request of requests) {
    assert.deepEqual(request.body, Buffer.from([0, 255, 128]));
  }
});

test("drains active uploads and stops scheduling files after a permanent failure", async t => {
  const root = await mkdtemp(join(tmpdir(), "r2-upload-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = Array.from({ length: 25 }, (_, i) => join(root, `${i}.pbf`));
  await Promise.all(files.map(file => writeFile(file, "glyph")));
  let active = 0;
  let started = 0;
  const { client, requests } = createClient([403], async () => {
    active++;
    const order = started++;
    await setTimeout(order === 0 ? 0 : 50);
    active--;
  });
  t.after(() => client.destroy());
  await assert.rejects(
    uploadFiles(client, "bucket", "fonts", root, files, "1.0.0")
  );
  assert.equal(active, 0, "Failure must wait for in-flight uploads to settle");
  assert.ok(requests.length <= 8, "Must not schedule the remaining files");
});
