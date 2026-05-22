{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.kubectl
    pkgs.kubectx
    pkgs.minikube
    pkgs.tilt
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
