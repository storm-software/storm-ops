{ pkgs, config, ... }:
{
  name = "storm-software/storm-ops";

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
  packages = with pkgs; [
    cargo-deny
    openssl
  ];

  # https://devenv.sh/languages/
  languages.rust = {
    enable = true;
    toolchainFile = ./rust-toolchain.toml;
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
        "storm:setup:updates"
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
        "storm:setup:git"
        "devenv:files"
        "devenv:files:cleanup"
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
        "storm:setup:git"
        "devenv:files"
        "devenv:files:cleanup"
        "storm:setup:install"
      ];
    };
  };

  git-hooks = {
    enable = true;
    hooks = {
      taplo = {
        enable = true;
        description = "Taplo with @storm-software/linting-tools config";
        args = [
          "--config=${config.git.root}/packages/linting-tools/src/taplo/config.toml"
          "--cache-path=${config.git.root}/node_modules/.cache/taplo"
        ];
        excludes = [ "Cargo\\.toml$" ];
      };
      zizmor = {
        enable = true;
        description = "Zizmor with @storm-software/linting-tools config";
        args = [
          "--offline"
          "--config=${config.git.root}/tools/config/zizmor.yml"
        ];
        files = "^\\.github/workflows/.*\\.(yml|yaml)$";
      };
    };
  };
}
