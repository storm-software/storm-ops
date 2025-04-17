import { writeError } from "@storm-software/config-tools/logger/console";
import { loadTsConfig } from "bundle-require";
import defu from "defu";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize } from "node:path";
import ts from "typescript";
import { ESBuildContext, ExportDeclaration } from "./types";

export function ensureTempDeclarationDir(): string {
  const cwd = process.cwd();
  const dirPath = join(cwd, ".tsup", "declaration");

  if (existsSync(dirPath)) {
    return dirPath;
  }

  mkdirSync(dirPath, { recursive: true });

  const gitIgnorePath = join(cwd, ".tsup", ".gitignore");
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

export function toAbsolutePath(p: string, cwd?: string): string {
  if (isAbsolute(p)) {
    return p;
  }

  return slash(normalize(join(cwd || process.cwd(), p)));
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
  program: ts.Program,
  fileMapping: Map<string, string>
): ExportDeclaration[] {
  const checker = program.getTypeChecker();
  const aliasPool = new AliasPool();
  const assignAlias = aliasPool.assign.bind(aliasPool);

  function extractExports(sourceFileName: string): ExportDeclaration[] {
    const cwd = program.getCurrentDirectory();
    sourceFileName = toAbsolutePath(sourceFileName, cwd);

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
function emitDtsFiles(
  context: ESBuildContext,
  program: ts.Program,
  host: ts.CompilerHost
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
        toAbsolutePath(sourceFileName, cwd),
        toAbsolutePath(fileName, cwd)
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

  const emitResult = program.emit(undefined, writeFile, undefined, true);

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
      context.options.config
    );

    throw new Error("TypeScript compilation failed");
  }

  return fileMapping;
}

export function emit(context: ESBuildContext) {
  const rawTsconfig = loadTsConfig(
    context.options.config.workspaceRoot,
    context.options.tsconfig
  );
  if (!rawTsconfig) {
    throw new Error(
      `Unable to find ${context.options.tsconfig || "tsconfig.json"} in ${context.options.config.workspaceRoot}`
    );
  }

  const declarationDir = ensureTempDeclarationDir();
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
      rawTsconfig.data ?? {}
    ),
    ts.sys,
    context.options.tsconfig ? dirname(context.options.tsconfig) : "./"
  );

  const options: ts.CompilerOptions = parsedTsconfig.options;

  const host: ts.CompilerHost = ts.createCompilerHost(options);
  const program: ts.Program = ts.createProgram(
    parsedTsconfig.fileNames,
    options,
    host
  );

  const fileMapping = emitDtsFiles(context, program, host);
  return getExports(program, fileMapping);
}
