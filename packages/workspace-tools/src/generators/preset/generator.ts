import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson
} from "@nx/devkit";
import * as path from "path";
import {
  nodeVersion,
  pnpmVersion,
  typescriptVersion
} from "../../utils/versions";
import { PresetGeneratorSchema } from "./schema";

export default async function (tree: Tree, options: PresetGeneratorSchema) {
  const projectRoot = `.`;

  options.description ??= `⚡The ${
    options.namespace ? options.namespace : options.name
  } monorepo contains utility applications, tools, and various libraries to create modern and scalable web applications.`;
  options.namespace ??= options.organization;

  addProjectConfiguration(tree, `@${options.namespace}/${options.name}`, {
    root: projectRoot,
    projectType: "application",
    targets: {
      "local-registry": {
        "executor": "@nx/js:verdaccio",
        "options": {
          "port": 4873,
          "config": ".verdaccio/config.yml",
          "storage": "tmp/local-registry/storage"
        }
      }
    }
  });

  updateJson(tree, "package.json", json => {
    json.scripts = json.scripts || {};

    json.version = "0.0.0";
    json.triggerEmptyDevReleaseByIncrementingThisNumber = 0;
    json.private = true;
    json.keywords ??= [
      options.name,
      options.namespace,
      "storm",
      "stormstack",
      "storm-ops",
      "acidic",
      "acidic-lang",
      "acidic-model",
      "impact",
      "nextjs",
      "prisma",
      "zenstack",
      "hasura",
      "strapi",
      "graphql",
      "sullivanpj",
      "monorepo"
    ];

    json.homepage ??= "https://stormsoftware.org";
    json.bugs ??= {
      url: "https://stormsoftware.org/support",
      email: "support@stormsoftware.org"
    };

    json.license ??= "Apache License 2.0";
    json.author ??= {
      name: "Storm Software",
      email: "contact@stormsoftware.org",
      url: "https://stormsoftware.org"
    };

    json.namespace ??= `@${options.namespace}`;
    json.description ??= options.description;

    options.repositoryUrl ??= `https://github.com/${options.organization}/${options.name}}`;
    json.repository ??= {
      type: "github",
      url: `${options.repositoryUrl}.git`
    };

    // generate a start script into the package.json

    json.scripts.adr = "pnpm log4brains adr new";
    json.scripts["adr-preview"] = "pnpm log4brains preview";
    json.scripts.prepare = "pnpm add husky -w";
    json.scripts.preinstall = "npx -y only-allow pnpm";
    json.scripts["install:csb"] =
      "corepack enable && pnpm install --frozen-lockfile";

    json.scripts.clean = "rimraf dist";
    json.scripts.prebuild = "pnpm clean";
    json.scripts["clean:tools"] = "rimraf dist/tools";
    json.scripts["clean:docs"] = "rimraf dist/docs";

    if (!options.includeApps) {
      json.scripts["clean:packages"] = "rimraf dist/packages";
    } else {
      json.scripts["clean:apps"] = "rimraf dist/apps";
      json.scripts["clean:libs"] = "rimraf dist/libs";
      json.scripts["clean:storybook"] = "rimraf dist/storybook";
    }

    json.scripts.build = "nx affected -t build --parallel=5";
    json.scripts["build:all"] = "nx run-many -t build --all --parallel=5";
    json.scripts["build:production"] =
      "nx run-many -t build --all --prod --parallel=5";
    json.scripts["build:tools"] =
      "nx run-many -t build --projects=tools/* --parallel=5";
    json.scripts["build:docs"] =
      "nx run-many -t build --projects=docs/* --parallel=5";

    if (!options.includeApps) {
      json.scripts["build:packages"] =
        "nx run-many -t build --projects=packages/* --parallel=5";
    } else {
      json.scripts["build:apps"] =
        "nx run-many -t build --projects=apps/* --parallel=5";
      json.scripts["build:libs"] =
        "nx run-many -t build --projects=libs/* --parallel=5";
      json.scripts["build:storybook"] = "storybook build -s public";
    }

    json.scripts.nx = "nx";
    json.scripts.graph = "nx graph";
    json.scripts.lint = "pnpm storm-lint all";

    if (options.includeApps) {
      json.scripts.start = "nx serve";
      json.scripts.storybook = "pnpm storybook dev -p 6006";
    }

    json.scripts.format = "nx format:write";
    json.scripts.help = "nx help";
    json.scripts["dep-graph"] = "nx dep-graph";
    json.scripts[
      "local-registry"
    ] = `nx local-registry @${options.namespace}/${options.name}`;

    json.scripts.e2e = "nx e2e";

    if (options.includeApps) {
      json.scripts.test = "nx test";
    } else {
      json.scripts.test = "nx test && pnpm test:storybook";
      json.scripts["test:storybook"] = "pnpm test-storybook";
    }

    json.scripts.lint = "pnpm storm-lint all --skip-cspell";
    json.scripts.commit = "pnpm storm-git commit";
    json.scripts.readme =
      'pnpm storm-git readme --templates="docs/readme-templates"';
    json.scripts["api-extractor"] =
      "nx g @storm-software/workspace-tools:api-extractor --outputPath 'docs/api-reference' --clean --no-interactive";
    json.scripts.release = "pnpm storm-git release";

    json.packageManager ??= `pnpm@${pnpmVersion}`;
    json.engines = {
      node: `>=${nodeVersion}`,
      pnpm: `>=${pnpmVersion}`
    };

    json.prettier = "@storm-software/linting-tools/prettier/config.json";

    if (options.includeApps) {
      json.bundlewatch = {
        files: [
          {
            path: "dist/*/*.js",
            maxSize: "200kB"
          }
        ],
        ci: {
          trackBranches: ["main", "alpha", "beta"]
        }
      };

      json.nextBundleAnalysis = {
        "buildOutputDirectory": "dist/apps/web/app/.next"
      };
    }

    json.nx = {
      includedScripts: ["lint", "format"]
    };

    return json;
  });

  generateFiles(tree, path.join(__dirname, "files"), projectRoot, {
    ...options,
    pnpmVersion,
    nodeVersion
  });
  await formatFiles(tree);

  let dependencies: Record<string, string> = {
    "nx": "latest",
    "@nx/js": "latest",
    "@nx/workspace": "latest",
    "@nx/devkit": "latest",
    "@nx/eslint": "latest",
    "@nx/eslint-plugin": "latest",
    "@nx/jest": "latest",
    "@storm-software/git-tools": "latest",
    "@storm-software/linting-tools": "latest",
    "@storm-software/testing-tools": "latest",
    "@storm-software/workspace-tools": "latest",
    "prettier-plugin-packagejson": "latest",
    "prettier-plugin-prisma": "latest",
    "tsup": "latest",
    "eslint": "latest",
    "@eslint/eslintrc": "latest",
    "log4brains": "latest",
    "husky": "latest",
    "prettier": "latest",
    "lint-staged": "latest",
    "semantic-release": "latest",
    "@semantic-release/changelog": "latest",
    "@semantic-release/commit-analyzer": "latest",
    "@semantic-release/exec": "latest",
    "@semantic-release/git": "latest",
    "@semantic-release/github": "latest",
    "@semantic-release/npm": "latest",
    "@semantic-release/release-notes-generator": "latest",
    "jest": "latest",
    "jest-environment-jsdom": "latest",
    "jest-environment-node": "latest",
    "ts-jest": "latest",
    "ts-node": "latest",
    "tslib": "latest",
    "typescript": typescriptVersion,
    "@swc-node/register": "latest",
    "@swc/cli": "latest",
    "@swc/core": "latest",
    "@swc/helpers": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/jest": "latest",
    "@types/node": "20.8.10",
    "verdaccio": "latest"
  };
  if (options.includeApps) {
    dependencies = {
      ...dependencies,
      "bundlewatch": "latest",
      "react": "latest",
      "react-dom": "latest",
      "storybook": "latest",
      "@storybook/addons": "latest",
      "@nx/react": "latest",
      "@nx/next": "latest",
      "@nx/node": "latest",
      "@nx/storybook": "latest"
    };
  }

  if (options.nxCloud) {
    dependencies = {
      ...dependencies,
      "nx-cloud": "latest"
    };
  }

  return addDependenciesToPackageJson(tree, dependencies, {});
}
