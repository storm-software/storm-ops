const isWin = process.platform === "win32";

const escape = input => {
  return input
    .map(function (s) {
      if (s && typeof s === "object") {
        return s.op.replace(/(.)/g, "\\$1");
      }
      if (/["\s]/.test(s) && !/'/.test(s)) {
        return "'" + s.replace(/(['\\])/g, "\\$1") + "'";
      }
      if (/["'\s]/.test(s)) {
        return '"' + s.replace(/(["\\$`!])/g, "\\$1") + '"';
      }
      return String(s).replace(
        /([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g,
        "$1\\$2"
      );
    })
    .join(" ")
    .replace(/\\@/g, "@");
};

module.exports = {
  "**/*.*": fileNames => {
    const escapedFileNames = fileNames
      .map(filename => (isWin ? filename : escape(filename)))
      .join(" ");

    return ["pnpm build", `git add ${escapedFileNames}`];
  },
  "**/*.{js,jsx,ts,tsx,json,css,scss,md,mdx,yml,yaml,graphql,html,prisma,acid,acidic}":
    fileNames => {
      const escapedFileNames = fileNames
        .map(filename => (isWin ? filename : escape(filename)))
        .join(" ");

      return [
        "pnpm lint",
        `prettier --with-node-modules --ignore-path @storm-software/git-tools/prettier/.prettierignore_staged --write ${escapedFileNames}`,
        "pnpm nx format:write --uncommitted",
        `git add ${escapedFileNames}`
      ];
    },
  "**/README.md": fileNames => {
    const escapedFileNames = fileNames
      .map(filename => (isWin ? filename : escape(filename)))
      .join(" ");

    return ["pnpm readme-gen", `git add ${escapedFileNames}`];
  }
};
