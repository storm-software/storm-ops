/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { transform } from "./transform";

async function transformAndSave(
  files: any[],
  mode = "github.com",
  maxHeaderLevel = 3,
  title = "## Table of Contents",
  noTitle = false,
  entryPrefix = undefined,
  processAll = false,
  updateOnly = false,
) {
  if (processAll) {
    console.log(
      "--all flag is enabled. Including headers before the TOC location.",
    );
  }

  if (updateOnly) {
    console.log(
      "--update-only flag is enabled. Only updating files that already have a TOC.",
    );
  }

  console.log("\n==================\n");
  const transformed = files.map((x) => {
    const result = transform(
      readFileSync(x.path, "utf8"),
      mode,
      maxHeaderLevel,
      title,
      noTitle,
      entryPrefix,
      processAll,
      updateOnly,
    );
    result.path = x.path;
    return result;
  });

  const changed = transformed.filter((x) => x.transformed);
  const unchanged = transformed.filter((x) => {
    return !x.transformed;
  });

  for (const x of unchanged) {
    console.log('"%s" is up to date', x.path);
  }
  for (const x of changed) {
    console.log('"%s" will be updated', x.path);
    writeFileSync(x.path, x.data, "utf8");
  }
}

export const doctoc = (
  directory: string,
  mode = "github.com",
  maxHeaderLevel = 3,
  title = "## Table of Contents",
  noTitle = false,
  entryPrefix = undefined,
  processAll = false,
  updateOnly = false,
) => {
  let files: any[] = [];

  const stat = statSync(directory);
  if (stat.isDirectory()) {
    console.log(
      '\nDocToccing "%s" and its sub directories for %s.',
      directory,
      mode,
    );
    files = findMarkdownFiles(directory);
  } else {
    console.log('\nDocToccing single file "%s" for %s.', directory, mode);
    files = [{ path: directory }];
  }

  transformAndSave(
    files,
    mode,
    maxHeaderLevel,
    title,
    noTitle,
    entryPrefix,
    processAll,
    updateOnly,
  );

  console.log("\nEverything is OK.");
};

const markdownExts = [".md", ".markdown"];
const ignoredDirs = [".", "..", ".git", "node_modules"];

function separateFilesAndDirs(fileInfos: FileInfo[]) {
  return {
    directories: fileInfos.filter((x) => {
      const stats = statSync(x.path);
      return stats.isDirectory() && !ignoredDirs.includes(x.name);
    }),
    markdownFiles: fileInfos.filter((x) => {
      const stats = statSync(x.path);
      return stats.isFile() && markdownExts.includes(extname(x.name));
    }),
  };
}

type FileInfo = {
  name: string;
  path: string;
};

function findMarkdownFiles(currentPath: string) {
  function getFileInfo(entry: string): FileInfo {
    const target = join(currentPath, entry);

    return {
      name: entry,
      path: target,
    };
  }

  function process(fileInfos: FileInfo[]) {
    const res = separateFilesAndDirs(fileInfos);
    const targets = res.directories.map((directory) => directory.path);

    if (res.markdownFiles.length > 0)
      console.log(
        '\nFound %s in "%s"',
        res.markdownFiles.map((markdownFile) => markdownFile.name).join(", "),
        currentPath,
      );
    else console.log('\nFound nothing in "%s"', currentPath);

    return {
      markdownFiles: res.markdownFiles,
      subDirs: targets,
    };
  }

  const res = process(readdirSync(currentPath).map(getFileInfo));
  const markdownsInSubDirs: any[] = res.subDirs.map(findMarkdownFiles);
  const allMarkdownsHereAndSub = res.markdownFiles.concat(markdownsInSubDirs);

  return allMarkdownsHereAndSub.flat();
}
