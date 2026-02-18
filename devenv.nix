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

  git-hooks = {
    enable = true;
    hooks = {
      taplo = {
        enable = true;
        description = "Taplo with @storm-software/linting-tools config";
        args = [
          "--config=${config.env.DEVENV_ROOT}/packages/linting-tools/src/taplo/config.toml"
          "--cache-path=${config.env.DEVENV_ROOT}/node_modules/.cache/taplo"
        ];
        excludes = [ "Cargo\\.toml$" ];
      };
      zizmor = {
        enable = true;
        description = "Zizmor with @storm-software/linting-tools config";
        args = [
          "--offline"
          "--config=${config.env.DEVENV_ROOT}/tools/config/zizmor.yml"
        ];
        files = "^\\.github/workflows/.*\\.(yml|yaml)$";
      };
    };
  };
}
