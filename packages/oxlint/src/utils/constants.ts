export const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
export const GLOB_SRC_FILE = `*.${GLOB_SRC_EXT}`;
export const GLOB_SRC = `**/${GLOB_SRC_FILE}`;

export const GLOB_TEST = [
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`,
  `**/*.bench.${GLOB_SRC_EXT}`,
  `**/*.benchmark.${GLOB_SRC_EXT}`
];

export const GLOB_EXCLUDE = [
  "**/.git",
  "**/node_modules",
  "**/dist",
  "**/tmp",
  "**/coverage",
  "**/bench",
  "**/__snapshots__",
  "**/__test__",
  "**/__mocks__",
  "**/__generated__",
  "**/.nx",
  "**/.next",
  "**/.storm",
  "**/.wrangler",
  "**/.rolldown",
  "**/.cache",
  "**/.history",
  "**/.idea",
  "**/.vscode",
  "**/.yarn",
  "**/.pnp.*",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/package-lock.json",
  "**/bun.lockb",
  "**/*.min.*",
  "**/next-env.d.ts",
  "**/CHANGELOG*.md",
  "**/CONTRIBUTING.md",
  "**/SECURITY.md",
  "**/CODE_OF_CONDUCT.md",
  "**/PULL_REQUEST_TEMPLATE.md",
  "**/LICENSE*",
  ".agents/**/*",
  "**/.agents/**/*",
  ".claude/**/*",
  "**/.claude/**/*",
  ".codex/**/*",
  "**/.codex/**/*",
  ".cursor/**/*",
  "**/.cursor/**/*",
  ".opencode/**/*",
  "**/.opencode/**/*"
];
