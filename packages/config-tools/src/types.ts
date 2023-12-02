import { wrap, type Infer, type InferIn } from "@decs/typeschema";
import { ColorConfigSchema, StormConfigSchema } from "./schema";

export type ColorConfig = Infer<typeof ColorConfigSchema>;
export type ColorConfigInput = InferIn<typeof ColorConfigSchema>;
export const wrapped_ColorConfig = wrap(ColorConfigSchema);

type TStormConfig = Infer<typeof StormConfigSchema>;
export type StormConfigInput = InferIn<typeof StormConfigSchema>;
export const wrapped_StormConfig = wrap(StormConfigSchema);

export type StormConfig<
  TModuleName extends string = string,
  TModuleConfig = any
> = TStormConfig & {
  modules: Record<string, any> & {
    [moduleName in TModuleName]: TModuleConfig;
  };
};
