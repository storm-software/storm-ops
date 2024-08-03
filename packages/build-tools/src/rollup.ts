import jsonPlugin from "@rollup/plugin-json";
import {
  writeError,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import chalk from "chalk";
import { glob } from "glob";
import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { parentPort } from "node:worker_threads";
import { readPackageJSON } from "pkg-types";
import resolveFrom from "resolve-from";
import type { InputOptions, OutputOptions, Plugin } from "rollup";
import type { NormalizedOptions } from "tsup";
import ts from "typescript";
import { type TsResolveOptions, tsResolvePlugin } from "./plugins/ts-resolve";
import { outExtension } from "./utils/out-extension";

const prettyBytes = (bytes?: number) => {
  if (!bytes) return "0 B";
  const unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** exp).toFixed(2)} ${unit[exp]}`;
};

const getLengthOfLongestString = (strings: string[]) => {
  return strings.reduce((max, str) => {
    return Math.max(max, str.length);
  }, 0);
};

const padRight = (str: string, maxLength: number) => {
  return str + " ".repeat(maxLength - str.length);
};

const reportSize = (files: { [name: string]: number }) => {
  const filenames = Object.keys(files);
  const maxLength = getLengthOfLongestString(filenames) + 1;
  for (const name of filenames) {
    writeSuccess(
      `${chalk.bold(padRight(name, maxLength))}${chalk.green(
        prettyBytes(files[name])
      )}`
    );
  }
};

const parseCompilerOptions = (compilerOptions?: any) => {
  if (!compilerOptions) return {};
  const { options } = ts.parseJsonConfigFileContent(
    { compilerOptions },
    ts.sys,
    "./"
  );
  return options;
};

// Use `require` to esbuild use the cjs build of rollup-plugin-dts
// the mjs build of rollup-plugin-dts uses `import.meta.url` which makes Node throws syntax error
// since tsup is published as a commonjs module for now
const dtsPlugin: typeof import("rollup-plugin-dts") = require("rollup-plugin-dts");

type RollupConfig = {
  inputConfig: InputOptions;
  outputConfig: OutputOptions[];
};

const getRollupConfig = async (
  options: NormalizedOptions
): Promise<RollupConfig> => {
  const compilerOptions = parseCompilerOptions(options.dts?.compilerOptions);

  const dtsOptions = options.dts || {};
  dtsOptions.entry = dtsOptions.entry || options.entry;

  if (Array.isArray(dtsOptions.entry) && dtsOptions.entry.length > 1) {
    if (typeof dtsOptions.entry === "string") {
      dtsOptions.entry = [dtsOptions.entry];
    }
    if (Array.isArray(dtsOptions.entry)) {
      dtsOptions.entry = dtsOptions.entry.map(e => e.replace(/\\/g, "/"));

      let ancestor;
      if (dtsOptions.entry.length <= 1) {
        ancestor = "";
      } else {
        const [first, ...rest] = dtsOptions.entry;
        ancestor = first?.split("/");
        for (const filepath of rest) {
          const directories = filepath.split("/", ancestor.length);
          let index = 0;
          for (const directory of directories) {
            if (directory === ancestor[index]) {
              index += 1;
            } else {
              ancestor = ancestor.slice(0, index);
              break;
            }
          }
          ancestor = ancestor.slice(0, index);
        }
      }

      dtsOptions.entry = dtsOptions.entry.reduce(
        (result, item) => {
          const key = item
            .replace(
              ancestor.length <= 1 && ancestor[0] === ""
                ? `/${ancestor[0]}`
                : ancestor.join("/"),
              ""
            )
            .replace(/^\//, "")
            .replace(/\.[a-z]+$/, "");
          return {
            ...result,
            [key]: item
          };
        },
        {} as Record<string, string>
      );
    }
  }

  let tsResolveOptions: TsResolveOptions | undefined;

  if (dtsOptions.resolve) {
    tsResolveOptions = {};
    // Only resolve specific types when `dts.resolve` is an array
    if (Array.isArray(dtsOptions.resolve)) {
      tsResolveOptions.resolveOnly = dtsOptions.resolve;
    }

    // `paths` should be handled by rollup-plugin-dts
    if (compilerOptions.paths) {
      const res = Object.keys(compilerOptions.paths).map(
        p => new RegExp(`^${p.replace("*", ".+")}$`)
      );
      tsResolveOptions.ignore = source => {
        return res.some(re => re.test(source));
      };
    }
  }

  const pkg = await readPackageJSON(options.projectRoot);
  const deps = Array.from(
    new Set([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ])
  );

  const tsupCleanPlugin: Plugin = {
    name: "tsup:clean",
    async buildStart() {
      if (options.clean) {
        const files = await glob(["**/*.d.{ts,mts,cts}"], {
          cwd: options.outDir,
          absolute: true
        });
        files.forEach(file => existsSync(file) && unlinkSync(file));
      }
    }
  };

  const ignoreFiles: Plugin = {
    name: "tsup:ignore-files",
    load(id) {
      if (!/\.(js|cjs|mjs|jsx|ts|tsx|mts|json)$/.test(id)) {
        return "";
      }
    }
  };

  const fixCjsExport: Plugin = {
    name: "tsup:fix-cjs-export",
    renderChunk(code, info) {
      if (
        info.type !== "chunk" ||
        !/\.(ts|cts)$/.test(info.fileName) ||
        !info.isEntry ||
        info.exports?.length !== 1 ||
        info.exports[0] !== "default"
      )
        return;

      return code.replace(
        /(?<=(?<=[;}]|^)\s*export\s*){\s*([\w$]+)\s*as\s+default\s*}/,
        `= $1`
      );
    }
  };

  return {
    inputConfig: {
      input: dtsOptions.entry,
      onwarn(warning, handler) {
        if (
          warning.code === "UNRESOLVED_IMPORT" ||
          warning.code === "CIRCULAR_DEPENDENCY" ||
          warning.code === "EMPTY_BUNDLE"
        ) {
          return;
        }
        return handler(warning);
      },
      plugins: [
        tsupCleanPlugin,
        tsResolveOptions && tsResolvePlugin(tsResolveOptions),
        jsonPlugin(),
        ignoreFiles,
        dtsPlugin.default({
          tsconfig: options.tsconfig,
          compilerOptions: {
            ...compilerOptions,
            baseUrl: compilerOptions.baseUrl || ".",
            // Ensure ".d.ts" modules are generated
            declaration: true,
            // Skip ".js" generation
            noEmit: false,
            emitDeclarationOnly: true,
            // Skip code generation when error occurs
            noEmitOnError: true,
            // Avoid extra work
            checkJs: false,
            declarationMap: false,
            skipLibCheck: true,
            preserveSymlinks: false,
            // Ensure we can parse the latest code
            target: ts.ScriptTarget.ESNext
          }
        })
      ].filter(Boolean),
      external: [
        // Exclude dependencies, e.g. `lodash`, `lodash/get`
        ...deps.map(dep => new RegExp(`^${dep}($|\\/|\\\\)`)),
        ...(options.external || [])
      ]
    },
    outputConfig: options.format.map((format): OutputOptions => {
      const outputExtension =
        options.outExtension?.({ format, options, pkgType: pkg.type }).dts ||
        outExtension({ format, pkgType: pkg.type }).dts;
      return {
        dir: options.outDir || "dist",
        format: "esm",
        exports: "named",
        banner: dtsOptions.banner,
        footer: dtsOptions.footer,
        entryFileNames: `[name]${outputExtension}`,
        chunkFileNames: `[name]-[hash]${outputExtension}`,
        plugins: [
          format === "cjs" && options.cjsInterop && fixCjsExport
        ].filter(Boolean)
      };
    })
  };
};

async function runRollup(options: RollupConfig) {
  const { rollup } = await import("rollup");
  try {
    const start = Date.now();
    const getDuration = () => {
      return `${Math.floor(Date.now() - start)}ms`;
    };
    writeInfo("Build start");
    const bundle = await rollup(options.inputConfig);
    const results = await Promise.all(options.outputConfig.map(bundle.write));
    const outputs = results.flatMap(result => result.output);
    writeSuccess(`⚡️ Build success in ${getDuration()}`);
    reportSize(
      outputs.reduce((res, info) => {
        const name = path.relative(
          process.cwd(),
          path.join(options.outputConfig[0]?.dir || ".", info.fileName)
        );
        return {
          ...res,
          [name]: info.type === "chunk" ? info.code.length : info.source.length
        };
      }, {})
    );
  } catch (error) {
    writeError(error);
  }
}

async function watchRollup(options: {
  inputConfig: InputOptions;
  outputConfig: OutputOptions[];
}) {
  const { watch } = await import("rollup");

  watch({
    ...options.inputConfig,
    plugins: options.inputConfig.plugins,
    output: options.outputConfig
  }).on("event", event => {
    if (event.code === "START") {
      writeInfo("Build start");
    } else if (event.code === "BUNDLE_END") {
      writeSuccess(`⚡️ Build success in ${event.duration}ms`);
      parentPort?.postMessage("success");
    } else if (event.code === "ERROR") {
      writeError(`Build failed - ${event.error.name}\n${event.error.message}`);
    }
  });
}

const startRollup = async (options: NormalizedOptions) => {
  const config = await getRollupConfig(options);
  if (options.watch) {
    watchRollup(config);
  } else {
    try {
      await runRollup(config);
      parentPort?.postMessage("success");
    } catch {
      parentPort?.postMessage("error");
    }
  }
};

parentPort?.on("message", data => {
  const hasTypescript = resolveFrom.silent(process.cwd(), "typescript");
  if (!hasTypescript) {
    writeError('You need to install "typescript" in your project');
    parentPort?.postMessage("error");
    return;
  }
  startRollup(data.options);
});
