{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.terragrunt
    pkgs.tenv
  ];

  languages.opentofu = {
    enable = true;
  };

  languages.terraform = {
    enable = true;
  };
}
