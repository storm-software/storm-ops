{ pkgs, ... }:
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
        args = [
          "--config=packages/linting-tools/src/taplo/config.toml"
          "--cache-path=tmp/taplo"
        ];
      };
      zizmor = {
        enable = true;
        args = [
          "--offline"
          "--config=tools/config/zizmor.yml"
        ];
        files = "^\\.github/workflows/*";
      };
    };
  };
}
