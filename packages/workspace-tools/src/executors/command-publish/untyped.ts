import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "CommandPublishExecutorSchema",
    title: "Command Publish Executor",
    description:
      "A type definition for a Command Publish executor schema that runs a user-provided publish command",
    oneOf: [{ required: ["commands"] }, { required: ["command"] }]
  },
  command: {
    $schema: {
      title: "Command",
      type: "string",
      description: "The shell command to run to publish the package"
    }
  },
  commands: {
    $schema: {
      title: "Commands",
      type: "array",
      description: "Shell commands to run to publish the package",
      items: {
        type: "string"
      }
    }
  },
  cwd: {
    $schema: {
      title: "Working Directory",
      type: "string",
      format: "path",
      description:
        "The working directory to run the publish command in. Defaults to the project root."
    }
  },
  dryRun: {
    $schema: {
      title: "Dry Run",
      type: "boolean",
      description:
        "When true, log the commands that would be run without executing them"
    },
    $default: false
  }
});
