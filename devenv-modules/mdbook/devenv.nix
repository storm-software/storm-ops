{ pkgs, ... }:
{
  packages = with pkgs; [
    mdbook
    mdbook-linkcheck2
    mdbook-admonish
    mdbook-toc
  ];
}
