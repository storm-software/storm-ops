module.exports = {
  proseWrap: "always",
  trailingComma: "none",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  quoteProps: "preserve",
  insertPragma: false,
  bracketSameLine: true,
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",
  overrides: [
    {
      files: "**/*.md{,x}",
      options: {
        semi: false,
        trailingComma: "none",
      },
    },
    {
      files: "**/*.svg",
      options: {
        parser: "html",
      },
    },
    { files: "**/*.json", options: { trailingComma: "none" } },
    {
      files: "**/*.hbs",
      options: {
        parser: "html",
      },
    },
    {
      files: "**/*.prisma",
      options: {
        parser: "prisma-parse",
      },
    },
    {
      files: "**/{*.acid,*.aci,*.acidic}",
      options: {
        parser: "prisma-parse",
      },
    },
  ],
  plugins: [
    "prettier-plugin-sh",
    "prettier-plugin-pkg",
    "prettier-plugin-prisma",
    "prettier-plugin-organize-imports",
  ],
  organizeImportsSkipDestructiveCodeActions: false,
};
