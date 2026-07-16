{ pkgs, ... }:
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
      package = pkgs.nodejs-slim_latest;
      nodejs.enable = true;
      lsp.enable = true;
      bun = {
        enable = true;
        install.enable = true;
        package = pkgs.bun;
      };
    };
    typescript = {
      enable = true;
    };
  };

  scripts = {
    bootstrap.exec = "bun bootstrap";
    update-storm.exec = "bun update-storm";
    build.exec = "bun build";
    build-dev.exec = "bun build-dev";
    clean.exec = "bun clean";
    lint.exec = "bun lint";
    format.exec = "bun format";
    test.exec = "bun test";
    test-ci.exec = "bun test-ci";
    docs.exec = "bun docs";
    release.exec = "bun release --base=$1 --head=$2";
    nuke.exec = "bun nuke";
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
        "bun:setup:git" = {
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
        "bun:setup:install" = {
          exec = ''
            bun install --no-frozen-lockfile
            update-storm
            bootstrap

            bunx storm-git prepare
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "bun:setup:git"
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
        "bun:setup:git" = {
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
            "bun:setup:install"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "bun:setup:install" = {
          exec = ''
            bun install --frozen-lockfile
            bootstrap
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "bun:setup:git"
          ];
        };
      };
    };
  };
}
