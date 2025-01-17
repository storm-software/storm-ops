import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "ReleaseVersionGeneratorSchema",
    title: "Release Version Generator",
    description: "A type definition for a release version generator schema"
  },
  projects: {
    $schema: {
      title: "Projects",
      type: "array",
      items: {
        type: "object"
      },
      description: "The projects to release"
    }
  },
  releaseGroup: {
    $schema: {
      title: "Release Group",
      type: "object",
      description: "The release group"
    }
  },
  projectGraph: {
    $schema: {
      title: "Project Graph",
      type: "object",
      description: "The project graph"
    }
  },
  specifier: {
    $schema: {
      title: "Specifier",
      type: "string",
      description: "The specifier"
    }
  },
  specifierSource: {
    $schema: {
      title: "Specifier Source",
      type: "string",
      description: "The specifier source"
    }
  },
  preid: {
    $schema: {
      title: "Preid",
      type: "string",
      description: "The preid"
    }
  },
  packageRoot: {
    $schema: {
      title: "Package Root",
      type: "string",
      description: "The package root"
    }
  },
  currentVersionResolver: {
    $schema: {
      title: "Current Version Resolver",
      type: "string",
      description: "The current version resolver"
    }
  },
  currentVersionResolverMetadata: {
    $schema: {
      title: "Current Version Resolver Metadata",
      type: "object",
      description: "The current version resolver metadata"
    }
  },
  fallbackCurrentVersionResolver: {
    $schema: {
      title: "Fallback Current Version Resolver",
      type: "string",
      description: "The fallback current version resolver"
    }
  },
  firstRelease: {
    $schema: {
      title: "First Release",
      type: "boolean",
      description: "Release the first version"
    }
  },
  versionPrefix: {
    $schema: {
      title: "Version Prefix",
      type: "string",
      description: "The version prefix"
    }
  },
  skipLockFileUpdate: {
    $schema: {
      title: "Skip Lock File Update",
      type: "boolean",
      description: "Skip lock file update"
    }
  },
  installArgs: {
    $schema: {
      title: "Install Args",
      type: "string",
      description: "The install arguments"
    }
  },
  installIgnoreScripts: {
    $schema: {
      title: "Install Ignore Scripts",
      type: "boolean",
      description: "Ignore scripts"
    }
  },
  conventionalCommitsConfig: {
    $schema: {
      title: "Conventional Commits Config",
      type: "object",
      description: "The conventional commits config"
    }
  },
  deleteVersionPlans: {
    $schema: {
      title: "Delete Version Plans",
      type: "boolean",
      description: "Delete version plans"
    }
  },
  updateDependents: {
    $schema: {
      title: "Update Dependents",
      type: "string",
      description: "Update dependents"
    }
  },
  logUnchangedProjects: {
    $schema: {
      title: "Log Unchanged Projects",
      type: "boolean",
      description: "Log unchanged projects"
    }
  },
  preserveLocalDependencyProtocols: {
    $schema: {
      title: "Preserve Local Dependency Protocols",
      type: "boolean",
      description: "Preserve local dependency protocols"
    }
  }
});
