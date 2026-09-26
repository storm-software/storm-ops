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
  env.AGENTS_FIXTURE = "preserved";
}
EOF

cd "$temporary_workspace"
devenv --no-tui shell --quiet -- bash -c '
  test -f AGENTS.md
  test "$(cat AGENTS.md)" = "$(printf "\\n<!-- storm configuration start-->\\nfixture instructions\\n<!-- storm configuration end-->")"
'

cat > .envrc <<'EOF'
eval "$(devenv direnvrc)"
use devenv
EOF
direnv allow .
direnv export bash > "$temporary_workspace/direnv-exports"
grep -q 'export AGENTS_FIXTURE=' "$temporary_workspace/direnv-exports"

printf '%s\n' '<!-- storm configuration start-->' > AGENTS.md
if devenv --no-tui shell --quiet -- bash -c 'true'; then
  echo 'Expected invalid Storm configuration markers to fail activation' >&2
  exit 1
fi
test "$(cat AGENTS.md)" = '<!-- storm configuration start-->'
test -z "$(compgen -G 'AGENTS.md.tmp.*' || true)"
