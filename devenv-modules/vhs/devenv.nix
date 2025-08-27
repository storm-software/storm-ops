{ pkgs, ... }:
{
 # https://devenv.sh/packages/
  packages = [
    pkgs.ttyd
    pkgs.ffmpeg
    pkgs.vhs
  ];
 }
