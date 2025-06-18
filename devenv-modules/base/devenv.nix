{ pkgs, inputs, ... }:

let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in {
  name = "storm-software/base";

  dotenv.enable = true;
  dotenv.filename = [".env" ".env.local"];
  dotenv.disableHint = true;

  # https://devenv.sh/basics/
  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

  # https://devenv.sh/packages/
  packages = [
  # Shell
    pkgs.zsh
    pkgs.zsh-autosuggestions
    pkgs.zsh-completions
    pkgs.zsh-syntax-highlighting

    # Source Control
    pkgs.gnupg
    pkgs.git
    pkgs.git-lfs
    pkgs.git-crypt
    pkgs.gh

    # Linting
    pkgs.zizmor
    pkgs.taplo
    pkgs.typos

    # Tools
    pkgs.capnproto
  ];

  # https://devenv.sh/languages/
  languages.nix.enable = true;
  languages.javascript = {
    enable = true;
    package = pkgs-unstable.nodejs;
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
    lint.exec = "pnpm lint";
    format.exec = "pnpm format";
    release.exec = "pnpm release --base=$1 --head=$2";
    nuke.exec = "pnpm nuke";
  };

  enterShell = ''
    git config commit.gpgsign true
    git config tag.gpgSign true
    git config lfs.allowincompletepush true
    git config init.defaultBranch main

    pnpm update --recursive --workspace
    pnpm install
    bootstrap
  '';

  # https://devenv.sh/git-hooks/
  git-hooks.hooks = {
    shellcheck.enable = true;
  };

  # See full reference at https://devenv.sh/reference/options/
}
