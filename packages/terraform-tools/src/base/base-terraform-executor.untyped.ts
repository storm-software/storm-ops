// import baseExecutorSchema from "@storm-software/workspace-tools/base/base-executor.schema";
import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    title: "Base Terraform Executor",
    description: "A base type definition for a Terraform executor schema",
  },
  backendConfig: {
    $schema: {
      title: "Backend Config",
      type: "array",
      description: "The backend configuration",
    },
    $default: [],
  },
  autoApproval: {
    $schema: {
      title: "Auto Approval",
      type: "boolean",
      description: "Whether to auto-approve the plan",
    },
    $default: false,
  },
  planFile: {
    $schema: {
      title: "Plan File",
      format: "path",
      description: "The plan file",
      type: "string",
    },
    $default: "plan.out",
  },
  formatWrite: {
    $schema: {
      title: "Format Write",
      type: "boolean",
      description: "Whether to format the files before writing",
    },
    $default: false,
  },
  upgrade: {
    $schema: {
      title: "Upgrade",
      type: "boolean",
      description: "Whether to upgrade the modules",
    },
    $default: false,
  },
  migrateState: {
    $schema: {
      title: "Migrate State",
      type: "boolean",
      description: "Whether to migrate the state",
    },
    $default: false,
  },
  lock: {
    $schema: {
      title: "Lock",
      type: "boolean",
      description: "Whether to lock the state",
    },
    $default: false,
  },
  varFile: {
    $schema: {
      title: "Var File",
      format: "path",
      type: "string",
      description: "The variable file",
    },
    $default: "variables.tf",
  },
  varString: {
    $schema: {
      title: "Var String",
      type: "string",
      description: "The variable string",
    },
  },
  reconfigure: {
    $schema: {
      title: "Reconfigure",
      type: "boolean",
      description: "Whether to reconfigure the state",
    },
    $default: false,
  },
});
