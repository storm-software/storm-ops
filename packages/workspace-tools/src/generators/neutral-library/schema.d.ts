import { TypeScriptLibraryGeneratorSchema } from "../../../declarations.d";

export type NeutralLibraryGeneratorSchema = Omit<
  TypeScriptLibraryGeneratorSchema,
  "platform"
>;
