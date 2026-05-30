{
  pkgs,
  ...
}:
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

  delta.enable = true;

  packages = with pkgs; [
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
      nodejs.enable = true;
      lsp.enable = true;
      pnpm = {
        enable = true;
        install.enable = true;
        package = pkgs.pnpm;
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
    release.exec = "pnpm release --base=$1 --head=$2";
    nuke.exec = "pnpm nuke";
  };
}
