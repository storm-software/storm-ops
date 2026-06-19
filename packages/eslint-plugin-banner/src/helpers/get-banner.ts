import { ACRONYMS_LIST } from "@storm-software/package-constants/acronyms";

export interface BannerOptions {
  name: string;
  license?: string;
  organization?: string;
  licensing?: string;
  repository?: string;
  docs?: string;
  homepage?: string;
}

/**
 * Get a banner header to display at the top of a file
 *
 * @param options - The options for generating the banner header
 * @returns The banner header
 */
export function getBanner(options: BannerOptions) {
  const { name } = options;

  let padding = "                               ";
  for (let i = 0; i < name.length + 2 && padding.length > 4; i++) {
    padding = padding.slice(0, -1);
  }

  let titleName = name;
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

  const license = (options.license || "Apache-2.0")
    .split(" ")
    .filter(word => word && word.toLowerCase() !== "license")
    .join(" ");

  const organization = options.organization || "storm-software";
  const licensing =
    options.licensing?.replace(/\/$/, "") ||
    "https://stormsoftware.com/licenses";
  const homepage = options.homepage || "https://stormsoftware.com";
  const repository =
    options.repository ||
    `https://github.com/${organization}${name ? `/${name}` : ""}`;
  const docs =
    options.docs ||
    `https://docs.stormsoftware.com${name ? `/projects/${name}` : ""}`;

  const formattedOrganization = (
    organization.charAt(0).toUpperCase() + organization.slice(1)
  )
    .split("-")
    .filter(word => word && word.length > 0)
    .map(word => {
      if (ACRONYMS_LIST.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  const contactHomepage = homepage.endsWith("/")
    ? homepage.slice(0, -1)
    : homepage;

  return ` -------------------------------------------------------------------

${padding}🗲 ${formattedOrganization} ${titleName ? `- ${titleName}` : ""}

 This code was released as part of ${
   titleName ? `the ${titleName}` : `a ${formattedOrganization}`
 } project. ${titleName ? titleName : "The project"}
 is maintained by ${formattedOrganization} under the ${license} license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at ${licensing}/${name ? `projects/${name}` : ""}.

 Website:                  ${homepage}
 Repository:               ${repository}
 Documentation:            ${docs}
 Contact:                  ${contactHomepage}/contact

 SPDX-License-Identifier:  ${license}

 ------------------------------------------------------------------- `;
}
