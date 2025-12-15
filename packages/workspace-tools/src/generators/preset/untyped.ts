import { defineUntypedSchema } from "untyped";
import baseGeneratorSchema from "../../base/base-generator.untyped";

export default defineUntypedSchema({
  ...baseGeneratorSchema,
  $schema: {
    id: "PresetGeneratorSchema",
    title: "Preset Generator",
    description: "A type definition for a preset generator schema",
    required: ["directory", "name"]
  },
  name: {
    $schema: {
      title: "Name",
      type: "string",
      description: "The name of the workspace"
    }
  },
  organization: {
    $schema: {
      title: "Organization",
      type: "string",
      description: "The organization of the workspace"
    },
    $default: "storm-software"
  },
  includeApps: {
    $schema: {
      title: "Include Apps",
      type: "boolean",
      description: "Include apps in the workspace"
    },
    $default: true
  },
  includeRust: {
    $schema: {
      title: "Include Rust",
      type: "boolean",
      description: "Include Rust support in the workspace"
    },
    $default: false
  },
  namespace: {
    $schema: {
      title: "Namespace",
      type: "string",
      description: "The namespace of the workspace"
    },
    $default: "storm-software"
  },
  description: {
    $schema: {
      title: "Description",
      type: "string",
      description: "The description of the workspace"
    }
  },
  repositoryUrl: {
    $schema: {
      title: "Repository URL",
      type: "string",
      description: "The URL of the repository"
    }
  },
  nxCloud: {
    $schema: {
      title: "Nx Cloud",
      type: "string",
      description: "Nx Cloud configuration"
    }
  },
  mode: {
    $schema: {
      title: "Mode",
      type: "string",
      description: "The mode of the Nx client"
    }
  },
  packageManager: {
    $schema: {
      title: "Package Manager",
      type: "string",
      description: "The package manager to use",
      enum: ["npm", "pnpm", "yarn", "bun"]
    },
    $default: "pnpm"
  }
});
