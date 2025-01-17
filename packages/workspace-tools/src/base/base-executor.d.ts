
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface BaseExecutorSchema {
 /**
  * Entry File
  * 
  * The entry file to build
  * 
  * @default ["{sourceRoot}/index.ts"]
  * 
  * @format path
 */
 entry: Array<string>,

 /**
  * Output Path
  * 
  * The output path for the build
  * 
  * @default "dist/{projectRoot}"
  * 
  * @format path
 */
 outputPath: string,

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
}

