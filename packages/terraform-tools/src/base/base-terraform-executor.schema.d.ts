
// Generated by @storm-software/untyped
// Do not edit this file directly

export interface BaseTerraformExecutorSchema {
 /**
  * Backend Config
  * 
  * The backend configuration
  * 
 */
 backendConfig?: Array<any>,

 /**
  * Auto Approval
  * 
  * Whether to auto-approve the plan
  * 
  * @default false
 */
 autoApproval?: boolean,

 /**
  * Plan File
  * 
  * The plan file
  * 
  * @default "plan.out"
  * 
  * @format path
 */
 planFile?: string,

 /**
  * Format Write
  * 
  * Whether to format the files before writing
  * 
  * @default false
 */
 formatWrite?: boolean,

 /**
  * Upgrade
  * 
  * Whether to upgrade the modules
  * 
  * @default false
 */
 upgrade?: boolean,

 /**
  * Migrate State
  * 
  * Whether to migrate the state
  * 
  * @default false
 */
 migrateState?: boolean,

 /**
  * Lock
  * 
  * Whether to lock the state
  * 
  * @default false
 */
 lock?: boolean,

 /**
  * Var File
  * 
  * The variable file
  * 
  * @default "variables.tf"
  * 
  * @format path
 */
 varFile?: string,

 /**
  * Var String
  * 
  * The variable string
  * 
 */
 varString?: string,

 /**
  * Reconfigure
  * 
  * Whether to reconfigure the state
  * 
  * @default false
 */
 reconfigure?: boolean,
}

