import * as path from "node:path";
import {
  type Tree,
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  updateJson
} from "@nx/devkit";
import { withRunGenerator } from "../../base/base-generator";
import {
  nodeVersion,
  pnpmVersion,
  typescriptVersion
} from "../../utils/versions";
import type { PresetGeneratorSchema } from "./schema";

export async function presetGeneratorFn(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  const projectRoot = ".";

  options.description ??= `⚡The ${
    options.namespace ? options.namespace : options.name
  } monorepo contains utility applications, tools, and various libraries to create modern and scalable web applications.`;
  options.namespace ??= options.organization;

  addProjectConfiguration(tree, `@${options.namespace}/${options.name}`, {
    root: projectRoot,
    projectType: "application",
    targets: {
      "local-registry": {
        executor: "@nx/js:verdaccio",
        options: {
          port: 4873,
          config: ".verdaccio/config.yml",
          storage: "tmp/local-registry/storage"
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

    json.homepage ??= "https://stormsoftware.com";
    json.bugs ??= {
      url: "https://stormsoftware.com/support",
      email: "support@stormsoftware.com"
    };

    json.license = "Apache License 2.0";
    json.author ??= {
      name: "Storm Software",
      email: "contact@stormsoftware.com",
      url: "https://stormsoftware.com"
    };

    json.funding ??= {
      type: "github",
      url: "https://github.com/sponsors/storm-software"
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
    json.scripts.prepare = "pnpm add lefthook -w && pnpm lefthook install";
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
    json.scripts["local-registry"] =
      `nx local-registry @${options.namespace}/${options.name}`;

    json.scripts.e2e = "nx e2e";

    if (options.includeApps) {
      json.scripts.test = "nx test && pnpm test:storybook";
      json.scripts["test:storybook"] = "pnpm test-storybook";
    } else {
      json.scripts.test = "nx test";
    }

    json.scripts.lint = "pnpm storm-lint all --skip-cspell";
    json.scripts.commit = "pnpm storm-git commit";
    json.scripts["readme-gen"] =
      'pnpm storm-git readme-gen --templates="docs/readme-templates"';
    json.scripts["api-extractor"] =
      'pnpm storm-docs api-extractor --outputPath="docs/api-reference" --clean';
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
        buildOutputDirectory: "dist/apps/web/app/.next"
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
    "@biomejs/biome": "1.6.4",
    "@commitlint/cli": "19.2.1",
    "@ls-lint/ls-lint": "2.2.3",
    "@ltd/j-toml": "1.38.0",
    "@nx/devkit": "18.2.3",
    "@nx/esbuild": "18.2.3",
    "@nx/eslint": "18.2.3",
    "@nx/eslint-plugin": "18.2.3",
    "@nx/js": "18.2.3",
    "@nx/plugin": "18.2.3",
    "@nx/workspace": "18.2.3",
    "@storm-software/config": "latest",
    "@storm-software/config-tools": "latest",
    "@storm-software/git-tools": "latest",
    "@storm-software/linting-tools": "latest",
    "@storm-software/testing-tools": "latest",
    "@storm-software/workspace-tools": "latest",
    "@swc-node/register": "1.9.0",
    "@swc/cli": "0.3.12",
    "@swc/core": "1.4.12",
    "@swc/helpers": "0.5.8",
    "@swc/wasm": "1.4.12",
    "@taplo/cli": "0.7.0",
    "@types/jest": "29.5.12",
    "@types/node": "20.12.5",
    "@typescript-eslint/eslint-plugin": "7.6.0",
    "@typescript-eslint/parser": "7.6.0",
    "conventional-changelog-conventionalcommits": "7.0.2",
    "esbuild": "0.20.2",
    "esbuild-register": "3.5.0",
    "eslint": "9.0.0",
    "eslint-config-prettier": "9.1.0",
    "jest": "29.7.0",
    "jest-environment-jsdom": "29.7.0",
    "jest-environment-node": "29.7.0",
    "lefthook": "1.6.8",
    "nx": "18.2.3",
    "prettier": "3.2.5",
    "prettier-plugin-prisma": "5.0.0",
    "prettier-plugin-tailwindcss": "0.5.13",
    "rimraf": "5.0.5",
    "ts-jest": "29.1.2",
    "ts-loader": "9.5.1",
    "ts-node": "10.9.2",
    "tsconfig-paths": "4.2.0",
    "tslib": "2.6.2",
    "typescript": typescriptVersion,
    "verdaccio": "5.30.3"
  };

  if (options.includeApps) {
    dependencies = {
      ...dependencies,
      bundlewatch: "latest",
      react: "latest",
      "react-dom": "latest",
      storybook: "latest",
      "@storybook/addons": "latest",
      "@nx/react": "latest",
      "@nx/next": "latest",
      "@nx/node": "latest",
      "@nx/storybook": "latest"
    };
  }

  if (options.includeRust) {
    dependencies = {
      ...dependencies,
      "@monodon/rust": "1.4.0"
    };
  }

  if (options.nxCloud) {
    dependencies = {
      ...dependencies,
      "nx-cloud": "latest"
    };
  }

  await Promise.resolve(
    addDependenciesToPackageJson(
      tree,
      dependencies,
      {},
      joinPathFragments(projectRoot, "package.json")
    )
  );

  return null;
}

export default withRunGenerator<PresetGeneratorSchema>(
  "Storm Workspace Preset Generator",
  presetGeneratorFn
);
