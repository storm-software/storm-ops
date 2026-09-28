{ pkgs, lib, ... }:
{
  # https://devenv.sh/languages/
  languages.python = {
    enable = true;
    package = pkgs.python312;
    lsp = {
      enable = true;
      package = pkgs.pyright;
    };
    # Disabled by default: on non-NixOS hosts this puts nix glibc on the
    # wrapper's LD_LIBRARY_PATH, which breaks prebuilt binaries spawned by
    # Python tools (e.g. cffsubr's `tx`) that use the host's loader.
    # Consumers that need it can opt back in without `lib.mkForce`.
    manylinux.enable = lib.mkDefault false;
    uv = {
      enable = true;
      package = pkgs.uv;
      sync.enable = true;
    };
  };
}
