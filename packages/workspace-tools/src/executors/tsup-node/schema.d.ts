import { TsupNeutralExecutorSchema } from "../tsup-neutral/schema";

export type TsupNodeExecutorSchema = Omit<
  TsupNeutralExecutorSchema,
  "platform"
>;
