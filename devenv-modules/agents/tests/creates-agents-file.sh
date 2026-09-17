#!/usr/bin/env bash
set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
temporary_workspace=$(mktemp -d)
trap 'rm -rf "$temporary_workspace"' EXIT

cat > "$temporary_workspace/devenv.nix" <<EOF
{ ... }:
{
  imports = [ $repository_root/devenv-modules/agents/devenv.nix ];
  storm.agents.configuration = "fixture instructions";
}
EOF

cd "$temporary_workspace"
devenv --no-tui shell --quiet -- bash -c '
  test -f AGENTS.md
  test "$(cat AGENTS.md)" = "$(printf "\\n<!-- storm configuration start-->\\nfixture instructions\\n<!-- storm configuration end-->")"
'
