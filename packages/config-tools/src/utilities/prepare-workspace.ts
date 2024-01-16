import { getConfigFile } from "../config-file";
import { getConfigEnv, setConfigEnv } from "../env";
import type { StormConfig } from "../types";
import { getDefaultConfig } from "./get-default-config";

export const prepareWorkspace = async (): Promise<StormConfig> => {
  const _STORM_CONFIG = getDefaultConfig({
    ...(await getConfigFile()),
    ...getConfigEnv()
  });
  setConfigEnv(_STORM_CONFIG);

  return _STORM_CONFIG;
};
