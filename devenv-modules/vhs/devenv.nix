{ pkgs, ... }:
{
  name = "storm-software/vhs";

 # https://devenv.sh/packages/
  packages = [
    pkgs.ttyd
    pkgs.ffmpeg
    pkgs.vhs
  ];
 }
