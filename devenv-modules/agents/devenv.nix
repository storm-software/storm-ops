{
  config,
  lib,
  pkgs,
  ...
}:
let
  stormConfiguration = pkgs.writeText "storm-agents-configuration.md" config.storm.agents.configuration;
  agentsFile = "${config.devenv.root}/AGENTS.md";
in
{
  options.storm.agents.configuration = lib.mkOption {
    type = lib.types.lines;
    default = ''
       ## External packages — DO NOT PATCH

      The following Storm Software ecosystems are maintained in **separate repositories**. Do **not** modify their package code, vendored scaffolding, or `node_modules` contents in this repo — including via `patch-package`, manual edits under `node_modules`, or direct changes to generated integration layers.

      | Ecosystem | Upstream repository | In this repo (do not patch) |
      | --- | --- | --- |
      | **powerlines** | [storm-software/powerlines](https://github.com/storm-software/powerlines) | `powerlines`, `@powerlines/*`, and Powerlines-generated CLI scaffolding |
      | **power-plant** | [storm-software/power-plant](https://github.com/storm-software/power-plant) | `@power-plant/*` and any power-plant schema or tooling packages |
      | **shell-shock** | [storm-software/shell-shock](https://github.com/storm-software/shell-shock) | `@shell-shock/*` and `apps/cli/.shell-shock/` |
      | **razorwind** | [storm-software/razorwind](https://github.com/storm-software/razorwind) | `@razorwind/*` |
      | **cyclone-ui** | [storm-software/cyclone-ui](https://github.com/storm-software/cyclone-ui) | Consumer configuration and integration owned by this repo (for example `powerlines.config.ts`, `razorwind.config.ts`, `shell-shock.config.ts`, `tools/razorwind/`, and cyclone-ui CLI command implementations under `apps/cli/src/`) |
      | **storm-ops** | [storm-software/storm-ops](https://github.com/storm-software/storm-ops) | Reusable workflows, devenv modules, Terraform modules, and other storm-ops artifacts consumed by reference |

      **Allowed in this repository:** consumer configuration and integration owned by this repo (for example `powerlines.config.ts`, `razorwind.config.ts`, `shell-shock.config.ts`, `tools/razorwind/`, and cyclone-ui CLI command implementations under `apps/cli/src/`).

      When a bug or feature belongs in one of the ecosystems above:

      1. **Stop** — do not patch the external package or its vendored layer in this repository.
      2. **Produce a descriptive upstream fix outline** so a human or agent can apply the change in the correct external repository.
      3. **Optionally** implement only this repository's workaround or configuration change if one exists and is explicitly requested.
    '';
    description = "Configuration to add to the AGENTS.md file.";
  };

  config = {
    # The Graphify MCP server uses uv's isolated tool environment.
    packages = [
      pkgs.gawk
      pkgs.uv
    ];

    # `files."AGENTS.md"` would replace the whole document with a generated
    # symlink. Update only the Storm-owned block instead, so workspace-specific
    # instructions outside these markers remain editable and intact.
    enterShell = ''
      if [ ! -e "${agentsFile}" ]; then
        touch "${agentsFile}"
      elif [ ! -f "${agentsFile}" ]; then
        echo "Expected workspace instructions at ${agentsFile}" >&2
        exit 1
      fi

      temporary_agents_file=$(mktemp "${agentsFile}.tmp.XXXXXX")
      trap 'rm -f "$temporary_agents_file"' EXIT

      if ! ${pkgs.gawk}/bin/awk -v configuration_file="${stormConfiguration}" '
        BEGIN {
          start_marker = "<!-- storm configuration start-->"
          end_marker = "<!-- storm configuration end-->"
        }
        $0 == start_marker {
          if (found_start++) {
            print "AGENTS.md contains more than one Storm configuration start marker" > "/dev/stderr"
            exit 1
          }

          print
          while ((getline configuration_line < configuration_file) > 0) {
            print configuration_line
          }
          close(configuration_file)
          in_storm_configuration = 1
          next
        }
        $0 == end_marker {
          if (!in_storm_configuration || found_end++) {
            print "AGENTS.md contains an unmatched Storm configuration end marker" > "/dev/stderr"
            exit 1
          }

          print
          in_storm_configuration = 0
          next
        }
        !in_storm_configuration { print }
        END {
          if (found_start == 0 && found_end == 0) {
            print
            print start_marker
            while ((getline configuration_line < configuration_file) > 0) {
              print configuration_line
            }
            close(configuration_file)
            print end_marker
          } else if (found_start != 1 || found_end != 1 || in_storm_configuration) {
            print "AGENTS.md must contain exactly one complete Storm configuration marker block" > "/dev/stderr"
            exit 1
          }
        }
      ' "${agentsFile}" > "$temporary_agents_file"; then
        exit 1
      fi

      mv "$temporary_agents_file" "${agentsFile}"
      trap - EXIT
    '';

    claude.code = {
      enable = true;

      hooks = {
        # Protect sensitive files (PreToolUse hook)
        protect-secrets = {
          enable = true;
          name = "Protect sensitive files";
          hookType = "PreToolUse";
          matcher = "^(Edit|MultiEdit|Write)$";
          command = ''
            # Read the JSON input from stdin
            json=$(cat)
            file_path=$(echo "$json" | jq -r '.file_path // empty')

            if [[ "$file_path" =~ \.(env|secret)$ ]]; then
              echo "Error: Cannot edit sensitive files"
              exit 1
            fi
          '';
        };
      };

      mcpServers = {
        devenv = {
          type = "stdio";
          command = "devenv";
          args = [ "mcp" ];
          env = {
            DEVENV_ROOT = config.devenv.root;
          };
        };

        graphify = {
          type = "stdio";
          command = "uv";
          args = [
            "run"
            "--with"
            "graphifyy"
            "python"
            "-m"
            "graphify.serve"
            "${config.devenv.root}/graphify-out/graph.json"
          ];
        };
      };
    };
  };
}
