import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

const script = resolve(import.meta.dirname, "release.mjs");

function runRelease(checkExit: number) {
  const root = mkdtempSync(join(tmpdir(), "storm-release-script-"));
  const log = join(root, "commands");
  // External commands are replaced at the process boundary; the actual release
  // script must decide whether builds and publishing are permitted to run.
  const command = `#!/bin/sh\nprintf '%s\\n' "$0 $*" >> "$RELEASE_TEST_LOG"\ncase "$*" in\n  'exec tsx tools/scripts/src/release-check.cts') exit "$RELEASE_TEST_CHECK_EXIT" ;;\nesac\n`;
  writeFileSync(join(root, "pnpm"), command, { mode: 0o755 });
  writeFileSync(join(root, "node"), command, { mode: 0o755 });
  const result = spawnSync(
    process.execPath,
    [script, "--base=abc", "--head=def"],
    {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${root}:${process.env.PATH}`,
        RELEASE_TEST_LOG: log,
        RELEASE_TEST_CHECK_EXIT: String(checkExit)
      }
    }
  );
  const commands = readFileSync(log, "utf8").trim().split("\n");
  rmSync(root, { recursive: true, force: true });
  return { result, commands };
}

test("a proven no-op exits successfully without building or publishing", () => {
  const { result, commands } = runRelease(10);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(commands.length, 2);
  assert.match(result.stdout, /skipping builds and publishing/);
});

test("a failed release check fails without building or publishing", () => {
  const { result, commands } = runRelease(2);
  assert.equal(result.status, 1, result.stderr);
  assert.equal(commands.length, 2);
});

test("a release builds JS artifacts in one graph before invoking versioning", () => {
  const { result, commands } = runRelease(0);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(commands.length, 4);
  assert.match(
    commands[2]!,
    /nx run-many --target=build --projects=packages\/\* --configuration=production/
  );
  assert.match(commands[3]!, /git\.cjs release --base=abc --head=def/);
});
