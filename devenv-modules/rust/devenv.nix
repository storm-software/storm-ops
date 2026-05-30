{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = with pkgs; [
    cargo-deny
    capnproto
    capnproto-rust
  ];

  languages.rust = {
    enable = true;
    channel = "nightly";
    components = [
      "rustc"
      "cargo"
      "clippy"
      "rustfmt"
      "rust-analyzer"
      "rust-docs"
      "rust-std"
    ];
    cranelift.enable = true;
    wild.enable = true;
  };

  processes.cargo-watch.exec = "cargo-watch";
}
