/**
 * Type definition for the structure of a `pnpm-workspace.yaml` file.
 */
export interface PnpmWorkspaceFile {
  catalog?: Record<string, string>;
  packages?: string[];
  nohoist?: string[];
  publicHoistPattern?: string[];
  global?: {
    storeDir?: string;
    virtualStoreDir?: string;
    lockfileDir?: string;
    networkConcurrency?: number;
    fetchRetries?: number;
    fetchRetryFactor?: number;
    fetchRetryMintimeout?: number;
    fetchRetryMaxtimeout?: number;
  };
  hooks?: Record<string, string>;
  ignoredPackages?: string[];
  shamefullyHoist?: boolean;
  useGitBranchLockfile?: boolean;
  linkWorkspacePackages?: boolean;
  virtualStoreDir?: string;
  lockfileDir?: string;
  storeDir?: string;
  neverBuiltDependencies?: string[];
  packageExtensions?: Record<string, Record<string, string>>;
  unsafePerm?: boolean;
  autoInstallPeers?: boolean;
  nodeLinker?: "hoisted" | "isolated" | "pnp";
  installPeers?: boolean;
  sideEffectsCache?: boolean;
  sideEffectsCacheReadonly?: boolean;
  lockfileOnly?: boolean;
  preferFrozenLockfile?: boolean;
  frozenLockfile?: boolean;
  verifyStoreIntegrity?: boolean;
  virtualStoreDirPattern?: string;
  shamefullyFlatten?: boolean;
  strictPeerDependencies?: boolean;
  include?: string[];
  exclude?: string[];
  packageImportMethod?: "hardlink" | "copy" | "clone";
  importers?: Record<
    string,
    {
      specifiers?: Record<string, string>;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
      packageExtensions?: Record<string, Record<string, string>>;
      publishConfig?: Record<string, any>;
      engines?: Record<string, string>;
      os?: string[];
      cpu?: string[];
      scripts?: Record<string, string>;
      prepare?: boolean;
      buildIndex?: number;
      linkWorkspacePackages?: boolean;
    }
  >;
}
