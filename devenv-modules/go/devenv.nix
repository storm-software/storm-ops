{ pkgs, ... }:
{
  # https://devenv.sh/languages/go/
  languages.go = {
    enable = true;
    package = pkgs.go;
    lsp = {
      enable = true;
      package = pkgs.gopls;
    };
    delve = {
      enable = true;
      package = pkgs.delve;
    };
  };
}
