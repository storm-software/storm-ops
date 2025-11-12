{ pkgs, ... }:
{
  name = "storm-software/storm-ops";

  dotenv.enable = true;
  dotenv.filename = [".env" ".env.local"];
  dotenv.disableHint = true;

  # https://devenv.sh/basics/
  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

  # https://devenv.sh/packages/
  packages = [
    pkgs.cargo-deny
    pkgs.capnproto
    pkgs.capnproto-rust
  ];

  # https://devenv.sh/languages/
  languages.rust = {
    enable = true;
    mold.enable = true;
    toolchainFile = ./rust-toolchain.toml;
  };

  # https://devenv.sh/processes/
  processes.cargo-watch.exec = "cargo-watch";

  git-hooks.hooks = {
    rustfmt.enable = true;
    clippy.enable = true;
  };
}

