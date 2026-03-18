{
  lib,
  pkgs,
  inputs,
  config,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  profiles = {
    development.module = {
      env.ENVIRONMENT = "development";
      env.NODE_ENV = "development";
      env.DEBUG = true;
      env.CI = false;
      tasks = {
        "storm:setup:git" = {
          exec = ''
            git config commit.gpgsign true
            git config tag.gpgSign true
            git config lfs.allowincompletepush true
            git config init.defaultBranch main

            npm config set provenance true
          '';
          before = [
            # "storm:setup:updates"
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "storm:setup:install" = {
          exec = ''
            pnpm exec storm-git pre-install
            pnpm install --no-frozen-lockfile
            update-storm
            bootstrap

            pnpm exec storm-git prepare
          '';
          before = [
            # "storm:setup:updates"
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "storm:setup:git"
          ];
        };
        # "storm:setup:updates" = {
        #   exec = ''
        #     pnpm update --recursive --workspace
        #     update-storm
        #   '';
        #   before = [
        #     "devenv:enterShell"
        #     "devenv:enterTest"
        #   ];
        #   after = [
        #     "storm:setup:git"
        #     "devenv:files"
        #     "devenv:files:cleanup"
        #   ];
        #   execIfModified = [
        #     "pnpm-workspace.yaml"

        #   ];
        # };
      };
    };

    production.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
      env.CI = true;
      env.DEVENV_TUI = false;
      tasks = {
        "storm:setup:git" = {
          exec = ''
            git config commit.gpgsign true
            git config tag.gpgSign true
            git config lfs.allowincompletepush true
            git config init.defaultBranch main

            npm config set provenance true
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
            "storm:setup:install"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "storm:setup:install" = {
          exec = ''
            pnpm install --frozen-lockfile
            bootstrap
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "storm:setup:git"
          ];
        };
      };
    };
  };

  env.FORCE_COLOR = 3;
  env.CLICOLOR = 1;

  packages = with pkgs; [
    # Source Control
    gnupg
    git-lfs
    git-crypt

    # Linting
    zizmor
    taplo
    typos
    treefmt
    rustfmt
    nixpkgs-fmt
    yamllint
    ls-lint

    # Tools
    capnproto
  ];
}
