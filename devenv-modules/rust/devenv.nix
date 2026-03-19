{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.cargo-deny
    pkgs.capnproto
    pkgs.capnproto-rust
  ];

  languages.rust = {
    enable = true;
  };

  processes.cargo-watch.exec = "cargo-watch";
}
