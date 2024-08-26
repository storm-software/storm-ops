import { sep } from "node:path";

export const removeExtension = (filePath?: string): string => {
  const result =
    !filePath || (filePath.match(/./g) || []).length <= 1
      ? "."
      : filePath.lastIndexOf(".")
        ? filePath.substring(0, filePath.lastIndexOf("."))
        : filePath;

  if (result.startsWith("./")) {
    return result.substring(2);
  }
  if (result.startsWith(".") || result.startsWith("/")) {
    return result.substring(1);
  }

  return result;
};

export function findFileName(filePath: string): string {
  return (
    filePath
      ?.split(
        filePath?.includes(sep) ? sep : filePath?.includes("/") ? "/" : "\\"
      )
      ?.pop() ?? ""
  );
}
