export interface InitGeneratorSchema {
  unitTestRunner?: "vitest" | "jest" | "none";
  skipFormat?: boolean;
  js?: boolean;
  template?: "fetch-handler" | "scheduled-handler" | "hono" | "none";
}
