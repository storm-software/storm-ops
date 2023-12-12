import { TsupNeutralExecutorSchema } from "../tsup-neutral/schema";
import { Platform } from "../tsup/schema";

export type TsupBrowserExecutorSchema = Omit<
  TsupNeutralExecutorSchema,
  "platform"
> & {
  platform?: Platform;
};
