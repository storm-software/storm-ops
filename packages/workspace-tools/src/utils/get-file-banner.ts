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

  return `

${commentStart} -------------------------------------------------------------------
${commentStart}
${commentStart}                         ${padding}Storm Software
${commentStart}                 ⚡ ${process.env.STORM_NAMESPACE} - ${name}
${commentStart}
${commentStart} This code was released as part of the ${
    process.env.STORM_NAMESPACE
  } project. ${process.env.STORM_NAMESPACE}
${commentStart} is maintained by Storm Software under the {${
    process.env.STORM_LICENSE ?? "Apache License 2.0"
  }, and is
${commentStart} free for commercial and private use. For more information, please visit
${commentStart} our licensing page.
${commentStart}
${commentStart}    Website: ${
    process.env.STORM_HOMEPAGE ?? "https://stormsoftware.org"
  }
${commentStart}    Repository: ${
    process.env.STORM_REPOSITORY ??
    "https://github.com/storm-software/storm-stack"
  }
${commentStart}    Documentation: https://stormsoftware.org/docs/storm-stack
${commentStart}    Contact: https://stormsoftware.org/contact
${commentStart}    Licensing: https://stormsoftware.org/licensing
${commentStart}
${commentStart} -------------------------------------------------------------------


`;
};
