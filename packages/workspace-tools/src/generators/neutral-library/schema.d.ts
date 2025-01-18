
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface NeutralLibraryGeneratorSchema {
 /**
  * Directory
  * 
  * The directory to create the library in
  * 
 */
 directory: string,

 /**
  * Name
  * 
  * The name of the library
  * 
 */
 name: string,

 /**
  * Description
  * 
  * The description of the library
  * 
 */
 description?: string,

 /**
  * Build Executor
  * 
  * The executor to use for building the library
  * 
  * @default "@storm-software/workspace-tools:unbuild"
 */
 buildExecutor?: string,

 /**
  * Platform
  * 
  * The platform to target with the library
  * 
  * @default "neutral"
  * 
  * @enum neutral
 */
 platform?: string,

 /**
  * Dev Dependencies
  * 
  * The dev dependencies to install
  * 
 */
 devDependencies?: {
  [key: string]: any
 },

 /**
  * Dependencies
  * 
  * The dependencies to install
  * 
 */
 dependencies?: {
  [key: string]: any
 },

 /**
  * Peer Dependencies
  * 
  * The peer dependencies to install
  * 
 */
 peerDependencies?: {
  [key: string]: any
 },

 /**
  * Peer Dependencies Meta
  * 
  * The peer dependencies meta
  * 
 */
 peerDependenciesMeta?: {
  [key: string]: any
 },

 /**
  * Tags
  * 
  * The tags for the library
  * 
 */
 tags?: string,

 /**
  * TypeScript Config (tsconfig.json) Options
  * 
  * The TypeScript configuration options
  * 
 */
 tsconfigOptions?: {
  [key: string]: any
 },

 /**
  * Skip Format
  * 
  * Skip formatting
  * 
 */
 skipFormat?: boolean,

 /**
  * Skip TsConfig
  * 
  * Skip TypeScript configuration
  * 
 */
 skipTsConfig?: boolean,

 /**
  * Skip Package Json
  * 
  * Skip package.json
  * 
 */
 skipPackageJson?: boolean,

 /**
  * Include Babel Rc
  * 
  * Include Babel configuration
  * 
 */
 includeBabelRc?: boolean,

 /**
  * Unit Test Runner
  * 
  * The unit test runner to use
  * 
  * 
  * @enum jest,vitest,none
 */
 unitTestRunner?: string,

 /**
  * Linter
  * 
  * The linter to use
  * 
 */
 linter?: string,

 /**
  * Test Environment
  * 
  * The test environment to use
  * 
  * 
  * @enum jsdom,node
 */
 testEnvironment?: string,

 /**
  * Import Path
  * 
  * The import path for the library
  * 
 */
 importPath?: string,

 /**
  * JavaScript
  * 
  * Use JavaScript instead of TypeScript
  * 
 */
 js?: boolean,

 /**
  * Pascal Case Files
  * 
  * Use PascalCase for file names
  * 
 */
 pascalCaseFiles?: boolean,

 /**
  * Strict
  * 
  * Enable strict mode
  * 
 */
 strict?: boolean,

 /**
  * Publishable
  * 
  * Make the library publishable
  * 
 */
 publishable?: boolean,

 /**
  * Buildable
  * 
  * Make the library buildable
  * 
 */
 buildable?: boolean,

 /**
  * Set Parser Options Project
  * 
  * Set parser options project
  * 
 */
 setParserOptionsProject?: boolean,

 /**
  * Config
  * 
  * The configuration type
  * 
  * 
  * @enum workspace,project,npm-scripts
 */
 config?: string,

 /**
  * Compiler
  * 
  * The compiler to use
  * 
 */
 compiler?: string,

 /**
  * Bundler
  * 
  * The bundler to use
  * 
 */
 bundler?: string,

 /**
  * Skip Type Check
  * 
  * Skip type checking
  * 
 */
 skipTypeCheck?: boolean,

 /**
  * Minimal
  * 
  * Create a minimal library
  * 
 */
 minimal?: boolean,

 /**
  * Root Project
  * 
  * Create a root project
  * 
 */
 rootProject?: boolean,

 /**
  * Simple Name
  * 
  * Use a simple name for the library
  * 
 */
 simpleName?: boolean,

 /**
  * Add Plugin
  * 
  * Add a plugin to the library
  * 
 */
 addPlugin?: boolean,

 /**
  * Use Project Json
  * 
  * Use project.json
  * 
 */
 useProjectJson?: boolean,

 /**
  * Skip Workspaces Warning
  * 
  * Skip workspaces warning
  * 
 */
 skipWorkspacesWarning?: boolean,

 /**
  * Use Tsc Executor
  * 
  * Use TSC executor
  * 
 */
 useTscExecutor?: boolean,
}

