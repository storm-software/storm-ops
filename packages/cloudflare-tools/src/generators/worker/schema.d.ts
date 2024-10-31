import type {
  TypeScriptLibraryGeneratorNormalizedSchema,
  TypeScriptLibraryGeneratorSchema
} from "@storm-software/workspace-tools";

export type WorkerGeneratorSchema = TypeScriptLibraryGeneratorSchema & {
  template?: "fetch-handler" | "scheduled-handler" | "hono" | "none";
  js?: boolean;
  unitTestRunner?: "vitest" | "none";
  directory?: string;
  rootProject?: boolean;
  tags?: string;
  frontendProject?: string;
  skipFormat?: boolean;
  port?: number;
  accountId?: string;
  addPlugin?: boolean;
};

export type NormalizedSchema = TypeScriptLibraryGeneratorNormalizedSchema &
  WorkerGeneratorSchema & {
    appProjectRoot: string;
  };
