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
  githubOptions: {
    "assets": [
      { "path": "dist/${PROJECT_DIR}/**/*.css", "label": "CSS distribution" },
      {
        "path": "dist/${PROJECT_DIR}/**/{*.ts,*.tsx}",
        "label": "TS distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/{*.js,*.jsx}",
        "label": "JS distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/meta.esm.json",
        "label": "JS Meta distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/*.cjs",
        "label": "CommonJS distribution"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/meta.cjs.json",
        "label": "CommonJS Meta distribution"
      },
      { "path": "dist/${PROJECT_DIR}/**/LICENSE", "label": "Package License" },
      { "path": "dist/${PROJECT_DIR}/**/README.md", "label": "Package ReadMe" },
      {
        "path": "dist/${PROJECT_DIR}/**/CHANGELOG.md",
        "label": "Package Changelog"
      },
      {
        "path": "dist/${PROJECT_DIR}/**/package.json",
        "label": "Package JSON"
      },
      {
        "path":
          "dist/${PROJECT_DIR}/**/!{*.css,*.ts,*.tsx,*.js,*.jsx,meta.esm.json,*.cjs,meta.cjs.json,LICENSE,README.md,CHANGELOG.md,package.json}",
        "label": "Misc. distribution"
      }
    ]
  },
  git: true,
  gitAssets: [
    "${WORKSPACE_DIR}/LICENSE",
    "${PROJECT_DIR}/package.json",
    "${PROJECT_DIR}/README.md",
    "${PROJECT_DIR}/CHANGELOG.md"
  ],
  tagFormat: "${PROJECT_NAME}-v${version}",
  packageJsonDir: "${PROJECT_DIR}",
  repositoryUrl: process.env.STORM_REPO_URL,
  branches: [
    "main",
    "next",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true }
  ]
};
