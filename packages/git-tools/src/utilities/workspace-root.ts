import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root.js";

export const getWorkspaceRoot = () => {
  const root = findWorkspaceRoot(process.cwd());
  process.env.STORM_WORKSPACE_ROOT ??= root?.dir;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root?.dir;

  return root?.dir;
};
