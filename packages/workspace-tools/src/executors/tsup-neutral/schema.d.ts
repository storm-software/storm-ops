import { Platform, TsupExecutorSchema } from "../tsup/schema";

export type TsupNeutralExecutorSchema = Omit<
  TsupExecutorSchema,
  "env" | "platform"
> & {
  platform: Platform;
};
