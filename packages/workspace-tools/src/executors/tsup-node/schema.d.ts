import { TsupNeutralExecutorSchema } from "../tsup-neutral/schema";
import { Platform } from "../tsup/schema";

export type TsupNodeExecutorSchema = Omit<
  TsupNeutralExecutorSchema,
  "platform"
> & {
  transports: string[];
  platform?: Platform;
};
