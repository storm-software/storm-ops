import { writeInfo } from "@storm-software/config-tools/logger/console";

const formatBytes = bytes => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  if (bytes === 1) {
    return "1 Byte";
  }

  const k = 1000;
  const dm = 3;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export function analyze() {
  return {
    name: "storm:plugin-analyzer",
    renderChunk(source, chunk) {
      const sourceBytes = formatBytes(source.length);
      const fileName = chunk.fileName;
      writeInfo(` - ${fileName} ${sourceBytes}`);
    }
  };
}
