import { TsupExecutorSchema } from "../tsup/schema";

export type TsupNeutralExecutorSchema = Omit<
  TsupExecutorSchema,
  "env" | "platform"
> & {
  transports?: string[];
};
