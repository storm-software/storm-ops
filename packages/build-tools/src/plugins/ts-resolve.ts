import { writeDebug } from "@storm-software/config-tools/logger/console";
import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import _resolve from "resolve";
import type { PluginImpl } from "rollup";

const resolveModule = (
  id: string,
  opts: _resolve.AsyncOpts
): Promise<string | null> =>
  new Promise((resolve, reject) => {
    _resolve(id, opts, (err, res) => {
      if ((err as any)?.code === "MODULE_NOT_FOUND") {
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
    name: `storm:ts-resolve`,

    async resolveId(source, importer) {
      writeDebug(`ts-resolve - resolveId source: ${source}`);
      writeDebug(`ts-resolve - resolveId importer: ${importer}`);

      if (!importer) {
        return null;
      }

      // ignore IDs with null character, these belong to other plugins
      if (/\0/.test(source)) {
        return null;
      }

      if (builtinModules.includes(source)) {
        return false;
      }

      if (ignore && ignore(source, importer)) {
        writeDebug(`ts-resolve - ignored ${source}`);
        return null;
      }

      if (resolveOnly) {
        const shouldResolve = resolveOnly.some(v => {
          if (typeof v === "string") return v === source;
          return v.test(source);
        });
        if (!shouldResolve) {
          writeDebug(`ts-resolve - skipped by matching resolveOnly ${source}`);
          return null;
        }
      }

      // Skip absolute path
      if (path.isAbsolute(source)) {
        writeDebug(`ts-resolve - skipped absolute path: ${source}`);
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
            pkg.main = (pkg.types || pkg.typings)!;
            return pkg;
          },
          paths: ["node_modules", "node_modules/@types"]
        });
      }

      if (id) {
        writeDebug(`ts-resolve - resolved ${source} to ${id}`);
        return id;
      }

      // Just make it external if can't be resolved, i.e. tsconfig path alias
      writeDebug(`ts-resolve - mark ${source} as external`);
      return false;
    }
  };
};
