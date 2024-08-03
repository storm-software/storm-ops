import { PackageJson } from "pkg-types";

export const outExtension = ({
  format,
  pkgType
}: {
  format?: string;
  pkgType?: PackageJson["type"];
}): { js: string; dts: string } => {
  let jsExtension = ".js";
  let dtsExtension = ".d.ts";
  if (format === "cjs" || pkgType === "commonjs") {
    jsExtension = ".cjs";
    dtsExtension = ".d.cts";
  } else if (format === "esm" || pkgType === "module") {
    jsExtension = ".js";
    dtsExtension = ".d.ts";
  }
  if (format === "iife") {
    jsExtension = ".global.js";
  }

  return {
    js: jsExtension,
    dts: dtsExtension
  };
};
