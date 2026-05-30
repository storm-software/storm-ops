{ pkgs, ... }:
{
  packages = with pkgs; [
    ttyd
    ffmpeg
    vhs
  ];
}
