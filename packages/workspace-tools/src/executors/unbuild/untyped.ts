import { defineUntypedSchema } from "untyped";
import typescriptBuildExecutorSchema from "../../base/typescript-build-executor.untyped";

export default defineUntypedSchema({
  ...typescriptBuildExecutorSchema,
  $schema: {
    id: "UnbuildExecutorSchema",
    title: "Unbuild Executor",
    description: "A type definition for a unbuild executor schema"
  },
  name: {
    $schema: {
      title: "Name",
      type: "string",
      description: "The name of the project/build"
    },
    $default: "{projectName}"
  },
  treeShaking: {
    $schema: {
      title: "Tree Shaking",
      type: "boolean",
      description: "Enable tree shaking"
    },
    $default: true
  },
  watch: {
    $schema: {
      title: "Watch",
      type: "boolean",
      description: "Watch for changes"
    },
    $default: false
  },
  clean: {
    $schema: {
      title: "Clean",
      type: "boolean",
      description: "Clean the output directory before building"
    },
    $default: false
  },
  stub: {
    $schema: {
      title: "Stub",
      type: "boolean",
      description: "Stub the output"
    },
    $default: false
  },
  watchOptions: {
    $schema: {
      title: "Watch Options",
      type: "object",
      description: "Watch options"
    },
    $default: {}
  },
  stubOptions: {
    $schema: {
      title: "Stub Options",
      type: "object",
      description: "Stub options"
    },
    $default: {
      jiti: {
        cache: "node_modules/.cache/storm"
      }
    }
  },
  dependencies: {
    $schema: {
      title: "Dependencies",
      type: "array",
      description: "The dependencies to install",
      items: {
        type: "string"
      }
    },
    $default: []
  },
  peerDependencies: {
    $schema: {
      title: "Peer Dependencies",
      type: "array",
      description: "The peer dependencies to install",
      items: {
        type: "string"
      }
    },
    $default: []
  },
  devDependencies: {
    $schema: {
      title: "Dev Dependencies",
      type: "array",
      description: "The dev dependencies to install",
      items: {
        type: "string"
      }
    },
    $default: []
  },
  alias: {
    $schema: {
      title: "Alias",
      type: "object",
      tsType: "Record<string, string>",
      description: "The alias to use"
    },
    $default: {}
  },
  replace: {
    $schema: {
      title: "Replace",
      type: "object",
      tsType: "Record<string, string>",
      description: "The replace to use"
    },
    $default: {}
  },
  rollup: {
    $schema: {
      title: "Rollup",
      type: "object",
      description: "The rollup options"
    },
    $default: {}
  }
});
