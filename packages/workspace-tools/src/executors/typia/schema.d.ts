
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface TypiaExecutorSchema {
 /**
  * Output Path
  * 
  * The output path for the build
  * 
  * @default "{sourceRoot}/__generated__/typia"
  * 
  * @format path
 */
 outputPath: string,

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
  * Clean
  * 
  * Clean the output directory before building
  * 
  * @default true
 */
 clean?: boolean,
}

