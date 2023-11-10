const { execSync } = require("node:child_process");

execSync(
  'pnpm lint-staged --concurrent false --config="@storm-software/git-tools/lint-staged/config.cjs"'
);
execSync("pnpm test");
