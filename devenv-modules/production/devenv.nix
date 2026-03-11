{
  pkgs,
  inputs,
  config,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  env.ENVIRONMENT = "production";
  env.NODE_ENV = "production";
  env.DEBUG = false;
  env.CI = true;
  env.DEVENV_TUI = false;

  packages = [
    # Source Control
    pkgs.gnupg
    pkgs.git-lfs
    pkgs.git-crypt

    # Tools
    pkgs.capnproto
  ];

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
        "devenv:git-hooks:install"
      ];
    };
  };
}
