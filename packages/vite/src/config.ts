import { preserveDirectives } from "rollup-plugin-preserve-directives";
import type { UserConfig } from "vite";
import { defineConfig as defineViteConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteOptions } from "./types";

function ensureImportFileExtension({
  content,
  extension
}: {
  content: string;
  extension: string;
}) {
  // replace e.g. `import { foo } from './foo'` with `import { foo } from './foo.js'`
  content = content.replace(
    /(im|ex)port\s[\w{}/*\s,]+from\s['"](?:\.\.?\/)+?[^.'"]+(?=['"];?)/gm,
    `$&.${extension}`
  );

  // replace e.g. `import('./foo')` with `import('./foo.js')`
  content = content.replace(
    /import\(['"](?:\.\.?\/)+?[^.'"]+(?=['"];?)/gm,
    `$&.${extension}`
  );
  return content;
}

export const defineConfig = (options: ViteOptions): UserConfig => {
  const outputPath = options.outputPath ?? "dist";
  const cjs =
    options?.format &&
    ((Array.isArray(options.format) && options.format.includes("cjs")) ||
      options.format === "cjs");

  return defineViteConfig({
    plugins: [
      externalizeDeps({
        include: !options.external
          ? []
          : Array.isArray(options.external)
            ? options.external
            : [options.external],
        except: options.bundled ?? []
      }),
      preserveDirectives(),
      tsconfigPaths({
        projects: options.tsconfig ? [options.tsconfig] : undefined
      }),
      dts({
        outDir: `${outputPath}/esm`,
        entryRoot: options.sourceRoot,
        include: options.sourceRoot,
        exclude: options.exclude,
        tsconfigPath: options.tsconfig!,
        compilerOptions: {
          module: 99, // ESNext
          declarationMap: false
        },
        beforeWriteFile: (filePath, content) => {
          content =
            options.beforeWriteDeclarationFile?.(filePath, content) || content;
          return {
            filePath,
            content: ensureImportFileExtension({ content, extension: "js" })
          };
        },
        afterDiagnostic: diagnostics => {
          if (diagnostics.length > 0) {
            console.error("Please fix the above type errors");
            process.exit(1);
          }
        }
      }),
      cjs
        ? dts({
            outDir: `${outputPath}/cjs`,
            entryRoot: options.sourceRoot,
            include: options.sourceRoot,
            exclude: options.exclude,
            tsconfigPath: options.tsconfig!,
            compilerOptions: {
              module: 1, // CommonJS
              declarationMap: false
            },
            beforeWriteFile: (filePath, content) => {
              content =
                options.beforeWriteDeclarationFile?.(filePath, content) ||
                content;
              return {
                filePath: filePath.replace(".d.ts", ".d.cts"),
                content: ensureImportFileExtension({
                  content,
                  extension: "cjs"
                })
              };
            },
            afterDiagnostic: diagnostics => {
              if (diagnostics.length > 0) {
                console.error("Please fix the above type errors");
                process.exit(1);
              }
            }
          })
        : undefined
    ],
    build: {
      outDir: outputPath,
      minify: false,
      sourcemap: true,
      lib: {
        entry: options.entry,
        formats: cjs ? ["es", "cjs"] : ["es"],
        fileName: format => {
          if (format === "cjs") return "cjs/[name].cjs";
          return "esm/[name].js";
        }
      },
      rollupOptions: {
        output: {
          preserveModules: true
        }
      }
    }
  });
};
