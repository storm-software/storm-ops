{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.mdbook
    pkgs.mdbook-linkcheck2
    pkgs.mdbook-admonish
    pkgs.mdbook-toc
  ];

  # See full reference at https://devenv.sh/reference/options/
}
