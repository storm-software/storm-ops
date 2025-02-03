import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "./base-executor.untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "cargoBaseExecutor",
    title: "Cargo Base Executor",
    description:
      "A base type definition for a Cargo/rust related executor schema",
  },
  package: {
    $schema: {
      title: "Cargo.toml Path",
      type: "string",
      format: "path",
      description: "The path to the Cargo.toml file",
    },
    $default: "{projectRoot}/Cargo.toml",
  },
  toolchain: {
    $schema: {
      title: "Toolchain",
      description: "The type of toolchain to use for the build",
      enum: ["stable", "beta", "nightly"],
      default: "stable",
    },
    $default: "stable",
  },
  target: {
    $schema: {
      title: "Target",
      type: "string",
      description: "The target to build",
    },
  },
  allTargets: {
    $schema: {
      title: "All Targets",
      type: "boolean",
      description: "Build all targets",
    },
  },
  profile: {
    $schema: {
      title: "Profile",
      type: "string",
      description: "The profile to build",
    },
  },
  release: {
    $schema: {
      title: "Release",
      type: "boolean",
      description: "Build in release mode",
    },
  },
  features: {
    $schema: {
      title: "Features",
      type: "string",
      description: "The features to build",
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
    },
  },
  allFeatures: {
    $schema: {
      title: "All Features",
      type: "boolean",
      description: "Build all features",
    },
  },
});
