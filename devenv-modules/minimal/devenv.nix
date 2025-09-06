{ pkgs, inputs, ... }:

let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in {
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
    pkgs.typos

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
    package = pkgs-unstable.nodejs;
    corepack.enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
      package = pkgs-unstable.nodePackages.pnpm;
    };
  };

  enterShell = ''
    git config commit.gpgsign true
    git config tag.gpgSign true
    git config lfs.allowincompletepush true
    git config init.defaultBranch main

    pnpm install
  '';

  # https://devenv.sh/git-hooks/
  git-hooks.hooks = {
    shellcheck.enable = false;
  };

  # See full reference at https://devenv.sh/reference/options/
}
