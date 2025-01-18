
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface CargoCheckExecutorSchema {
 /**
  * Entry File(s)
  * 
  * The entry file or files to build
  * 
  * @default {"default":["{sourceRoot}/index.ts"]}
  * 
  * @format path
 */
 entry?: Array<string>,

 /**
  * Output Path
  * 
  * The output path for the build
  * 
  * @default "dist/{projectRoot}"
  * 
  * @format path
 */
 outputPath?: string,

 /**
  * TSConfig Path
  * 
  * The path to the tsconfig file
  * 
  * @default "{projectRoot}/tsconfig.json"
  * 
  * @format path
 */
 tsconfig?: string,

 /**
  * Cargo.toml Path
  * 
  * The path to the Cargo.toml file
  * 
  * @default "{projectRoot}/Cargo.toml"
  * 
  * @format path
 */
 package?: string,

 /**
  * Toolchain
  * 
  * The type of toolchain to use for the build
  * 
  * @default "stable"
  * 
  * @enum stable,beta,nightly
 */
 toolchain?: string,

 /**
  * Target
  * 
  * The target to build
  * 
 */
 target?: string,

 /**
  * All Targets
  * 
  * Build all targets
  * 
 */
 allTargets?: boolean,

 /**
  * Profile
  * 
  * The profile to build
  * 
 */
 profile?: string,

 /**
  * Release
  * 
  * Build in release mode
  * 
 */
 release?: boolean,

 /**
  * Features
  * 
  * The features to build
  * 
  * 
  * @oneOf [object Object],[object Object]
 */
 features?: string,

 /**
  * All Features
  * 
  * Build all features
  * 
 */
 allFeatures?: boolean,
}

