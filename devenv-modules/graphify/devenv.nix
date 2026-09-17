{ config, pkgs, ... }:
let
  graphifyOutput = "${config.devenv.root}/graphify-out";
  graphifyGraph = "${graphifyOutput}/graph.json";
in
{
  # Graphify is installed in uv's isolated tool environment. This avoids adding
  # its Python dependency graph to every repository that imports this module.
  packages = [ pkgs.uv ];

  scripts = {
    graphify-build.exec = ''
      uv tool run --from graphifyy graphify update "${config.devenv.root}"
    '';

    graphify-query.exec = ''
      uv tool run --from graphifyy graphify query "$@" --graph "${graphifyGraph}"
    '';
  };

  # A first shell entry creates the repository-local graph. Subsequent entries
  # preserve it, while `graphify-build` performs an incremental refresh.
  enterShell = ''
    if [ ! -f "${graphifyGraph}" ]; then
      echo "Building Graphify knowledge graph cache at ${graphifyOutput}"
      graphify-build
    fi
  '';
}
