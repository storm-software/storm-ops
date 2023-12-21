/**
 * monorepo-root
 * Find the monorepo root directory
 */

import * as path from "path";

import { Either, alt, chain, fromNullable, map, mapLeft } from "fp-ts/Either";
import { constant, pipe } from "fp-ts/function";
import { findUpSync } from "./find-up";

export type WorkspaceRootError = {
  type: string;
  path: string;
};

const rootFiles = [
  "lerna.json",
  "nx.json",
  "turbo.json",
  "npm-workspace.json",
  "yarn-workspace.json",
  "pnpm-workspace.json",
  "npm-workspace.yaml",
  "yarn-workspace.yaml",
  "pnpm-workspace.yaml",
  "npm-workspace.yml",
  "yarn-workspace.yml",
  "pnpm-workspace.yml",
  "npm-lock.json",
  "yarn-lock.json",
  "pnpm-lock.json",
  "npm-lock.yaml",
  "yarn-lock.yaml",
  "pnpm-lock.yaml",
  "npm-lock.yml",
  "yarn-lock.yml",
  "pnpm-lock.yml",
  "bun.lockb"
];

const formatError = (path: string): WorkspaceRootError => ({
  type: `Cannot find workspace root upwards from known path. Files search list includes: \n${rootFiles.join(
    "\n"
  )}`,
  path
});

const searchUp = (
  target: string[],
  cwd: string
): Either<WorkspaceRootError, string> =>
  pipe(
    findUpSync(target, {
      cwd,
      type: "file",
      limit: 1
    }),
    fromNullable(formatError(cwd)),
    map(path.dirname as any)
  );

/**
 * Find the monorepo root directory, searching upwards from `path`.
 */
export function findWorkspaceRoot(pathInsideMonorepo?: string) {
  return process.env.STORM_WORKSPACE_ROOT
    ? process.env.STORM_WORKSPACE_ROOT
    : process.env.NX_WORKSPACE_ROOT_PATH
    ? process.env.NX_WORKSPACE_ROOT_PATH
    : pipe(
        fromNullable(formatError(""))(pathInsideMonorepo),
        chain(from => searchUp(rootFiles, from)),
        alt(() =>
          pipe(
            searchUp(rootFiles, process.cwd()),
            mapLeft(constant(formatError(process.cwd())))
          )
        )
      );
}
