/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectConfiguration } from "nx/src/config/workspace-json-project-json.js";
import { getNxScopes } from "./get-nx-scopes";

export const getScopeEnum = async (context?: any) => {
  return await getNxScopes(
    context,
    (projectConfig?: ProjectConfiguration) =>
      !!projectConfig?.name && !projectConfig.name.includes("e2e")
  );
};
