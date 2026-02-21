{ pkgs, ... }:
{
  # https://devenv.sh/languages/
  languages.python = {
    enable = true;
    package = pkgs.python3;
    lsp = {
      enable = true;
      package = pkgs.pyright;
    };
    manylinux.enable = true;
    uv = {
      enable = true;
      package = pkgs.uv;
      sync.enable = true;
    };
  };
}
