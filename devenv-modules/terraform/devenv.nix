{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = with pkgs; [
    terragrunt
    tenv
  ];

  languages = {
    opentofu.enable = true;
    terraform.enable = true;
  };
}
