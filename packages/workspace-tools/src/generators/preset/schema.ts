import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "PresetGeneratorSchema",
    title: "Preset Generator",
    description: "A type definition for a preset generator schema"
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
    }
  },
  includeApps: {
    $schema: {
      title: "Include Apps",
      type: "boolean",
      description: "Include apps in the workspace"
    }
  },
  includeRust: {
    $schema: {
      title: "Include Rust",
      type: "boolean",
      description: "Include Rust support in the workspace"
    }
  },
  namespace: {
    $schema: {
      title: "Namespace",
      type: "string",
      description: "The namespace of the workspace"
    }
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
      description: "The package manager to use"
    }
  }
});
