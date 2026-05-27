{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.kubectl
    pkgs.kubectx
    pkgs.helmfile
  ];

  languages.helm = {
    enable = true;
    plugins = [
      "helm-secrets"
      "helm-diff"
      "helm-unittest"
      "helm-schema"
    ];
  };
}
