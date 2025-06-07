import type { StormWorkspaceConfig } from "@storm-software/config";
import { ACRONYMS_LIST } from "./constants";

/**
 * Get a banner header to display at the top of a file
 *
 * @param name - The name to use in the display
 * @param workspaceConfig - The workspace config to use for additional information
 * @returns The banner header
 */
export const getFileBanner = (
  name = "",
  workspaceConfig?: StormWorkspaceConfig
) => {
  if (!name) {
    name = process.env.STORM_NAME || "";
  }

  let padding = "                               ";
  for (let i = 0; i < name.length + 2 && padding.length > 4; i++) {
    padding = padding.slice(0, -1);
  }

  let titleName = name || workspaceConfig?.name;
  if (titleName) {
    if (titleName?.startsWith("@")) {
      titleName = titleName.slice(1);
    }

    titleName = (titleName.charAt(0).toUpperCase() + titleName.slice(1))
      .split("-")
      .filter(word => word && word.length > 0)
      .map(word => {
        if (ACRONYMS_LIST.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }

        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const license = (
    process.env.STORM_LICENSE ||
    workspaceConfig?.license ||
    "Apache-2.0"
  )
    .split(" ")
    .filter(word => word && word.toLowerCase() !== "license")
    .join(" ");

  return ` -------------------------------------------------------------------

${padding}⚡ Storm Software ${titleName ? `- ${titleName}` : ""}

 This code was released as part of ${titleName ? `the ${titleName}` : "a Storm Software"} project. ${
   titleName ? titleName : "The project"
 }
 is maintained by Storm Software under the ${license} license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at ${
   process.env.STORM_LICENSING ||
   workspaceConfig?.licensing ||
   `https://stormsoftware.com/${name ? `projects/${name}/` : ""}license`
 }.

 Website:                  ${process.env.STORM_HOMEPAGE || workspaceConfig?.homepage || "https://stormsoftware.com"}
 Repository:               ${
   process.env.STORM_REPOSITORY ||
   workspaceConfig?.repository ||
   `https://github.com/storm-software${name ? `/${name}` : ""}`
 }
 Documentation:            ${
   process.env.STORM_DOCS ||
   workspaceConfig?.docs ||
   `https://docs.stormsoftware.com/${name ? `projects/${name}/` : ""}`
 }
 Contact:                  ${
   (
     process.env.STORM_HOMEPAGE ||
     workspaceConfig?.homepage ||
     "https://stormsoftware.com"
   ).endsWith("/")
     ? (
         process.env.STORM_HOMEPAGE ||
         workspaceConfig?.homepage ||
         "https://stormsoftware.com"
       ).slice(-1)
     : process.env.STORM_HOMEPAGE ||
       workspaceConfig?.homepage ||
       "https://stormsoftware.com"
 }/contact

 SPDX-License-Identifier:  ${license}

 ------------------------------------------------------------------- `;
};
