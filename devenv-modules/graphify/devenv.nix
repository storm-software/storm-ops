{ config, pkgs, ... }:
let
  graphifyOutput = "${config.devenv.root}/.graphify";
  graphifyGraph = "${graphifyOutput}/graph.json";
in
{
  # Graphify is installed in uv's isolated tool environment. This avoids adding
  # its Python dependency graph to every repository that imports this module.
  packages = [ pkgs.uv ];

  scripts = {
    graphify-build.exec = ''
      uv tool run --from graphifyy graphify "${config.devenv.root}" --update
    '';

    graphify-query.exec = ''
      uv tool run --from graphifyy graphify query "$@" --graph "${graphifyGraph}"
    '';
  };

  # A first shell entry creates the repository-local graph. Subsequent entries
  # preserve it, while `graphify-build` performs an incremental refresh.
  enterShell = ''
    if [ ! -f "${graphifyGraph}" ]; then
      echo "Building Graphify knowledge graph at ${graphifyOutput}"
      graphify-build
    fi
  '';
}
