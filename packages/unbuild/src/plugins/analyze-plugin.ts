import { writeInfo } from "@storm-software/config-tools";

const formatBytes = bytes => {
  if (bytes === 0) return "0 Byte";
  const k = 1000;
  const dm = 3;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export function analyzePlugin() {
  return {
    name: "storm:analyzer",
    renderChunk(source, chunk) {
      const sourceBytes = formatBytes(source.length);
      const fileName = chunk.fileName;

      writeInfo(` - ${fileName} ${sourceBytes}`);
    }
  };
}
