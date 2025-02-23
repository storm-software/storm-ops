import { ACRONYMS_LIST } from "./constants";

/**
 * Get a banner header to display at the top of a file
 *
 * @param name - The name to use in the display
 * @returns The banner header
 */
export const getFileBanner = (name = "") => {
  if (!name) {
    name = process.env.STORM_NAME || "";
  }

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

  return ` -------------------------------------------------------------------

${padding}⚡ Storm Software ${titleName ? `- ${titleName}` : ""}

 This code was released as part of ${titleName ? `the ${titleName}` : "a Storm Software"} project. ${
   titleName ? titleName : "The project"
 }
 is maintained by Storm Software under the ${
   (process.env.STORM_LICENSE ?? "Apache-2.0")
     ?.toLowerCase()
     ?.includes("license")
     ? (process.env.STORM_LICENSE ?? "Apache-2.0")
     : `${process.env.STORM_LICENSE ?? "Apache-2.0"} License`
 }, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         ${process.env.STORM_HOMEPAGE ?? "https://stormsoftware.com"}
 Repository:      ${
   process.env.STORM_REPOSITORY ??
   `https://github.com/storm-software${name ? `/${name}` : ""}`
 }
 Documentation:   ${
   process.env.STORM_DOCS
     ? process.env.STORM_DOCS
     : `https://stormsoftware.com/${name ? `projects/${name}/` : ""}docs`
 }
 Contact:         ${
   process.env.STORM_HOMEPAGE
     ? process.env.STORM_HOMEPAGE.endsWith("/")
       ? process.env.STORM_HOMEPAGE.slice(-1)
       : process.env.STORM_HOMEPAGE
     : "https://stormsoftware.com"
 }/contact
 License:         ${
   process.env.STORM_LICENSING
     ? process.env.STORM_LICENSING
     : `https://stormsoftware.com/${name ? `projects/${name}/` : ""}license`
 }

 ------------------------------------------------------------------- `;
};
