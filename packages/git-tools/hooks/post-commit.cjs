const { execSync } = require("node:child_process");

execSync(
  "command -v git-lfs >/dev/null 2>&1 || { echo >&2 '\nThis repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-commit.\n'; exit 2; }"
);
execSync('git lfs post-commit "$@"');
