import { writeError } from "@storm-software/config-tools/logger/console";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import { loadTsConfig } from "bundle-require";
import defu from "defu";
import { TsconfigRaw } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize } from "node:path";
import ts from "typescript";
import { ExportDeclaration } from "./types";

export function ensureTempDeclarationDir(
  workspaceConfig: StormWorkspaceConfig
): string {
  const root =
    workspaceConfig.directories.temp ||
    join(workspaceConfig.workspaceRoot, "tmp");
  const dirPath = join(root, ".tsc", "declaration");

  if (existsSync(dirPath)) {
    return dirPath;
  }

  mkdirSync(dirPath, { recursive: true });

  const gitIgnorePath = join(root, ".tsc", ".gitignore");
  writeFileSync(gitIgnorePath, "**/*\n");

  return dirPath;
}

export function slash(path: string) {
  const isExtendedLengthPath = path.startsWith("\\\\?\\");

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, "/");
}

export function toAbsolutePath(
  workspaceConfig: StormWorkspaceConfig,
  p: string,
  cwd?: string
): string {
  if (isAbsolute(p)) {
    return p;
  }

  return slash(normalize(join(cwd || workspaceConfig.workspaceRoot, p)));
}

class AliasPool {
  private seen = new Set<string>();

  assign(name: string): string {
    let suffix = 0;
    let alias = name === "default" ? "default_alias" : name;

    while (this.seen.has(alias)) {
      alias = `${name}_alias_${++suffix}`;
      if (suffix >= 1000) {
        throw new Error(
          "Alias generation exceeded limit. Possible infinite loop detected."
        );
      }
    }

    this.seen.add(alias);
    return alias;
  }
}

/**
 * Get all export declarations from root files.
 */
function getExports(
  workspaceConfig: StormWorkspaceConfig,
  program: ts.Program,
  fileMapping: Map<string, string>
): ExportDeclaration[] {
  const checker = program.getTypeChecker();
  const aliasPool = new AliasPool();
  const assignAlias = aliasPool.assign.bind(aliasPool);

  function extractExports(sourceFileName: string): ExportDeclaration[] {
    const cwd = program.getCurrentDirectory();
    sourceFileName = toAbsolutePath(workspaceConfig, sourceFileName, cwd);

    const sourceFile = program.getSourceFile(sourceFileName);
    if (!sourceFile) {
      return [];
    }

    const destFileName = fileMapping.get(sourceFileName);
    if (!destFileName) {
      return [];
    }

    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) {
      return [];
    }

    const exports: ExportDeclaration[] = [];

    const exportSymbols = checker.getExportsOfModule(moduleSymbol);
    exportSymbols.forEach(symbol => {
      const name = symbol.getName();
      exports.push({
        kind: "named",
        sourceFileName,
        destFileName,
        name,
        alias: assignAlias(name),
        isTypeOnly: false
      });
    });

    return exports;
  }

  return program.getRootFileNames().flatMap(extractExports);
}

/**
 * Use TypeScript compiler to emit declaration files.
 *
 * @returns The mapping from source TS file paths to output declaration file paths
 */
export function emitDtsFiles(
  workspaceConfig: StormWorkspaceConfig,
  program: ts.Program,
  host: ts.CompilerHost,
  emitOnlyDtsFiles = true,
  customTransformers?: ts.CustomTransformers
) {
  const fileMapping = new Map<string, string>();

  const writeFile: ts.WriteFileCallback = (
    fileName,
    text,
    writeByteOrderMark,
    onError,
    sourceFiles,
    data
  ) => {
    const sourceFile = sourceFiles?.[0];
    const sourceFileName = sourceFile?.fileName;

    if (sourceFileName && !fileName.endsWith(".map")) {
      const cwd = program.getCurrentDirectory();
      fileMapping.set(
        toAbsolutePath(workspaceConfig, sourceFileName, cwd),
        toAbsolutePath(workspaceConfig, fileName, cwd)
      );
    }

    return host.writeFile(
      fileName,
      text,
      writeByteOrderMark,
      onError,
      sourceFiles,
      data
    );
  };

  const emitResult = program.emit(
    undefined,
    writeFile,
    undefined,
    emitOnlyDtsFiles,
    customTransformers
  );

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const diagnosticMessages: string[] = [];

  diagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      diagnosticMessages.push(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      diagnosticMessages.push(message);
    }
  });

  const diagnosticMessage = diagnosticMessages.join("\n");
  if (diagnosticMessage) {
    writeError(
      `Failed to emit declaration files.\n\n${diagnosticMessage}`,
      workspaceConfig
    );

    throw new Error("TypeScript compilation failed");
  }

  return fileMapping;
}

export function emitDts(
  workspaceConfig: StormWorkspaceConfig,
  tsconfig: string,
  tsconfigRaw?: TsconfigRaw,
  emitOnlyDtsFiles = true,
  customTransformers?: ts.CustomTransformers
) {
  const rawTsconfig = loadTsConfig(workspaceConfig.workspaceRoot, tsconfig);
  if (!rawTsconfig) {
    throw new Error(
      `Unable to find ${tsconfig || "tsconfig.json"} in ${workspaceConfig.workspaceRoot}`
    );
  }

  const declarationDir = ensureTempDeclarationDir(workspaceConfig);
  const parsedTsconfig = ts.parseJsonConfigFileContent(
    defu(
      {
        compilerOptions: {
          // Enable declaration emit and disable javascript emit
          noEmit: false,
          declaration: true,
          declarationMap: true,
          declarationDir,
          emitDeclarationOnly: true
        }
      },
      tsconfigRaw?.compilerOptions ?? {},
      rawTsconfig.data ?? {}
    ),
    ts.sys,
    tsconfig ? dirname(tsconfig) : "./"
  );

  const options: ts.CompilerOptions = parsedTsconfig.options;

  const host: ts.CompilerHost = ts.createCompilerHost(options);
  const program: ts.Program = ts.createProgram(
    parsedTsconfig.fileNames,
    options,
    host
  );

  const fileMapping = emitDtsFiles(
    workspaceConfig,
    program,
    host,
    emitOnlyDtsFiles,
    customTransformers
  );
  return getExports(workspaceConfig, program, fileMapping);
}
