import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "NpmPublishExecutorSchema",
    title: "Npm Publish Executor",
    description: "A type definition for a Npm Publish executor schema"
  },
  packageRoot: {
    $schema: {
      title: "Package Root",
      type: "string",
      format: "path",
      description: "The path to the package root"
    }
  },
  registry: {
    $schema: {
      title: "Registry",
      type: "string",
      description: "The registry to publish to"
    },
    $default: "https://registry.npmjs.org/"
  },
  tag: {
    $schema: {
      title: "Tag",
      type: "string",
      description: "The tag to publish with"
    },
    $default: "latest"
  },
  version: {
    $schema: {
      title: "Version",
      type: "string",
      description:
        "The version to publish. If not provided, the version from package.json will be used"
    }
  },
  otp: {
    $schema: {
      title: "One Time Password",
      type: "number",
      description: "The one time password"
    }
  },
  dryRun: {
    $schema: {
      title: "Dry Run",
      type: "boolean",
      description: "Perform a dry run"
    },
    $default: false
  },
  firstRelease: {
    $schema: {
      title: "First Release",
      type: "boolean",
      description: "Publish the first release"
    },
    $default: false
  }
});
