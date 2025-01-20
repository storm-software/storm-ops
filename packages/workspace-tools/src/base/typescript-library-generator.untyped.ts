import { defineUntypedSchema } from "untyped";
import baseGeneratorSchema from "./base-generator.untyped";

export default defineUntypedSchema({
  ...baseGeneratorSchema,
  $schema: {
    id: "TypeScriptLibraryGeneratorSchema",
    title: "TypeScript Library Generator",
    description:
      "A type definition for the base TypeScript Library Generator schema",
    required: ["directory", "name"]
  },
  name: {
    $schema: {
      title: "Name",
      type: "string",
      description: "The name of the library"
    }
  },
  description: {
    $schema: {
      title: "Description",
      type: "string",
      description: "The description of the library"
    }
  },
  buildExecutor: {
    $schema: {
      title: "Build Executor",
      type: "string",
      description: "The executor to use for building the library"
    },
    $default: "@storm-software/workspace-tools:unbuild"
  },
  platform: {
    $schema: {
      title: "Platform",
      type: "string",
      description: "The platform to target with the library",
      enum: ["neutral", "node", "browser"]
    },
    $default: "neutral"
  },
  devDependencies: {
    $schema: {
      title: "Dev Dependencies",
      type: "object",
      description: "The dev dependencies to install"
    }
  },
  dependencies: {
    $schema: {
      title: "Dependencies",
      type: "object",
      description: "The dependencies to install"
    }
  },
  peerDependencies: {
    $schema: {
      title: "Peer Dependencies",
      type: "object",
      description: "The peer dependencies to install"
    }
  },
  peerDependenciesMeta: {
    $schema: {
      title: "Peer Dependencies Meta",
      type: "object",
      description: "The peer dependencies meta"
    }
  },
  tags: {
    $schema: {
      title: "Tags",
      type: "string",
      description: "The tags for the library"
    }
  },
  tsconfigOptions: {
    $schema: {
      title: "TypeScript Config (tsconfig.json) Options",
      type: "object",
      description: "The TypeScript configuration options"
    }
  },
  skipFormat: {
    $schema: {
      title: "Skip Format",
      type: "boolean",
      description: "Skip formatting"
    }
  },
  skipTsConfig: {
    $schema: {
      title: "Skip TsConfig",
      type: "boolean",
      description: "Skip TypeScript configuration"
    }
  },
  skipPackageJson: {
    $schema: {
      title: "Skip Package Json",
      type: "boolean",
      description: "Skip package.json"
    }
  },
  includeBabelRc: {
    $schema: {
      title: "Include Babel Rc",
      type: "boolean",
      description: "Include Babel configuration"
    }
  },
  unitTestRunner: {
    $schema: {
      title: "Unit Test Runner",
      type: "string",
      enum: ["jest", "vitest", "none"],
      description: "The unit test runner to use"
    }
  },
  linter: {
    $schema: {
      title: "Linter",
      type: "string",
      description: "The linter to use"
    }
  },
  testEnvironment: {
    $schema: {
      title: "Test Environment",
      type: "string",
      enum: ["jsdom", "node"],
      description: "The test environment to use"
    }
  },
  importPath: {
    $schema: {
      title: "Import Path",
      type: "string",
      description: "The import path for the library"
    }
  },
  js: {
    $schema: {
      title: "JavaScript",
      type: "boolean",
      description: "Use JavaScript instead of TypeScript"
    }
  },
  pascalCaseFiles: {
    $schema: {
      title: "Pascal Case Files",
      type: "boolean",
      description: "Use PascalCase for file names"
    }
  },
  strict: {
    $schema: {
      title: "Strict",
      type: "boolean",
      description: "Enable strict mode"
    }
  },
  publishable: {
    $schema: {
      title: "Publishable",
      type: "boolean",
      description: "Make the library publishable"
    }
  },
  buildable: {
    $schema: {
      title: "Buildable",
      type: "boolean",
      description: "Make the library buildable"
    }
  },
  setParserOptionsProject: {
    $schema: {
      title: "Set Parser Options Project",
      type: "boolean",
      description: "Set parser options project"
    }
  },
  config: {
    $schema: {
      title: "Config",
      type: "string",
      enum: ["workspace", "project", "npm-scripts"],
      description: "The configuration type"
    }
  },
  compiler: {
    $schema: {
      title: "Compiler",
      type: "string",
      description: "The compiler to use"
    }
  },
  bundler: {
    $schema: {
      title: "Bundler",
      type: "string",
      description: "The bundler to use"
    }
  },
  skipTypeCheck: {
    $schema: {
      title: "Skip Type Check",
      type: "boolean",
      description: "Skip type checking"
    }
  },
  minimal: {
    $schema: {
      title: "Minimal",
      type: "boolean",
      description: "Create a minimal library"
    }
  },
  rootProject: {
    $schema: {
      title: "Root Project",
      type: "boolean",
      description: "Create a root project"
    }
  },
  simpleName: {
    $schema: {
      title: "Simple Name",
      type: "boolean",
      description: "Use a simple name for the library"
    }
  },
  addPlugin: {
    $schema: {
      title: "Add Plugin",
      type: "boolean",
      description: "Add a plugin to the library"
    }
  },
  useProjectJson: {
    $schema: {
      title: "Use Project Json",
      type: "boolean",
      description: "Use project.json"
    }
  },
  skipWorkspacesWarning: {
    $schema: {
      title: "Skip Workspaces Warning",
      type: "boolean",
      description: "Skip workspaces warning"
    }
  },
  useTscExecutor: {
    $schema: {
      title: "Use Tsc Executor",
      type: "boolean",
      description: "Use TSC executor"
    }
  }
});
