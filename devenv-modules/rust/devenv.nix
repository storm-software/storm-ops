{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.cargo-deny
    pkgs.capnproto
    pkgs.capnproto-rust
  ];

  # https://devenv.sh/languages/
  languages.rust = {
    enable = true;
  };

  # https://devenv.sh/processes/
  processes.cargo-watch.exec = "cargo-watch";

  # https://devenv.sh/git-hooks/
  git-hooks = {
    enable = true;
    hooks = {
      shellcheck.enable = true;
      prettier.enable = true;
      cargo-check.enable = true;
      rustfmt.enable = true;
      clippy.enable = true;
      detect-private-keys.enable = true;
      flake-checker.enable = true;
      taplo.enable = true;
      terraform-format.enable = true;
    };
  };
}
