import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "./base-executor.untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "TypeScriptBuildExecutorSchema",
    title: "TypeScript Build Executor",
    description:
      "A type definition for the base TypeScript build executor schema",
    required: ["entry", "tsconfig"],
  },
  entry: {
    $schema: {
      title: "Entry File(s)",
      format: "path",
      type: "array",
      description: "The entry file or files to build",
      items: { type: "string" },
    },
    $default: ["{sourceRoot}/index.ts"],
  },
  tsconfig: {
    $schema: {
      title: "TSConfig Path",
      type: "string",
      format: "path",
      description: "The path to the tsconfig file",
    },
    $default: "{projectRoot}/tsconfig.json",
  },
  bundle: {
    $schema: {
      title: "Bundle",
      type: "boolean",
      description: "Bundle the output",
    },
  },
  minify: {
    $schema: {
      title: "Minify",
      type: "boolean",
      description: "Minify the output",
    },
  },
  debug: {
    $schema: {
      title: "Debug",
      type: "boolean",
      description: "Debug the output",
    },
  },
  sourcemap: {
    $schema: {
      title: "Sourcemap",
      type: "boolean",
      description: "Generate a sourcemap",
    },
  },
  silent: {
    $schema: {
      title: "Silent",
      type: "boolean",
      description:
        "Should the build run silently - only report errors back to the user",
    },
    $default: false,
  },
  target: {
    $schema: {
      title: "Target",
      type: "string",
      description: "The target to build",
      enum: [
        "es3",
        "es5",
        "es6",
        "es2015",
        "es2016",
        "es2017",
        "es2018",
        "es2019",
        "es2020",
        "es2021",
        "es2022",
        "es2023",
        "es2024",
        "esnext",
        "node12",
        "node14",
        "node16",
        "node18",
        "node20",
        "node22",
        "browser",
        "chrome58",
        "chrome59",
        "chrome60",
      ],
    },
    $default: "esnext",
    $resolve: (val: string = "esnext") => val.toLowerCase(),
  },
  format: {
    $schema: {
      title: "Format",
      type: "array",
      description: "The format to build",
      items: {
        type: "string",
        enum: ["cjs", "esm", "iife"],
      },
    },
    $resolve: (val: string[] = ["cjs", "esm"]) => ([] as string[]).concat(val),
  },
  platform: {
    $schema: {
      title: "Platform",
      type: "string",
      description: "The platform to build",
      enum: ["neutral", "node", "browser"],
    },
    $default: "neutral",
  },
  external: {
    $schema: {
      title: "External",
      type: "array",
      description: "The external dependencies",
    },
    $resolve: (val: string[] = []) => ([] as string[]).concat(val),
  },
  define: {
    $schema: {
      title: "Define",
      type: "object",
      tsType: "Record<string, string>",
      description: "The define values",
    },
    $resolve: (val: Record<string, string> = {}) => val,
    $default: {},
  },
  env: {
    $schema: {
      title: "Environment Variables",
      type: "object",
      tsType: "Record<string, string>",
      description: "The environment variable values",
    },
    $resolve: (val: Record<string, string> = {}) => val,
    $default: {},
  },
});
