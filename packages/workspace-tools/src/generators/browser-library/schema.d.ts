import { LibraryGeneratorSchema } from "@nx/js/src/utils/schema";

export type BrowserLibraryGeneratorSchema = Omit<
  LibraryGeneratorSchema,
  | "js"
  | "pascalCaseFiles"
  | "skipFormat"
  | "skipTsConfig"
  | "skipPackageJson"
  | "includeBabelRc"
  | "unitTestRunner"
  | "linter"
  | "testEnvironment"
  | "config"
  | "compiler"
  | "bundler"
  | "skipTypeCheck"
  | "minimal"
> & {
  name: string;
  description: string;
};
