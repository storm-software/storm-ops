import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.untyped";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "NapiExecutorSchema",
    title: "Napi Executor",
    description:
      "A type definition for the Napi - Bindings Build executor schema",
    required: ["outputPath", "jsBinding", "dts", "manifestPath", "package"]
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The path to the output directory"
    },
    $default: "{sourceRoot}"
  },
  jsBinding: {
    $schema: {
      title: "JS Binding File",
      type: "string",
      description: "The path to the output JavaScript file"
    },
    $default: "binding.js"
  },
  dts: {
    $schema: {
      title: "DTS Binding File",
      type: "string",
      description: "The path to the output TypeScript declaration file"
    },
    $default: "binding.d.ts"
  },
  manifestPath: {
    $schema: {
      title: "Manifest Path",
      type: "string",
      format: "path",
      description: "The path to the Cargo.toml manifest file"
    }
  },
  package: {
    $schema: {
      title: "Package Name",
      type: "string",
      description: "Build the specified library or the one at cwd"
    }
  },
  target: {
    $schema: {
      title: "Target Triple",
      type: "string",
      description:
        "Build for the target triple, bypassed to `cargo build --target`"
    }
  },
  cwd: {
    $schema: {
      title: "Working Directory",
      type: "string",
      format: "path",
      description:
        "Working directory where napi command will be executed; other paths are relative to this"
    }
  },
  configPath: {
    $schema: {
      title: "NAPI Config Path",
      type: "string",
      format: "path",
      description: "Path to napi config JSON file"
    }
  },
  packageJsonPath: {
    $schema: {
      title: "package.json Path",
      type: "string",
      format: "path",
      description: "Path to package.json"
    }
  },
  targetDir: {
    $schema: {
      title: "Cargo Target Dir",
      type: "string",
      format: "path",
      description:
        "Directory for all crate generated artifacts (cargo build --target-dir)"
    }
  },
  platform: {
    $schema: {
      title: "Platform Suffix",
      type: "boolean",
      description:
        "Add platform triple to generated Node.js binding file, e.g. [name].linux-x64-gnu.node"
    },
    $default: true
  },
  jsPackageName: {
    $schema: {
      title: "JS Package Name",
      type: "string",
      description:
        "Package name in generated JS binding file. Works only with --platform"
    }
  },
  constEnum: {
    $schema: {
      title: "Const Enum",
      type: "boolean",
      description: "Whether to generate const enum for TypeScript bindings"
    }
  },
  noJsBinding: {
    $schema: {
      title: "Disable JS Binding",
      type: "boolean",
      description:
        "Disable generation of JS binding file. Works only with --platform"
    }
  },
  dtsHeader: {
    $schema: {
      title: "DTS Header",
      type: "string",
      description:
        "Custom file header for generated type def file (requires typedef feature)"
    }
  },
  noDtsHeader: {
    $schema: {
      title: "Disable Default DTS Header",
      type: "boolean",
      description:
        "Disable default file header for generated type def file (requires typedef feature)"
    }
  },
  dtsCache: {
    $schema: {
      title: "Enable DTS Cache",
      type: "boolean",
      description: "Enable the DTS cache"
    },
    $default: true
  },
  esm: {
    $schema: {
      title: "ESM Output",
      type: "boolean",
      description:
        "Emit an ESM JS binding file instead of CJS (works only with --platform)"
    }
  },
  strip: {
    $schema: {
      title: "Strip Binary",
      type: "boolean",
      description: "Strip the library to minimize file size"
    }
  },
  release: {
    $schema: {
      title: "Release Mode",
      type: "boolean",
      description: "Build in release mode"
    }
  },
  verbose: {
    $schema: {
      title: "Verbose",
      type: "boolean",
      description: "Verbosely log build command trace"
    },
    $default: false
  },
  bin: {
    $schema: {
      title: "Binary",
      type: "string",
      description: "Build only the specified binary"
    }
  },
  profile: {
    $schema: {
      title: "Cargo Profile",
      type: "string",
      description: "Build artifacts with the specified profile"
    }
  },
  crossCompile: {
    $schema: {
      title: "Cross Compile",
      type: "boolean",
      description:
        "[experimental] Cross-compile for the specified target with cargo-xwin on Windows and cargo-zigbuild on other platforms"
    }
  },
  useCross: {
    $schema: {
      title: "Use cross",
      type: "boolean",
      description:
        "[experimental] Use cross (https://github.com/cross-rs/cross) instead of cargo"
    }
  },
  useNapiCross: {
    $schema: {
      title: "Use @napi-rs/cross-toolchain",
      type: "boolean",
      description:
        "[experimental] Use @napi-rs/cross-toolchain to cross-compile Linux arm/arm64/x64 gnu targets"
    }
  },
  watch: {
    $schema: {
      title: "Watch",
      type: "boolean",
      description: "Watch crate changes and build continuously with cargo-watch"
    }
  },
  features: {
    $schema: {
      title: "Cargo Features",
      type: "array",
      description: "List of features to activate",
      items: { type: "string" }
    }
  },
  allFeatures: {
    $schema: {
      title: "All Features",
      type: "boolean",
      description: "Activate all available features"
    }
  },
  noDefaultFeatures: {
    $schema: {
      title: "No Default Features",
      type: "boolean",
      description: "Do not activate the default feature"
    }
  }
});
