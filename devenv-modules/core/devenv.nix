{
  pkgs,
  inputs,
  config,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  # https://devenv.sh/packages/
  packages = [
    # Source Control
    pkgs.gnupg
    pkgs.git-lfs
    pkgs.git-crypt

    # Linting
    pkgs.zizmor
    pkgs.taplo
    pkgs.typos

    # Tools
    pkgs.capnproto
    pkgs.prek
  ];

  tasks = {
    "storm:enterCore" = {
      exec = ''
        pnpm update --recursive --workspace
        pnpm install
        bootstrap
      '';
      before = [
        "devenv:enterShell"
        "devenv:enterTest"
      ];
      after = [
        "storm:enterBase"
      ];
    };
  };

  # https://devenv.sh/git-hooks/
  git-hooks = {
    enable = true;
    hooks = {
      eslint = {
        enable = true;
        name = "eslint";
        description = "ESLint formatting with Storm Software config";
        entry = "pnpm eslint --fix --color --concurrency 3 --cache --cache-location \"${config.env.DEVENV_ROOT}/node_modules/.cache/storm/eslint-cache\" --config \"${config.env.DEVENV_ROOT}/eslint.config.mjs\" ";
        files = "";
        excludes = [
          ".*\/src\/executors\/.*\/\.schema\\.*"
          ".*\/src\/executors\/.*\/schema\\.d\\.ts"
          ".*\/src\/executors\/.*\/schema\\.json"
          ".*\/src\/executors\/.*\/schema\\.md"
          ".*\/src\/generators\/.*\/.*\\.schema\\.*"
          ".*\/src\/generators\/.*\/files"
          ".*\/src\/generators\/.*\/files\/.*\/.*"
          ".*\/src\/generators\/.*\/schema\\.d\\.ts"
          ".*\/src\/generators\/.*\/schema\\.json"
          ".*\/src\/generators\/.*\/schema\\.md"
          "\\.alexignore"
          "\\.docusaurus"
          "\\.git"
          "\\.hbs"
          "\\.lock"
          "\\.lockb"
          "\\.next"
          "\\.nx/cache"
          "\\.nx/workspace-data"
          "\\.prettierignore"
          "\\.toml"
          "__snapshots__"
          "Cargo\\.toml"
          "catalog-package"
          "CHANGELOG\\.md"
          "CODE_OF_CONDUCT\\.md"
          "CONTRIBUTING\\.md"
          "dist"
          "dotnet"
          "LICENSE"
          "LICENSE\\.md"
          "LICENSE\\.txt"
          "node_modules"
          "npm-lock\\.json"
          "npm-lock\\.yaml"
          "npm-lock\\.yml"
          "package\\.json"
          "pnpm-lock\\.json"
          "pnpm-lock\\.yaml"
          "pnpm-lock\\.yaml"
          "pnpm-lock\\.yml"
          "pnpm-workspace\\.yaml"
          "pnpm-workspace\\.yaml"
          "README\\.md"
          "tools\/docker"
          "typegen\\.d\\.ts"
          "yarn\\.lock\\.json"
          "yarn\\.lock\\.yaml"
          "yarn\\.lock\\.yml"
        ];
        language = "system";
        pass_filenames = true;
      };
      prettier = {
        enable = false;
        description = "Prettier with @storm-software/prettier config";
        settings = {
          color = true;
          write = true;
          cache = true;
          cache-location = "${config.env.DEVENV_ROOT}/node_modules/.cache/prettier/.prettier-cache";
          config-precedence = "file-override";
          configPath = "${config.env.DEVENV_ROOT}/node_modules/@storm-software/prettier/config.json";
          ignore-path = [ "${config.env.DEVENV_ROOT}/node_modules/@storm-software/prettier/.prettierignore" ];
          log-level = "debug";
        };
        excludes = [
          "Cargo.toml"
          "pnpm-workspace.yaml"
          "pnpm-lock.yaml"
          "package.json"
          "CHANGELOG.md"
          "README.md"
        ];
      };
      taplo = {
        enable = true;
        description = "Taplo with @storm-software/linting-tools config";
        args = [
          "--config=${config.env.DEVENV_ROOT}/node_modules/@storm-software/linting-tools/taplo/config.toml"
          "--cache-path=${config.env.DEVENV_ROOT}/node_modules/.cache/taplo"
        ];
        files = "\\.toml$";
        excludes = [ "Cargo\\.toml$" ];
      };
      yamllint = {
        enable = false;
        description = "Yamllint with @storm-software/linting-tools config";
        settings = {
          configPath = "${config.env.DEVENV_ROOT}/node_modules/@storm-software/linting-tools/yamllint/config.yml";
        };
        files = "\\.(yaml|yml)$";
        excludes = [
          "pnpm-lock.yaml"
          "pnpm-workspace.yaml"
          ".pre-commit-config.yaml"
        ];
      };
      zizmor = {
        enable = true;
        description = "Zizmor with @storm-software/linting-tools config";
        args = [
          "--offline"
          "--config=${config.env.DEVENV_ROOT}/tools/config/zizmor.yml"
        ];
        files = "^\\.github/workflows/.*\\.(yml|yaml)$";
      };
    };
  };
}
