/**
 * Get a banner header to display at the top of a file
 *
 * @param name - The name to use in the display
 * @param commentStart - The comment starting token
 * @returns The banner header
 */
export const getFileBanner = (name: string, commentStart = "//") => {
  let padding = "";
  while (name.length + padding.length < 12) {
    padding += " ";
  }

  let titleName = process.env.STORM_NAMESPACE ?? "";
  if (titleName) {
    if (titleName?.startsWith("@")) {
      titleName = titleName.slice(1);
    }

    titleName = (titleName.charAt(0).toUpperCase() + titleName.slice(1))
      .split("-")
      .filter((word) => word && word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return `

${commentStart} -------------------------------------------------------------------
${commentStart}
${commentStart}                         ${padding}Storm Software
${commentStart}                 ⚡ ${titleName ? `${titleName} - ` : ""}${name}
${commentStart}
${commentStart} This code was released as part of the ${titleName ? `${titleName} ` : ""}project. ${
    titleName ? titleName : "This project"
  }
${commentStart} is maintained by Storm Software under the ${
    process.env.STORM_LICENSE ?? "Apache License 2.0"
  }, and is
${commentStart} free for commercial and private use. For more information, please visit
${commentStart} our licensing page.
${commentStart}
${commentStart}    Website: ${process.env.STORM_HOMEPAGE ?? "https://stormsoftware.org"}
${commentStart}    Repository: ${
    process.env.STORM_REPOSITORY ?? "https://github.com/storm-software/storm-stack"
  }
${commentStart}    Documentation: https://stormsoftware.org/docs${
    titleName?.startsWith("@") ? `/${titleName.slice(1)}` : ""
  }
${commentStart}    Contact: ${
    process.env.STORM_HOMEPAGE
      ? process.env.STORM_HOMEPAGE.endsWith("/")
        ? process.env.STORM_HOMEPAGE.slice(-1)
        : process.env.STORM_HOMEPAGE
      : "https://stormsoftware.org"
  }/contact
${commentStart}    Licensing: ${
    process.env.STORM_HOMEPAGE
      ? process.env.STORM_HOMEPAGE.endsWith("/")
        ? process.env.STORM_HOMEPAGE.slice(-1)
        : process.env.STORM_HOMEPAGE
      : "https://stormsoftware.org"
  }/licensing
${commentStart}
${commentStart} -------------------------------------------------------------------


`;
};
