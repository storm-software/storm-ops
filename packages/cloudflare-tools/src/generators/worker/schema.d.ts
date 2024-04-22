import type { ProjectNameAndRootFormat } from "@nx/devkit/src/generators/project-name-and-root-utils";
import { TypeScriptLibraryGeneratorSchema } from "@storm-software/workspace-tools";

export type WorkerGeneratorSchema = TypeScriptLibraryGeneratorSchema & {
  template?: "fetch-handler" | "scheduled-handler" | "hono" | "none";
  js?: boolean;
  unitTestRunner?: "vitest" | "none";
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  rootProject?: boolean;
  tags?: string;
  frontendProject?: string;
  skipFormat?: boolean;
  port?: number;
  accountId?: string;
  addPlugin?: boolean;
};

export interface NormalizedSchema extends WorkerGeneratorSchema {
  appProjectRoot: string;
}
