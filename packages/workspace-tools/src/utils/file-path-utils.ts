import { sep } from "node:path";

export const removeExtension = (filePath: string): string => {
  return filePath.lastIndexOf(".")
    ? filePath.substring(0, filePath.lastIndexOf("."))
    : filePath;
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
