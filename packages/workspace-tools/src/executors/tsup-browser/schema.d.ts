import type { TsupNeutralExecutorSchema } from "../tsup-neutral/schema";
import type { Platform } from "../tsup/schema";

export type TsupBrowserExecutorSchema = Omit<TsupNeutralExecutorSchema, "platform"> & {
  platform?: Platform;
};
