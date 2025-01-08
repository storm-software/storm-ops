import { writeInfo } from "@storm-software/config-tools";
import { Plugin } from "rollup";
import { UnbuildOptions, UnbuildResolvedOptions } from "../types";

const formatBytes = bytes => {
  if (bytes === 0) return "0 Byte";
  const k = 1000;
  const dm = 3;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const analyzePlugin = (
  options: UnbuildOptions,
  resolvedOptions: UnbuildResolvedOptions
): Plugin => {
  return {
    name: "storm:analyzer",
    renderChunk(source, chunk) {
      const sourceBytes = formatBytes(source.length);
      const fileName = chunk.fileName;

      writeInfo(` - ${fileName} ${sourceBytes}`, resolvedOptions.config);
    }
  };
};
