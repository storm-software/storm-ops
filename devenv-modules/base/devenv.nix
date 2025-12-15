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

  # https://devenv.sh/basics/
  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

  # https://devenv.sh/packages/
  packages = [
    # Tools
    pkgs.nixd
  ];

  # https://devenv.sh/languages/
  languages.nix = {
    enable = true;
    lsp.package = pkgs.nixd;
  };
  languages.javascript = {
    enable = true;
    package = pkgs-unstable.nodejs_24;
    corepack.enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
      package = pkgs-unstable.nodePackages.pnpm;
    };
  };
  languages.typescript.enable = true;

  # https://devenv.sh/scripts/
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
    "storm:enterBase" = {
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
    };
  };

  # https://devenv.sh/git-hooks/
  git-hooks = {
    enable = true;
    gitPackage = pkgs.git;
    hooks = {
      shellcheck.enable = true;
      detect-private-keys.enable = true;
      nixfmt.enable = true;
      terraform-format.enable = true;
    };
  };
}
