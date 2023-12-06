import { TypeScriptLibraryGeneratorSchema } from "../../base/typescript-library-generator";

export type NeutralLibraryGeneratorSchema = Omit<
  TypeScriptLibraryGeneratorSchema,
  "platform"
>;
