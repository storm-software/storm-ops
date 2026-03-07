{
  pkgs,
  inputs,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  delta.enable = true;

  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";
  env.FORCE_COLOR = true;

  packages = with pkgs; [
    # Tools
    nixd
    prek
  ];

  languages.nix = {
    enable = true;
    lsp.package = pkgs.nixd;
  };
  languages.javascript = {
    enable = true;
    package = pkgs-unstable.nodejs_25;
    pnpm = {
      enable = true;
      install.enable = true;
      package = pkgs-unstable.nodePackages.pnpm;
    };
  };
  languages.typescript.enable = true;

  scripts = {
    bootstrap.exec = "pnpm bootstrap";
    update-storm.exec = "pnpm update-storm";
    build.exec = "pnpm build";
    build-dev.exec = "pnpm build-dev";
    clean.exec = "pnpm clean";
    lint.exec = "pnpm lint";
    format.exec = "pnpm format";
    release.exec = "pnpm release --base=$1 --head=$2";
    nuke.exec = "pnpm nuke";
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
        "storm:setup:install"
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
        pnpm install
        bootstrap
      '';
      before = [
        "storm:setup:updates"
        "devenv:enterShell"
        "devenv:enterTest"
      ];
      after = [
        "devenv:files"
        "devenv:files:cleanup"
        "devenv:git-hooks:install"
        "storm:setup:git"
      ];
    };
    "storm:setup:updates" = {
      exec = ''
        pnpm update --recursive --workspace
        update-storm
      '';
      before = [
        "devenv:enterShell"
        "devenv:enterTest"
      ];
      after = [
        "storm:setup:install"
        "devenv:files"
        "devenv:files:cleanup"
        "devenv:git-hooks:install"
        "storm:setup:git"
      ];
    };
  };

  git-hooks = {
    enable = true;
    gitPackage = pkgs.gitFull;
    hooks = {
      shellcheck.enable = true;
      detect-private-keys.enable = true;
      nixfmt.enable = true;
      terraform-format.enable = false;
    };
  };

  profiles = {
    development.module = {
      env.ENVIRONMENT = "development";
      env.NODE_ENV = "development";
      env.DEBUG = true;
      env.CI = false;
      env.FORCE_COLOR = true;
    };

    release.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
      env.CI = true;
    };
  };
}
