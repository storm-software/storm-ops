
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface ReleaseVersionGeneratorSchema {
 /**
  * Projects
  * 
  * The projects to release
  * 
 */
 projects: Array<{
  [key: string]: any
 }>,

 /**
  * Release Group
  * 
  * The release group
  * 
 */
 releaseGroup: {
  [key: string]: any
 },

 /**
  * Project Graph
  * 
  * The project graph
  * 
 */
 projectGraph: {
  [key: string]: any
 },

 /**
  * Specifier
  * 
  * The specifier
  * 
 */
 specifier: string,

 /**
  * Specifier Source
  * 
  * The specifier source
  * 
 */
 specifierSource?: string,

 /**
  * Preid
  * 
  * The preid
  * 
 */
 preid?: string,

 /**
  * Package Root
  * 
  * The package root
  * 
 */
 packageRoot?: string,

 /**
  * Current Version Resolver
  * 
  * The current version resolver
  * 
  * @default "git-tag"
 */
 currentVersionResolver?: string,

 /**
  * Current Version Resolver Metadata
  * 
  * The current version resolver metadata
  * 
 */
 currentVersionResolverMetadata?: {
  [key: string]: any
 },

 /**
  * Fallback Current Version Resolver
  * 
  * The fallback current version resolver
  * 
  * @default "disk"
 */
 fallbackCurrentVersionResolver?: string,

 /**
  * First Release
  * 
  * Release the first version
  * 
 */
 firstRelease?: boolean,

 /**
  * Version Prefix
  * 
  * The version prefix
  * 
  * 
  * @enum ,auto,~,^,=
 */
 versionPrefix?: string,

 /**
  * Skip Lock File Update
  * 
  * Skip lock file update
  * 
 */
 skipLockFileUpdate?: boolean,

 /**
  * Install Args
  * 
  * The install arguments
  * 
 */
 installArgs?: string,

 /**
  * Install Ignore Scripts
  * 
  * Ignore scripts
  * 
 */
 installIgnoreScripts?: boolean,

 /**
  * Conventional Commits Config
  * 
  * The conventional commits config
  * 
 */
 conventionalCommitsConfig?: {
  [key: string]: any
 },

 /**
  * Delete Version Plans
  * 
  * Delete version plans
  * 
 */
 deleteVersionPlans?: boolean,

 /**
  * Update Dependents
  * 
  * Update dependents
  * 
 */
 updateDependents?: string,

 /**
  * Log Unchanged Projects
  * 
  * Log unchanged projects
  * 
 */
 logUnchangedProjects?: boolean,

 /**
  * Preserve Local Dependency Protocols
  * 
  * Preserve local dependency protocols
  * 
 */
 preserveLocalDependencyProtocols?: boolean,
}

