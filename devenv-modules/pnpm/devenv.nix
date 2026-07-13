{ pkgs, inputs, ... }:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  dotenv = {
    enable = true;
    filename = [
      ".env"
      ".env.local"
    ];
    disableHint = true;
  };

  env = {
    DEFAULT_LOCALE = "en_US";
    DEFAULT_TIMEZONE = "America/New_York";
    FORCE_COLOR = 3;
    CLICOLOR = 1;
  };

  packages = with pkgs; [
    gnupg
    git-crypt
    zizmor
    taplo
    typos
    rustfmt
    nixfmt
    nixpkgs-fmt
    yamllint
    ls-lint
  ];

  languages = {
    javascript = {
      enable = true;
      package = pkgs-unstable.nodejs-slim_latest;
      nodejs.enable = true;
      lsp.enable = true;
      pnpm = {
        enable = true;
        install.enable = true;
        package = pkgs-unstable.pnpm;
      };
    };
    typescript = {
      enable = true;
    };
  };

  scripts = {
    bootstrap.exec = "pnpm bootstrap";
    update-storm.exec = "pnpm update-storm";
    build.exec = "pnpm build";
    build-dev.exec = "pnpm build-dev";
    clean.exec = "pnpm clean";
    lint.exec = "pnpm lint";
    format.exec = "pnpm format";
    test.exec = "pnpm test";
    test-ci.exec = "pnpm test-ci";
    docs.exec = "pnpm docs";
    release.exec = "pnpm release --base=$1 --head=$2";
    nuke.exec = "pnpm nuke";
  };

  profiles = {
    development.module = {
      env.ENVIRONMENT = "development";
      env.NODE_ENV = "development";
      env.DEBUG = true;

      languages = {
        nix = {
          enable = true;
        };
      };

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

    production.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
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
}
