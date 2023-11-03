export default {
  dryRun: false,
  changelog: true,
  changelogFile: "${PROJECT_DIR}/CHANGELOG.md",
  commitMessage:
    "chore(${PROJECT_NAME}): Changelogs generated for v${nextRelease.version}\n\n${nextRelease.notes}",
  linkCompare: true,
  linkReferences: true,
  npm: true,
  github: true,
  githubOptions: {
    assets: [
      { path: "dist/${PROJECT_DIR}/**/*.css", label: "CSS distribution" },
      { path: "dist/${PROJECT_DIR}/**/*.js", label: "JS distribution" },
      {
        path: "dist/${PROJECT_DIR}/**/meta.esm.json",
        label: "JS Meta distribution"
      },
      {
        path: "dist/${PROJECT_DIR}/**/*.cjs",
        label: "CommonJS distribution"
      },
      {
        path: "dist/${PROJECT_DIR}/**/meta.cjs.json",
        label: "CommonJS Meta distribution"
      },
      { path: "dist/${PROJECT_DIR}/**/LICENSE", label: "Package License" },
      { path: "dist/${PROJECT_DIR}/**/README.md", label: "Package ReadMe" },
      {
        path: "dist/${PROJECT_DIR}/**/package.json",
        label: "Package JSON distribution"
      },
      {
        path: "dist/${PROJECT_DIR}/**/*.*",
        label: "Misc. Package distribution"
      }
    ]
  },
  git: true,
  gitAssets: ["${WORKSPACE_DIR}/LICENSE", "${WORKSPACE_DIR}/assets/favicons"],
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
