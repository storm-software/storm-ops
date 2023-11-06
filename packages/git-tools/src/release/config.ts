export default {
  dryRun: false,
  changelog: true,
  changelogFile: "${PROJECT_DIR}/CHANGELOG.md",
  commitMessage:
    "chore(${PROJECT_NAME}): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
  linkCompare: true,
  linkReferences: true,
  npm: true,
  github: true,
  githubOptions: {},
  git: true,
  gitAssets: [
    "${WORKSPACE_DIR}/LICENSE",
    "${PROJECT_DIR}/package.json",
    "${PROJECT_DIR}/README.md",
    "${WORKSPACE_DIR}/assets/logo-light.png",
    "${WORKSPACE_DIR}/assets/logo-dark.png"
  ],
  tagFormat: "${PROJECT_NAME}-v${version}",
  packageJsonDir: "${PROJECT_DIR}",
  repositoryUrl: process.env.CI_REPO_URL,
  branches: [
    "main",
    "next",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true }
  ]
};
