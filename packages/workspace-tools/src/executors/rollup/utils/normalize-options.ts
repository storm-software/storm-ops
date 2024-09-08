import { normalizePath, workspaceRoot } from "@nx/devkit";
import { createEntryPoints } from "@nx/js";
import { statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

export interface RollupWithNxPluginOptions {
  /**
   * Additional entry-points to add to exports field in the package.json file.
   * */
  additionalEntryPoints?: string[];
  /**
   * Allow JavaScript files to be compiled.
   */
  allowJs?: boolean;
  /**
   * List of static assets.
   */
  assets?: any[];
  /**
   * Whether to set rootmode to upward. See https://babeljs.io/docs/en/options#rootmode
   */
  babelUpwardRootMode?: boolean;
  /**
   * Which compiler to use.
   */
  compiler?: "babel" | "tsc" | "swc";
  /**
   * Delete the output path before building. Defaults to true.
   */
  deleteOutputPath?: boolean;
  /**
   * A list of external modules that will not be bundled (`react`, `react-dom`, etc.). Can also be set to `all` (bundle nothing) or `none` (bundle everything).
   */
  external?: string[] | "all" | "none";
  /**
   * CSS files will be extracted to the output folder. Alternatively custom filename can be provided (e.g. styles.css)
   */
  extractCss?: boolean | string;
  /**
   * List of module formats to output. Defaults to matching format from tsconfig (e.g. CJS for CommonJS, and ESM otherwise).
   */
  format?: ("cjs" | "esm")[];
  /**
   * Update the output package.json file's 'exports' field. This field is used by Node and bundles.
   */
  generateExportsField?: boolean;
  /**
   * Sets `javascriptEnabled` option for less loader
   */
  javascriptEnabled?: boolean;
  /**
   * The path to the entry file, relative to project.
   */
  main: string;
  /**
   * The path to package.json file.
   * @deprecated Do not set this. The package.json file in project root is detected automatically.
   */
  project?: string;
  /**
   * Name of the main output file. Defaults same basename as 'main' file.
   */
  outputFileName?: string;
  /**
   * The output path of the generated files.
   */
  outputPath: string;
  /**
   * Whether to skip TypeScript type checking.
   */
  skipTypeCheck?: boolean;
  /**
   * Prevents 'type' field from being added to compiled package.json file. Use this if you are having an issue with this field.
   */
  skipTypeField?: boolean;
  /**
   * Output sourcemaps.
   */
  sourceMap?: boolean;
  /**
   * The path to tsconfig file.
   */
  tsConfig: string;
}

export interface AssetGlobPattern {
  glob: string;
  ignore?: string[];
  input: string;
  output: string;
}

export interface NormalizedRollupWithNxPluginOptions
  extends RollupWithNxPluginOptions {
  assets: AssetGlobPattern[];
  compiler: "babel" | "tsc" | "swc";
  format: ("cjs" | "esm")[];
}

export function normalizeOptions(
  projectRoot: string,
  sourceRoot: string,
  options: RollupWithNxPluginOptions
): NormalizedRollupWithNxPluginOptions {
  if (global.NX_GRAPH_CREATION)
    return options as NormalizedRollupWithNxPluginOptions;
  normalizeRelativePaths(projectRoot, options);
  return {
    ...options,
    additionalEntryPoints: createEntryPoints(
      options.additionalEntryPoints,
      workspaceRoot
    ),
    allowJs: options.allowJs ?? false,
    assets: options.assets
      ? normalizeAssets(options.assets, workspaceRoot, sourceRoot)
      : [],
    babelUpwardRootMode: options.babelUpwardRootMode ?? false,
    compiler: options.compiler ?? "babel",
    deleteOutputPath: options.deleteOutputPath ?? true,
    extractCss: options.extractCss ?? true,
    format: options.format ? Array.from(new Set(options.format)) : [],
    generateExportsField: options.generateExportsField ?? false,
    javascriptEnabled: options.javascriptEnabled ?? false,
    skipTypeCheck: options.skipTypeCheck ?? false,
    skipTypeField: options.skipTypeField ?? false
  };
}

function normalizeAssets(
  assets: any[],
  root: string,
  sourceRoot: string
): AssetGlobPattern[] {
  return assets.map(asset => {
    if (typeof asset === "string") {
      const assetPath = normalizePath(asset);
      const resolvedAssetPath = resolve(root, assetPath);
      const resolvedSourceRoot = resolve(root, sourceRoot);

      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new Error(
          `The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`
        );
      }

      const isDirectory = statSync(resolvedAssetPath).isDirectory();
      const input = isDirectory
        ? resolvedAssetPath
        : dirname(resolvedAssetPath);
      const output = relative(resolvedSourceRoot, resolve(root, input));
      const glob = isDirectory ? "**/*" : basename(resolvedAssetPath);
      return {
        input,
        output,
        glob
      };
    } else {
      if (asset.output.startsWith("..")) {
        throw new Error(
          "An asset cannot be written to a location outside of the output path."
        );
      }

      const assetPath = normalizePath(asset.input);
      const resolvedAssetPath = resolve(root, assetPath);
      return {
        ...asset,
        input: resolvedAssetPath,
        // Now we remove starting slash to make Webpack place it from the output root.
        output: asset.output.replace(/^\//, "")
      };
    }
  });
}

function normalizeRelativePaths(
  projectRoot: string,
  options: RollupWithNxPluginOptions
): void {
  for (const [fieldName, fieldValue] of Object.entries(options)) {
    if (isRelativePath(fieldValue)) {
      options[fieldName] = join(projectRoot, fieldValue);
    } else if (Array.isArray(fieldValue)) {
      for (let i = 0; i < fieldValue.length; i++) {
        if (isRelativePath(fieldValue[i])) {
          fieldValue[i] = join(projectRoot, fieldValue[i]);
        }
      }
    }
  }
}

function isRelativePath(val: unknown): boolean {
  return typeof val === "string" && val.startsWith(".");
}
