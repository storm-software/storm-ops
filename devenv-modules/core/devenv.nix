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
        settings = {
          color = true;
          write = true;
          cache = true;
          cache-location = "${config.env.DEVENV_ROOT}/node_modules/.cache/prettier/.prettier-cache";
          configPath = "${config.env.DEVENV_ROOT}node_modules/@storm-software/prettier/config.json";
          ignore-path = "${config.env.DEVENV_ROOT}node_modules/@storm-software/prettier/.prettierignore";
        };
      };
      taplo = {
        enable = true;
        args = [
          "--config=node_modules/@storm-software/linting-tools/taplo/config.toml"
          "--cache-path=node_modules/.cache/taplo"
        ];
        files = "\\.toml$";
      };
      yamllint = {
        enable = true;
        settings = {
          configPath = "--config=node_modules/@storm-software/linting-tools/yamllint/config.yml";
        };
        files = "\\.(yaml|yml)$";
      };
      zizmor = {
        enable = true;
        args = [
          "--offline"
          "--config=tools/config/zizmor.yml"
        ];
        files = "^\\.github/workflows/.*\\.(yml|yaml)$";
      };
    };
  };
}
