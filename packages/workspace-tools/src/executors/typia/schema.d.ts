
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface TypiaExecutorSchema {
 /**
  * Entry Path
  * 
  * The path to the entry file
  * 
  * 
  * @format path
 */
 entryPath: string,

 /**
  * Output Path
  * 
  * The path to the output
  * 
  * 
  * @format path
 */
 outputPath: string,

 /**
  * TS Config
  * 
  * The path to the tsconfig.json
  * 
  * 
  * @format path
 */
 tsConfig: string,

 /**
  * Clean
  * 
  * Clean the output directory before building
  * 
 */
 clean: boolean,
}

