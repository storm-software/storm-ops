{ pkgs, ... }:
{
  name = "storm-software/rust";

  # https://devenv.sh/packages/
  packages = [
    pkgs.cargo-deny
  ];

  # https://devenv.sh/languages/
  languages.rust = {
    enable = true;
    channel = "nightly";
  };

  # https://devenv.sh/processes/
  processes.cargo-watch.exec = "cargo-watch";

  # See full reference at https://devenv.sh/reference/options/
}
