import jsonPlugin from "@rollup/plugin-json";
import chalk from "chalk";
import fs from "fs";
import { glob } from "glob";
import { builtinModules } from "module";
import { fileExists, readJsonFile } from "nx/src/utils/fileutils";
import path from "path";
import _resolve from "resolve";
import resolveFrom from "resolve-from";
import { InputOptions, OutputOptions, Plugin, PluginImpl } from "rollup";
import { Format } from "tsup";
import ts from "typescript";
import { isMainThread, parentPort } from "worker_threads";

const findLowestCommonAncestor = (filepaths: string[]) => {
  if (filepaths.length <= 1) return "";
  const [first, ...rest] = filepaths;
  let ancestor = first.split("/");
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

  return ancestor.length <= 1 && ancestor[0] === ""
    ? "/" + ancestor[0]
    : ancestor.join("/");
};

export const toObjectEntry = (entry: string | any) => {
  if (typeof entry === "string") {
    entry = [entry];
  }
  if (!Array.isArray(entry)) {
    return entry;
  }
  entry = entry.map(e => e.replace(/\\/g, "/"));
  const ancestor = findLowestCommonAncestor(entry);
  return entry.reduce(
    (result, item) => {
      const key = item
        .replace(ancestor, "")
        .replace(/^\//, "")
        .replace(/\.[a-z]+$/, "");
      return {
        ...result,
        [key]: item
      };
    },
    {} as Record<string, string>
  );
};

export async function removeFiles(patterns: string[], dir: string) {
  const files = await glob(patterns, {
    cwd: dir,
    absolute: true
  });
  files.forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
}

export function defaultOutExtension({
  format,
  pkgType
}: {
  format: Format;
  pkgType?: string;
}): { js: string; dts: string } {
  let jsExtension = ".js";
  let dtsExtension = ".d.ts";
  const isModule = pkgType === "module";
  if (isModule && format === "cjs") {
    jsExtension = ".cjs";
    dtsExtension = ".d.cts";
  }
  if (!isModule && format === "esm") {
    jsExtension = ".js";
    dtsExtension = ".d.ts";
  }
  if (format === "iife") {
    jsExtension = ".global.js";
  }
  return {
    js: jsExtension,
    dts: dtsExtension
  };
}

export function handleError(error: any) {
  if (error.loc) {
    console.error(
      chalk.bold(
        chalk.red(
          `Error parsing: ${error.loc.file}:${error.loc.line}:${error.loc.column}`
        )
      )
    );
  }
  if (error.frame) {
    console.error(chalk.red(error.message));
    console.error(chalk.dim(error.frame));
  } else {
    console.error(chalk.red(error.stack));
  }
  process.exitCode = 1;
  if (!isMainThread && parentPort) {
    parentPort.postMessage("error");
  }
}

const prettyBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, exp)).toFixed(2)} ${unit[exp]}`;
};

const getLengthOfLongestString = (strings: string[]) => {
  return strings.reduce((max, str) => {
    return Math.max(max, str.length);
  }, 0);
};

const padRight = (str: string, maxLength: number) => {
  return str + " ".repeat(maxLength - str.length);
};

export const reportSize = (
  format: string,
  files: { [name: string]: number }
) => {
  const filenames = Object.keys(files);
  const maxLength = getLengthOfLongestString(filenames) + 1;
  for (const name of filenames) {
    writeLog(
      format,
      chalk.bold(
        `${padRight(name, maxLength)} ${chalk.green(prettyBytes(files[name]))}`
      )
    );
  }
};

export const writeLog = (format: string, message: string) => {
  console.info(`${chalk.bold.blue(format.toUpperCase())} ${message}`);
};

const resolveModule = (
  id: string,
  opts: _resolve.AsyncOpts
): Promise<string | null> =>
  new Promise((resolve, reject) => {
    _resolve(id, opts, (err, res) => {
      if (err?.code === "MODULE_NOT_FOUND") {
        return resolve(null);
      }
      if (err) {
        return reject(err);
      }
      resolve(res || null);
    });
  });

export type TsResolveOptions = {
  resolveOnly?: Array<string | RegExp>;
  ignore?: (source: string, importer?: string) => boolean;
};

export const tsResolvePlugin: PluginImpl<TsResolveOptions> = ({
  resolveOnly,
  ignore
} = {}) => {
  const resolveExtensions = [".d.ts", ".ts"];

  return {
    name: `ts-resolve`,

    async resolveId(source, importer) {
      if (!importer) return null;

      // ignore IDs with null character, these belong to other plugins
      if (/\0/.test(source)) return null;

      if (builtinModules.includes(source)) return false;

      if (ignore && ignore(source, importer)) {
        return null;
      }

      if (resolveOnly) {
        const shouldResolve = resolveOnly.some(v => {
          if (typeof v === "string") {
            return v === source;
          }
          return v.test(source);
        });
        if (!shouldResolve) {
          return null;
        }
      }

      // Skip absolute path
      if (path.isAbsolute(source)) {
        return null;
      }

      const basedir = importer
        ? await fs.promises.realpath(path.dirname(importer))
        : process.cwd();

      // A relative path
      if (source[0] === ".") {
        return resolveModule(source, {
          basedir,
          extensions: resolveExtensions
        });
      }

      let id: string | null = null;

      // Try resolving as relative path if `importer` is not present
      if (!importer) {
        id = await resolveModule(`./${source}`, {
          basedir,
          extensions: resolveExtensions
        });
      }

      // Try resolving in node_modules
      if (!id) {
        id = await resolveModule(source, {
          basedir,
          extensions: resolveExtensions,
          packageFilter(pkg) {
            pkg.main = pkg.types || pkg.typings;
            return pkg;
          },
          paths: ["node_modules", "node_modules/@types"]
        });
      }

      if (id) {
        return id;
      }

      // Just make it external if can't be resolved, i.e. tsconfig path alias
      return false;
    }
  };
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

const getRollupConfig = async (options: any): Promise<RollupConfig> => {
  const compilerOptions = parseCompilerOptions(options.dts?.compilerOptions);

  const dtsOptions = options.dts || {};
  dtsOptions.entry = dtsOptions.entry || options.entry;

  if (Array.isArray(dtsOptions.entry) && dtsOptions.entry.length > 1) {
    dtsOptions.entry = toObjectEntry(dtsOptions.entry);
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

  let pkgPath = options.outDir ? options.outDir : process.cwd();

  !options.silent && writeLog("dts", `⚡ Preparing to run ESBuild: ${pkgPath}`);
  if (pkgPath) {
    const splits = pkgPath.split("/");
    if (splits.length > 0) {
      for (let i = 0; i < splits.length - 1; i++) {
        const packageJsonPath = path.join(
          splits.slice(0, splits.length - i).join("/"),
          "package.json"
        );
        !options.silent &&
          writeLog(
            "dts",
            `⚡ Searching for package.json file in ${packageJsonPath} (index: ${i})`
          );

        if (fs.existsSync(packageJsonPath)) {
          !options.silent &&
            writeLog(
              "dts",
              `⚡ Found the package.json file in ${packageJsonPath} (index: ${i})`
            );
          pkgPath = packageJsonPath.replace("package.json", "");
          break;
        }
      }
    }
  }

  const packageJson = fileExists(pkgPath) ? readJsonFile(pkgPath) : undefined;
  const deps = Array.from(
    new Set([
      ...Object.keys(packageJson?.dependencies || {}),
      ...Object.keys(packageJson?.peerDependencies || {})
    ])
  );
  const tsupCleanPlugin: Plugin = {
    name: "tsup:clean",
    async buildStart() {
      if (options.clean) {
        await removeFiles(["**/*.d.{ts,mts,cts}"], options.outDir);
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
        options.outExtension?.({
          format,
          options,
          pkgType: packageJson?.type ? packageJson.type : "module"
        }).dts ||
        defaultOutExtension({
          format,
          pkgType: packageJson?.type ? packageJson.type : "module"
        }).dts;
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
    writeLog("dts", "Build start");
    const bundle = await rollup(options.inputConfig);
    const results = await Promise.all(options.outputConfig.map(bundle.write));
    const outputs = results.flatMap(result => result.output);
    writeLog("dts", `⚡️ Build success in ${getDuration()}`);
    reportSize(
      "dts",
      outputs.reduce((res, info) => {
        const name = path.relative(
          process.cwd(),
          path.join(options.outputConfig[0].dir || ".", info.fileName)
        );
        return {
          ...res,
          [name]: info.type === "chunk" ? info.code.length : info.source.length
        };
      }, {})
    );
  } catch (error) {
    handleError(error);
    writeLog("dts", chalk.red("Build error"));
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
      writeLog("dts", "Build start");
    } else if (event.code === "BUNDLE_END") {
      writeLog("dts", `⚡️ Build success in ${event.duration}ms`);
      parentPort?.postMessage("success");
    } else if (event.code === "ERROR") {
      writeLog("dts", chalk.red("Build failed"));
      handleError(event.error);
    }
  });
}

const startRollup = async (options: any) => {
  const config = await getRollupConfig(options);
  if (options.watch) {
    watchRollup(config);
  } else {
    try {
      await runRollup(config);
      parentPort?.postMessage("success");
    } catch (error) {
      parentPort?.postMessage("error");
    }
    parentPort?.close();
  }
};

parentPort?.on("message", data => {
  const hasTypescript = resolveFrom.silent(process.cwd(), "typescript");
  if (!hasTypescript) {
    console.error("dts", `You need to install "typescript" in your project`);
    parentPort?.postMessage("error");
    parentPort?.close();
    return;
  }
  startRollup(data.options);
});
