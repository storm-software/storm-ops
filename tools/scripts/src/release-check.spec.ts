import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

const workspaceRoot = resolve(import.meta.dirname, "../../..");
const tsx = join(workspaceRoot, "node_modules/.bin/tsx");
const checkModule = join(
  workspaceRoot,
  "packages/git-tools/src/release/check.ts"
);

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "storm-release-check-"));
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: root,
      env: {
        ...process.env,
        GIT_CONFIG_GLOBAL: "/dev/null",
        GIT_CONFIG_NOSYSTEM: "1"
      },
      stdio: "pipe"
    });
  const write = (file: string, text: string) =>
    writeFileSync(join(root, file), text);
  const commit = (message: string) => {
    git("add", ".");
    git(
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.com",
      "commit",
      "--no-gpg-sign",
      "-m",
      message
    );
  };
  mkdirSync(join(root, "packages/example"), { recursive: true });
  write(
    "nx.json",
    JSON.stringify({
      release: {
        groups: {
          packages: {
            projects: ["example"],
            projectsRelationship: "independent",
            version: {
              currentVersionResolver: "git-tag",
              specifierSource: "conventional-commits"
            }
          }
        }
      }
    })
  );
  write("package.json", JSON.stringify({ private: true }));
  write(
    "packages/example/package.json",
    JSON.stringify({ name: "example", version: "1.0.0" })
  );
  write("packages/example/index.ts", "export const value = 1;\n");
  git("init", "--initial-branch=main");
  commit("feat(example): Initial version");
  git("tag", "example@1.0.0");
  const check = () =>
    execFileSync(
      tsx,
      [
        "-e",
        `
    import { hasReleaseChanges } from ${JSON.stringify(checkModule)};
    import { getReleaseConfig } from ${JSON.stringify(join(workspaceRoot, "packages/git-tools/src/release/config.ts"))};
    const graph = { nodes: { example: { name: "example", type: "lib", data: {
      root: "packages/example", tags: ["language:typescript"], targets: {}
    } } }, dependencies: { example: [] }, externalNodes: {} };
    const config = { workspaceRoot: process.cwd(), name: "fixture", logLevel: "fatal" };
    const releaseConfig = getReleaseConfig(graph, {}, config);
    hasReleaseChanges(graph, releaseConfig, config).then(result => console.log("RESULT=" + result));
  `
      ],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          NX_DAEMON: "false",
          NX_BASE: "HEAD",
          NX_HEAD: "HEAD"
        }
      }
    ).includes("RESULT=true");
  return {
    root,
    git,
    write,
    commit,
    check,
    cleanup: () => rmSync(root, { recursive: true, force: true })
  };
}

test("tagged code and documentation-only commits do not require builds", () => {
  const f = fixture();
  try {
    assert.equal(f.check(), false);
    f.write("packages/example/README.md", "Documentation update\n");
    f.commit("docs(example): Clarify usage");
    assert.equal(f.check(), false);
  } finally {
    f.cleanup();
  }
});

test("release-worthy commits are detected since the package tag, including previous successful no-op runs", () => {
  const f = fixture();
  try {
    f.write("packages/example/index.ts", "export const value = 2;\n");
    f.commit("fix(example): Correct value");
    // NX_BASE at HEAD must not hide an unpublished change since the package tag.
    assert.equal(f.check(), true);
  } finally {
    f.cleanup();
  }
});

test("breaking documentation commits still require a release", () => {
  const f = fixture();
  try {
    f.write("packages/example/README.md", "Breaking contract\n");
    f.commit("docs(example)!: Change contract");
    assert.equal(f.check(), true);
  } finally {
    f.cleanup();
  }
});

test("missing tags conservatively run the normal release", () => {
  const f = fixture();
  try {
    f.git("tag", "-d", "example@1.0.0");
    assert.equal(f.check(), true);
  } finally {
    f.cleanup();
  }
});
