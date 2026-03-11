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
  env.FORCE_COLOR = 3;
  env.CLICOLOR = 1;

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
    };

    release.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
      env.CI = true;
      env.DEVENV_TUI = false;
    };
  };
}
