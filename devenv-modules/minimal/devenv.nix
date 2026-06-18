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

  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

  packages = with pkgs; [
    gnupg
    git-lfs
    git-crypt
    nixd
  ];

  languages = {
    nix = {
      enable = true;
      lsp.package = pkgs.nixd;
    };
    javascript = {
      enable = true;
      package = pkgs.nodejs-slim_latest;
      pnpm = {
        enable = true;
        install.enable = true;
        package = pkgs.pnpm;
      };
    };
  };

  tasks = {
    "storm:init" = {
      exec = ''
        git config commit.gpgsign true
        git config tag.gpgSign true
        git config lfs.allowincompletepush true
        git config init.defaultBranch main

        pnpm install
      '';
      before = [
        "devenv:enterShell"
        "devenv:enterTest"
      ];
    };
  };
}
