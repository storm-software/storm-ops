import { CopyAssetsHandler } from "@nx/js/src/utils/assets/copy-assets-handler";
import { StormConfig } from "@storm-software/config";
import { writeDebug, writeTrace } from "@storm-software/config-tools/logger";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { glob } from "glob";
import { readFile, writeFile } from "node:fs/promises";
import { AssetGlob } from "../types";

export const copyAssets = async (
  config: StormConfig,
  assets: (AssetGlob | string)[],
  outputPath: string,
  projectRoot: string,
  sourceRoot: string,
  generatePackageJson = true,
  includeSrc = false,
  banner?: string,
  footer?: string
) => {
  const pendingAssets = Array.from(assets ?? []);

  pendingAssets.push({
    input: projectRoot,
    glob: "*.md",
    output: "."
  });
  pendingAssets.push({
    input: ".",
    glob: "LICENSE",
    output: "."
  });

  if (generatePackageJson === false) {
    pendingAssets.push({
      input: projectRoot,
      glob: "package.json",
      output: "."
    });
  }

  if (includeSrc === true) {
    pendingAssets.push({
      input: sourceRoot,
      glob: "**/{*.ts,*.tsx,*.js,*.jsx}",
      output: "src/"
    });
  }

  writeTrace(
    `📝  Copying the following assets to the output directory:
${pendingAssets.map(pendingAsset => (typeof pendingAsset === "string" ? ` - ${pendingAsset} -> ${outputPath}` : `  - ${pendingAsset.input}/${pendingAsset.glob} -> ${joinPaths(outputPath, pendingAsset.output)}`)).join("\n")}`,
    config
  );

  const assetHandler = new CopyAssetsHandler({
    projectDir: projectRoot,
    rootDir: config.workspaceRoot,
    outputDir: outputPath,
    assets: pendingAssets
  });
  await assetHandler.processAllAssetsOnce();

  if (includeSrc === true) {
    writeDebug(
      `📝  Adding banner and writing source files: ${joinPaths(
        outputPath,
        "src"
      )}`,
      config
    );

    const files = await glob([
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.ts"),
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.tsx"),
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.js"),
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.jsx")
    ]);

    await Promise.allSettled(
      files.map(async file =>
        writeFile(
          file,
          `${
            banner && typeof banner === "string"
              ? banner.startsWith("//")
                ? banner
                : `// ${banner}`
              : ""
          }\n\n${await readFile(file, "utf8")}\n\n${
            footer && typeof footer === "string"
              ? footer.startsWith("//")
                ? footer
                : `// ${footer}`
              : ""
          }`
        )
      )
    );
  }
};
