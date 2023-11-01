import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson
} from "@nx/devkit";
import * as path from "path";
import { PresetGeneratorSchema } from "./schema";

export default async function (tree: Tree, options: PresetGeneratorSchema) {
  const projectRoot = `.`;

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "application",
    targets: {}
  });

  updateJson(tree, "package.json", json => {
    json.scripts = json.scripts || {};

    json.version = "0.0.0";
    json.private = true;
    json.keywords ??= [
      "storm",
      "stormstack",
      "storm-stack",
      "forecast",
      "forecast-lang",
      "forecast-model",
      "impact",
      "nextjs",
      "prisma",
      "zenstack",
      "hasura",
      "strapi",
      "graphql",
      "sullivanpj",
      "open-system",
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

    // generate a start script into the package.json

    json.scripts.adr = "pnpm log4brains adr new";
    json.scripts["adr-preview"] = "pnpm log4brains preview";
    json.scripts.prepare = "pnpm prepare:husky && npx patch-package -y";
    json.scripts["prepare:husky"] = "is-ci || husky install";
    json.scripts.preinstall =
      "pnpm @storm-software/workspace-tools/scripts/pre-install.js || npx -y only-allow pnpm";
    json.scripts["install:csb"] =
      "corepack enable && pnpm install --frozen-lockfile";

    json.scripts.clean = "rimraf dist";
    json.scripts.prebuild = "pnpm clean";
    json.scripts.build = "nx affected -t build --parallel=5";
    json.scripts["build:all"] = "nx run-many -t build --all --parallel=5";
    json.scripts["build:production"] =
      "nx run-many -t build --all --prod --parallel=5";

    json.scripts.nx = "nx";
    json.scripts.graph = "nx graph";
    json.scripts.lint = "pnpm storm-lint all";
    json.scripts.start = "nx serve";
    json.scripts.test = "nx test";
    json.scripts.e2e = "nx e2e";
    json.scripts.format = "nx format:write && pnpm doctoc --github README.md";
    json.scripts.help = "nx help";
    json.scripts["dep-graph"] = "nx dep-graph";
    json.scripts["local-registry"] =
      "nx local-registry @storm-software/storm-ops";

    json.scripts["pre-push"] =
      "lint-staged --concurrent false --config @storm-software/linting-tools/lint-staged/config";
    json.scripts.commit = "pnpm storm-git commit";
    json.scripts["api-extractor"] =
      "nx g @storm-software/workspace-tools:api-extractor --outputPath 'docs/api-reference' --clean --no-interactive";
    json.scripts.release = "pnpm storm-git release";

    json.packageManager ??= "pnpm@8.7.4";
    json.engines = {
      node: ">=18.17.0",
      pnpm: ">=8.7.4"
    };

    json.prettier = "@storm-software/linting-tools/prettier/config";
    json.resolutions = {
      graphql: "^16.8.0",
      minimist: "^1.2.6"
    };

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

    json.nx = {
      includedScripts: ["lint", "format"]
    };

    return json;
  });

  generateFiles(tree, path.join(__dirname, "files"), projectRoot, options);
  await formatFiles(tree);

  return addDependenciesToPackageJson(
    tree,
    {
      react: "latest",
      nx: "latest",
      "react-dom": "latest",
      "react-scripts": "latest"
    },
    {
      "@storm-software/git-tools": "latest",
      "@storm-software/linting-tools": "latest",
      "@storm-software/workspace-tools": "latest",
      "prettier-plugin-packagejson": "latest",
      "prettier-plugin-prisma": "latest",
      "patch-package": "latest",
      tsup: "latest",
      eslint: "latest",
      "eslint-config-next": "latest",
      "eslint-config-prettier": "latest",
      "eslint-plugin-cypress": "latest",
      "eslint-plugin-import": "latest",
      "eslint-plugin-jest": "latest",
      "eslint-plugin-jsx-a11y": "latest",
      "eslint-plugin-react": "latest",
      "eslint-plugin-react-hooks": "latest",
      "eslint-plugin-storybook": "latest",
      "nx-cloud": "latest",
      log4brains: "latest",
      husky: "latest",
      prettier: "latest",
      "is-ci": "latest",
      "lint-staged": "latest",
      jest: "29.5.0",
      "jest-cli": "^29.5.0",
      "jest-environment-jsdom": "29.5.0",
      "jest-environment-node": "^29.4.1",
      jsdom: "~22.1.0",
      "@types/react": "latest",
      "@types/react-dom": "latest"
    }
  );
}
