import type { TsupNeutralExecutorSchema } from "../tsup-neutral/schema";
import type { Platform } from "../tsup/schema";

export type TsupNodeExecutorSchema = Omit<
  TsupNeutralExecutorSchema,
  "platform"
> & {
  transports: string[];
  platform?: Platform;
};
