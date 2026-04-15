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

    production.module = {
      env.ENVIRONMENT = "production";
      env.NODE_ENV = "production";
      env.DEBUG = false;
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
    rustfmt
    nixfmt
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

      settings.excludes = [
        "**/.git"
        "**/node_modules"
        "**/dist"
        "**/tmp"
        "**/coverage"
        "**/bench"
        "**/__snapshots__"
        "**/__test__"
        "**/__mocks__"
        "**/__generated__"
        "**/.wrangler"
        "**/.rolldown"
        "**/.docusaurus"
        "**/.tamagui"
        "**/tamagui.css"
        "**/.nx"
        "**/.next"
        "**/.storm"
        "**/.powerlines"
        "**/.shell-shock"
        "**/.earthquake"
        "**/.aftershock"
        "**/workbox*.js"
        "**/sw*.js"
        "**/service-worker.js"
        "**/fallback*.js"
        "**/ios"
        "**/.android"
        "**/.DS_Store"
        "**/Thumbs.db"
        "**/.cspellcache"
        "**/package-lock.*"
        "**/npm-lock.*"
        "**/pnpm-lock.*"
        "**/bun.lockb"
        "**/cargo.lock"
        "**/next-env.d.ts"
        "**/CODEOWNERS"
        "**/yarn.lock"
        "**/jest.config.js"
        "**/jest.setup.js"
        "**/jest.config.ts"
        "**/jest.setup.ts"
        "**/jest.config.json"
        "**/jest.setup.json"
        "**/*.spec.{ts,tsx}"
        "**/*.test.{ts,tsx}"
        "**/output"
        "**/temp"
        "**/.temp"
        "**/.history"
        "**/.vitepress/cache"
        "**/.nuxt"
        "**/.svelte-kit"
        "**/.vercel"
        "**/.changeset"
        "**/.idea"
        "**/.cache"
        "**/.vite-inspect"
        "**/.yarn"
        "**/*.min.*"
        "**/CHANGELOG*.md"
        "**/CONTRIBUTING.md"
        "**/SECURITY.md"
        "**/CODE_OF_CONDUCT.md"
        "**/PULL_REQUEST_TEMPLATE.md"
        "**/LICENSE*"
        "**/auto-import?(s).d.ts"
        "**/components.d.ts"
        "**/vite.config.*.timestamp-*"
        "**/webpack.config.*.timestamp-*"
        "**/rollup.config.*.timestamp-*"
        "**/nx/**/schema.d.ts"
        "**/nx/**/schema.json"
        "**/nx/**/schema.md"
        "**/nx/**/*.schema.d.ts"
        "**/nx/**/*.schema.json"
        "**/nx/**/*.schema.md"
        "**/nx/**/generators/**/files"
        ".agents/**/*"
        "**/.agents/**/*"
        ".claude/**/*"
        "**/.claude/**/*"
        ".codex/**/*"
        "**/.codex/**/*"
        ".cursor/**/*"
        "**/.cursor/**/*"
        ".opencode/**/*"
        "**/.opencode/**/*"
        ".nx/**/*"
        "**/.nx/**/*"
      ];

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
            formatting = {
              align_entries = true;
              array_trailing_comma = false;
              array_auto_expand = true;
              array_auto_collapse = false;
              compact_arrays = true;
              compact_inline_tables = false;
              column_width = 80;
              indent_tables = false;
              indent_string = "  ";
              trailing_newline = true;
              reorder_keys = true;
              allowed_blank_lines = 1;
              crlf = false;
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
