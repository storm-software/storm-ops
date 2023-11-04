const { execSync } = require("node:child_process");

execSync(
  'pnpm lint-staged --concurrent false --config="./lint-staged.config.js"'
);
