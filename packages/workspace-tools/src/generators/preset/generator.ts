import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  updateJson,
  type Tree
} from "@nx/devkit";
import * as path from "node:path";
import { withRunGenerator } from "../../base/base-generator";
import { nodeVersion, pnpmVersion } from "../../utils/versions";
import type { PresetGeneratorSchema } from "./schema.d";

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
      "storm-stack",
      "storm-ops",
      "acidic",
      "acidic-engine",
      "cyclone-ui",
      "rust",
      "nx",
      "graphql",
      "sullivanpj",
      "monorepo"
    ];

    json.homepage ??= "https://stormsoftware.com";
    json.bugs ??= {
      url: `https://github.com/${options.organization}/${options.name}/issues`,
      email: "support@stormsoftware.com"
    };

    json.license = "Apache-2.0";
    json.author ??= {
      name: "Storm Software",
      email: "contact@stormsoftware.com",
      url: "https://stormsoftware.com"
    };
    json.maintainers ??= [
      {
        "name": "Storm Software",
        "email": "contact@stormsoftware.com",
        "url": "https://stormsoftware.com"
      },
      {
        "name": "Pat Sullivan",
        "email": "admin@stormsoftware.com",
        "url": "https://patsullivan.org"
      }
    ];
    json.funding ??= {
      type: "github",
      url: "https://github.com/sponsors/storm-software"
    };

    json.namespace ??= `@${options.namespace}`;
    json.description ??= options.description;
    options.repositoryUrl ??= `https://github.com/${options.organization}/${options.name}`;
    json.repository ??= {
      type: "github",
      url: `${options.repositoryUrl}.git`
    };

    json.packageManager ??= "pnpm@9.15.2";
    json.engines ??= {
      "node": ">=20.11.0",
      "pnpm": ">=9.15.2"
    };

    json.prettier = "@storm-software/prettier/config.json";

    json.nx ??= {
      "includedScripts": [
        "lint-sherif",
        "lint-knip",
        "lint-ls",
        "lint",
        "format",
        "format-sherif",
        "format-readme",
        "format-prettier",
        "format-toml",
        "commit",
        "release"
      ]
    };

    // generate a start script into the package.json

    json.scripts.adr = "pnpm log4brains adr new";
    json.scripts["adr-preview"] = "pnpm log4brains preview";
    json.scripts.prepare = "pnpm add lefthook -w && pnpm lefthook install";
    json.scripts.preinstall = "npx -y only-allow pnpm";
    json.scripts["install-csb"] =
      "corepack enable && pnpm install --no-frozen-lockfile";

    json.scripts.clean =
      "rimraf dist && rimraf --glob packages/**/dist && rimraf --glob tools/**/dist && rimraf --glob docs/**/dist && rimraf --glob apps/**/dist && rimraf --glob libs/**/dist";
    json.scripts.nuke =
      "nx clear-cache && rimraf .nx/cache && rimraf .nx/workspace-data && pnpm clean && rimraf pnpm-lock.yaml && rimraf --glob packages/**/node_modules && rimraf --glob tools/**/node_modules && rimraf node_modules";
    json.scripts.prebuild = "pnpm clean";

    json.scripts.build = "nx affected -t build --parallel=5";
    json.scripts["build-all"] = "nx run-many -t build --all --parallel=5";
    json.scripts["build-prod"] =
      "nx run-many -t build --all --prod --parallel=5";
    json.scripts["build-tools"] =
      "nx run-many -t build --projects=tools/* --parallel=5";
    json.scripts["build-docs"] =
      "nx run-many -t build --projects=docs/* --parallel=5";

    if (!options.includeApps) {
      json.scripts["build-packages"] =
        "nx run-many -t build --projects=packages/* --parallel=5";
    } else {
      json.scripts["build-apps"] =
        "nx run-many -t build --projects=apps/* --parallel=5";
      json.scripts["build-libs"] =
        "nx run-many -t build --projects=libs/* --parallel=5";
      json.scripts["build-storybook"] = "storybook build -s public";
    }

    json.scripts.nx = "nx";
    json.scripts.graph = "nx graph";
    json.scripts.lint = "pnpm storm-lint all --skip-cspell --skip-alex";

    if (options.includeApps) {
      json.scripts.start = "nx serve";
      json.scripts.storybook = "pnpm storybook dev -p 6006";
    }

    json.scripts.help = "nx help";
    json.scripts["dep-graph"] = "nx dep-graph";
    json.scripts["local-registry"] =
      `nx local-registry @${options.namespace}/${options.name}`;

    json.scripts.e2e = "nx e2e";

    if (options.includeApps) {
      json.scripts.test = "nx test && pnpm test-storybook";
      json.scripts["test-storybook"] = "pnpm test-storybook";
    } else {
      json.scripts.test = "nx test";
    }

    json.scripts.lint = "pnpm storm-lint all --skip-cspell --skip-alex";
    json.scripts.commit = "pnpm storm-git commit";
    json.scripts["api-extractor"] =
      'pnpm storm-docs api-extractor --outputPath="docs/api-reference" --clean';
    json.scripts.release = "pnpm storm-git release";

    json.scripts.format = "nx format:write";
    json.scripts["format-sherif"] =
      "pnpm exec sherif -f -i typescript -i react -i react-dom";
    json.scripts["format-toml"] =
      'pnpm exec taplo format --config="./node_modules/@storm-software/linting-tools/taplo/config.toml" --cache-path="./node_modules/.cache/storm/taplo"';
    json.scripts["format-readme"] =
      'pnpm storm-git readme --templates="tools/readme-templates"';
    json.scripts["format-prettier"] =
      "pnpm exec prettier --write --ignore-unknown --no-error-on-unmatched-pattern --cache && git update-index";

    json.scripts.lint = "pnpm storm-lint all --skip-cspell";
    json.scripts["lint-knip"] = "pnpm exec knip";
    json.scripts["lint-sherif"] =
      "pnpm exec sherif -i typescript -i react -i react-dom";
    json.scripts["lint-ls"] =
      'pnpm exec ls-lint --config="./node_modules/@storm-software/linting-tools/ls-lint/ls-lint.yml"';

    json.packageManager ??= `pnpm@${pnpmVersion}`;
    json.engines = {
      node: `>=${nodeVersion}`,
      pnpm: `>=${pnpmVersion}`
    };

    // if (options.includeApps) {
    //   json.bundlewatch = {
    //     files: [
    //       {
    //         path: "dist/*/*.js",
    //         maxSize: "200kB"
    //       }
    //     ],
    //     ci: {
    //       trackBranches: ["main", "alpha", "beta"]
    //     }
    //   };

    //   json.nextBundleAnalysis = {
    //     buildOutputDirectory: "dist/apps/web/app/.next"
    //   };
    // }

    return json;
  });

  generateFiles(tree, path.join(__dirname, "files"), projectRoot, {
    ...options,
    pnpmVersion,
    nodeVersion
  });
  await formatFiles(tree);

  let dependencies: Record<string, string> = {
    "@ls-lint/ls-lint": "2.2.3",
    "@ltd/j-toml": "1.38.0",
    "@nx/devkit": "^20.2.2",
    "@nx/eslint-plugin": "^20.2.2",
    "@nx/js": "^20.2.2",
    "@nx/workspace": "^20.2.2",
    "@storm-software/config": "latest",
    "@storm-software/git-tools": "latest",
    "@storm-software/linting-tools": "latest",
    "@storm-software/testing-tools": "latest",
    "@storm-software/workspace-tools": "latest",
    "@storm-software/eslint": "latest",
    "@storm-software/cspell": "latest",
    "@storm-software/prettier": "latest",
    "@taplo/cli": "0.7.0",
    "@types/node": "^20.14.10",
    "copyfiles": "2.4.1",
    "eslint": "9.5.0",
    "jest": "29.7.0",
    "jest-environment-node": "29.7.0",
    "knip": "5.25.2",
    "lefthook": "1.6.18",
    "nx": "^20.2.2",
    "prettier": "3.3.2",
    "prettier-plugin-prisma": "5.0.0",
    "rimraf": "5.0.7",
    "sherif": "0.10.0",
    "ts-jest": "29.1.5",
    "ts-node": "10.9.2",
    "tslib": "2.6.3",
    "typescript": "5.5.3",
    "verdaccio": "5.31.1"
  };

  if (options.includeApps) {
    dependencies = {
      ...dependencies,
      react: "latest",
      "react-dom": "latest",
      storybook: "latest",
      "@storybook/addons": "latest",
      "@nx/react": "latest",
      "@nx/next": "latest",
      "@nx/node": "latest",
      "@nx/storybook": "latest",
      "jest-environment-jsdom": "29.7.0"
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
