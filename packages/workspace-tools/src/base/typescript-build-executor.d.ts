
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface TypeScriptBuildExecutorSchema {
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
  * Entry File(s)
  * 
  * The entry file or files to build
  * 
  * @default ["{sourceRoot}/index.ts"]
  * 
  * @format path
 */
 entry: Array<string>,

 /**
  * TSConfig Path
  * 
  * The path to the tsconfig file
  * 
  * @default "{projectRoot}/tsconfig.json"
  * 
  * @format path
 */
 tsconfig: string,

 /**
  * Bundle
  * 
  * Bundle the output
  * 
  * @default false
 */
 bundle?: boolean,

 /**
  * Minify
  * 
  * Minify the output
  * 
  * @default false
 */
 minify?: boolean,

 /**
  * Debug
  * 
  * Debug the output
  * 
  * @default false
 */
 debug?: boolean,

 /**
  * Sourcemap
  * 
  * Generate a sourcemap
  * 
  * @default false
 */
 sourcemap?: boolean,

 /**
  * Silent
  * 
  * Should the build run silently - only report errors back to the user
  * 
  * @default false
 */
 silent?: boolean,

 /**
  * Target
  * 
  * The target to build
  * 
  * @default "esnext"
  * 
  * @enum es3,es5,es6,es2015,es2016,es2017,es2018,es2019,es2020,es2021,es2022,es2023,es2024,esnext,node12,node14,node16,node18,node20,node22,browser,chrome58,chrome59,chrome60
 */
 target?: string,

 /**
  * Format
  * 
  * The format to build
  * 
  * @default ["cjs","esm"]
 */
 format?: Array<string>,

 /**
  * Platform
  * 
  * The platform to build
  * 
  * @default "neutral"
  * 
  * @enum neutral,node,browser
 */
 platform?: string,

 /**
  * External
  * 
  * The external dependencies
  * 
 */
 external?: Array<any>,

 /**
  * Define
  * 
  * The define values
  * 
 */
 define?: Record<string, string>,

 /**
  * Environment Variables
  * 
  * The environment variable values
  * 
 */
 env?: Record<string, string>,
}

