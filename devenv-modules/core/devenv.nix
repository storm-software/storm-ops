{
  lib,
  pkgs,
  inputs,
  config,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  profiles = {
    development.module = {
      env.ENVIRONMENT = "development";
      env.NODE_ENV = "development";
      env.DEBUG = true;
      env.CI = false;
      tasks = {
        "storm:setup:git" = {
          exec = ''
            git config commit.gpgsign true
            git config tag.gpgSign true
            git config lfs.allowincompletepush true
            git config init.defaultBranch main

            npm config set provenance true
          '';
          before = [
            # "storm:setup:updates"
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "storm:setup:install" = {
          exec = ''
            pnpm exec storm-git pre-install
            pnpm install --no-frozen-lockfile
            update-storm
            bootstrap

            pnpm exec storm-git prepare
          '';
          before = [
            # "storm:setup:updates"
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "storm:setup:git"
          ];
        };
        # "storm:setup:updates" = {
        #   exec = ''
        #     pnpm update --recursive --workspace
        #     update-storm
        #   '';
        #   before = [
        #     "devenv:enterShell"
        #     "devenv:enterTest"
        #   ];
        #   after = [
        #     "storm:setup:git"
        #     "devenv:files"
        #     "devenv:files:cleanup"
        #   ];
        #   execIfModified = [
        #     "pnpm-workspace.yaml"

        #   ];
        # };
      };
    };

    production.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
      env.CI = true;
      env.DEVENV_TUI = false;
      tasks = {
        "storm:setup:git" = {
          exec = ''
            git config commit.gpgsign true
            git config tag.gpgSign true
            git config lfs.allowincompletepush true
            git config init.defaultBranch main

            npm config set provenance true
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
            "storm:setup:install"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
          ];
        };
        "storm:setup:install" = {
          exec = ''
            pnpm install --frozen-lockfile
            bootstrap
          '';
          before = [
            "devenv:enterShell"
            "devenv:enterTest"
          ];
          after = [
            "devenv:files"
            "devenv:files:cleanup"
            "storm:setup:git"
          ];
        };
      };
    };
  };

  env.FORCE_COLOR = 3;
  env.CLICOLOR = 1;

  packages = with pkgs; [
    # Source Control
    gnupg
    git-lfs
    git-crypt

    # Linting
    zizmor
    taplo
    typos
    treefmt
    rustfmt
    nixpkgs-fmt
    yamllint
    ls-lint

    # Tools
    capnproto
  ];

  treefmt = {
    enable = true;
    config = {
      enableDefaultExcludes = true;
      projectRootFile = "storm-workspace.json";
      programs = {
        nixfmt = {
          enable = true;
          indent = 2;
          width = 80;
        };

        nixpkgs-fmt.enable = true;

        rustfmt = {
          enable = true;
          edition = "2024";
        };

        taplo = {
          enable = true;
          settings = {
            include = [
              "*.toml"
              "**/Cargo.toml"
              "**/.config/**/*.toml"
              "crates/**/*.toml"
              "apps/**/*.toml"
            ];
            exclude = [
              "node_modules/**/*"
              "dist/**/*"
              "build/**/*"
              "target/**/*"
              "out/**/*"
              "coverage/**/*"
              "**/target/**/*"
              "**/dist/**/*"
              "**/build/**/*"
              "**/out/**/*"
              "**/coverage/**/*"
              ".agents/**/*"
              "**/.agents/**/*"
              ".claude/**/*"
              "**/.claude/**/*"
              ".cursor/**/*"
              "**/.cursor/**/*"
              ".opencode/**/*"
              "**/.opencode/**/*"
              ".nx/**/*"
              "**/.nx/**/*"
            ];
            formatting = {
              # Align consecutive entries vertically.
              align_entries = true;
              # Append trailing commas for multi-line arrays.
              array_trailing_comma = false;
              # Expand arrays to multiple lines that exceed the maximum column width.
              array_auto_expand = true;
              # Collapse arrays that don't exceed the maximum column width and don't contain comments.
              array_auto_collapse = false;
              # Omit white space padding from single-line arrays
              compact_arrays = true;
              # Omit white space padding from the start and end of inline tables.
              compact_inline_tables = false;
              # Maximum column width in characters, affects array expansion and collapse, this doesn't take whitespace into account.
              # Note that this is not set in stone, and works on a best-effort basis.
              column_width = 80;
              # Indent based on tables and arrays of tables and their subtables, subtables out of order are not indented.
              indent_tables = false;
              # The substring that is used for indentation, should be tabs or spaces (but technically can be anything).
              indent_string = "    ";
              # Add trailing newline at the end of the file if not present.
              trailing_newline = true;
              # Alphabetically reorder keys that are not separated by empty lines.
              reorder_keys = true;
              # Maximum amount of allowed consecutive blank lines. This does not affect the whitespace at the end of the document, as it is always stripped.
              allowed_blank_lines = 1;
              # Use CRLF for line endings.
              crlf = false;
              # Use tabs for indentation.
              object_trailing_comma = false;
            };
            rule = [
              {
                formatting = {
                  reorder_keys = true;
                };
                keys = [
                  "dependencies"
                  "dev-dependencies"
                  "build-dependencies"
                  "workspace.dependencies"
                  "patch.crates-io"
                ];
              }
            ];
          };
        };

        yamllint = {
          enable = true;
          settings = {
            include = [
              "*.yaml"
              "*.yml"
              "**/.github/**/*.yaml"
              "**/.github/**/*.yml"
              "**/.config/**/*.yaml"
              "**/.config/**/*.yml"
              "apps/**/*.yaml"
              "apps/**/*.yml"
              "crates/**/*.yaml"
              "crates/**/*.yml"
            ];
            exclude = [
              "node_modules/**/*"
              "dist/**/*"
              "build/**/*"
              "target/**/*"
              "out/**/*"
              "coverage/**/*"
              "**/target/**/*"
              "**/dist/**/*"
              "**/build/**/*"
              "**/out/**/*"
              "**/coverage/**/*"
              ".agents/**/*"
              "**/.agents/**/*"
              ".claude/**/*"
              "**/.claude/**/*"
              ".cursor/**/*"
              "**/.cursor/**/*"
              ".opencode/**/*"
              "**/.opencode/**/*"
              ".nx/**/*"
              "**/.nx/**/*"
            ];
            formatting = {
              # Maximum line length in characters, this is used as a reference for deciding whether to break a line or not, but is not set in stone.
              line_length = 80;
            };
          };
        };
      };
    };
  };
}
