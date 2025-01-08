import type {
  BuildOptions as EsbuildOptions,
  Metafile,
  OutputFile
} from "esbuild";
import path from "node:path";
import {
  SourceMapConsumer,
  SourceMapGenerator,
  type RawSourceMap
} from "source-map";
import {
  AssetInfo,
  ChunkInfo,
  ESBuildResolvedOptions,
  Renderer,
  WrittenFile
} from "../types";
import { outputFile } from "../utilities/output-file";

const parseSourceMap = (map?: string | object | null) => {
  return typeof map === "string" ? JSON.parse(map) : map;
};

const isJS = (path: string) => /\.(js|mjs|cjs)$/.test(path);
const isCSS = (path: string) => /\.css$/.test(path);

const getSourcemapComment = (
  inline: boolean,
  map: RawSourceMap | string | null | undefined,
  filepath: string,
  isCssFile: boolean
) => {
  if (!map) return "";
  const prefix = isCssFile ? "/*" : "//";
  const suffix = isCssFile ? " */" : "";
  const url = inline
    ? `data:application/json;base64,${Buffer.from(
        typeof map === "string" ? map : JSON.stringify(map)
      ).toString("base64")}`
    : `${path.basename(filepath)}.map`;
  return `${prefix}# sourceMappingURL=${url}${suffix}`;
};

export class RendererEngine {
  #renderers: Renderer[];
  #options!: ESBuildResolvedOptions;

  constructor(renderers: Renderer[]) {
    this.#renderers = renderers;
  }

  setOptions(options: ESBuildResolvedOptions) {
    this.#options = options;
  }

  getOptions() {
    if (!this.#options) {
      throw new Error(`Renderer options is not set`);
    }

    return this.#options;
  }

  modifyEsbuildOptions(options: EsbuildOptions) {
    for (const renderer of this.#renderers) {
      if (renderer.esbuildOptions) {
        renderer.esbuildOptions.call(this.getOptions(), options);
      }
    }
  }

  async buildStarted() {
    for (const renderer of this.#renderers) {
      if (renderer.buildStart) {
        await renderer.buildStart.call(this.getOptions());
      }
    }
  }

  async buildFinished({
    outputFiles,
    metafile
  }: {
    outputFiles: OutputFile[];
    metafile?: Metafile;
  }) {
    const files: Array<ChunkInfo | AssetInfo> = outputFiles
      .filter(file => !file.path.endsWith(".map"))
      .map((file): ChunkInfo | AssetInfo => {
        if (isJS(file.path) || isCSS(file.path)) {
          let relativePath = path.relative(
            this.getOptions().config.workspaceRoot,
            file.path
          );
          if (!relativePath.startsWith("\\\\?\\")) {
            relativePath = relativePath.replace(/\\/g, "/");
          }

          const meta = metafile?.outputs[relativePath];
          return {
            type: "chunk",
            path: file.path,
            code: file.text,
            map: outputFiles.find(f => f.path === `${file.path}.map`)?.text,
            entryPoint: meta?.entryPoint,
            exports: meta?.exports,
            imports: meta?.imports
          };
        } else {
          return { type: "asset", path: file.path, contents: file.contents };
        }
      });

    const writtenFiles: WrittenFile[] = [];

    await Promise.all(
      files.map(async info => {
        for (const renderer of this.#renderers) {
          if (info.type === "chunk" && renderer.renderChunk) {
            const result = await renderer.renderChunk.call(
              this.getOptions(),
              info.code,
              info
            );
            if (result) {
              info.code = result.code;
              if (result.map) {
                const originalConsumer = await new SourceMapConsumer(
                  parseSourceMap(info.map)
                );
                const newConsumer = await new SourceMapConsumer(
                  parseSourceMap(result.map)
                );
                const generator = SourceMapGenerator.fromSourceMap(newConsumer);
                generator.applySourceMap(originalConsumer, info.path);
                info.map = generator.toJSON();
                originalConsumer.destroy();
                newConsumer.destroy();
              }
            }
          }
        }

        const inlineSourceMap = this.#options.sourcemap === "inline";
        const contents =
          info.type === "chunk"
            ? info.code +
              getSourcemapComment(
                inlineSourceMap,
                info.map,
                info.path,
                isCSS(info.path)
              )
            : info.contents;
        await outputFile(info.path, contents, {
          mode: info.type === "chunk" ? info.mode : undefined
        });
        writtenFiles.push({
          get name() {
            return path.relative(process.cwd(), info.path);
          },
          get size() {
            return contents.length;
          }
        });
        if (info.type === "chunk" && info.map && !inlineSourceMap) {
          const map =
            typeof info.map === "string" ? JSON.parse(info.map) : info.map;
          const outPath = `${info.path}.map`;
          const contents = JSON.stringify(map);
          await outputFile(outPath, contents);
          writtenFiles.push({
            get name() {
              return path.relative(process.cwd(), outPath);
            },
            get size() {
              return contents.length;
            }
          });
        }
      })
    );

    for (const renderer of this.#renderers) {
      if (renderer.buildEnd) {
        await renderer.buildEnd.call(this.getOptions(), { writtenFiles });
      }
    }
  }
}
