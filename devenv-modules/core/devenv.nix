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
      prettier = {
        enable = true;
        description = "Prettier with @storm-software/prettier config";
        settings = {
          color = true;
          write = true;
          cache = true;
          cache-location = "${config.env.DEVENV_ROOT}/node_modules/.cache/prettier/.prettier-cache";
          config-precedence = "prefer-file";
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
        enable = true;
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
