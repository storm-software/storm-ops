{ pkgs, ... }:
{
  packages = with pkgs; [
    kubectl
    kubectx
    helmfile
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
