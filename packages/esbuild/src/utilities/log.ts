/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import { type LogType, consola } from "consola";

/**
 * Writes a log message to the console.
 *
 * @param type - The type of log message.
 * @param args - The arguments to log.
 */
export function writeLog(type: LogType, ...args: string[]) {
  consola[type]("[Storm]", ...args);
}
