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
      files: "**/{*.ts,*.tsx,*.mts,*.cts}",
      options: {
        parser: "typescript",
        singleQuote: false,
        trailingComma: "none"
      }
    },
    {
      files: "**/*.mdx",
      options: {
        semi: false,
        trailingComma: "none",
        parser: "mdx"
      }
    },
    {
      files: "**/*.md",
      options: {
        semi: false,
        trailingComma: "none",
        parser: "markdown"
      }
    },
    {
      files: "**/*.toml",
      options: {
        parser: "toml",
        alignEntries: true,
        alignComments: true,
        arrayAutoExpand: true,
        arrayAutoCollapse: true,
        compactArrays: true,
        compactInlineTables: false,
        compactEntries: false,
        indentTables: false,
        indentEntries: false,
        reorderKeys: false,
        allowedBlankLines: 1
      }
    },
    {
      files: "**/*.svg",
      options: {
        parser: "html"
      }
    },
    { files: "**/*.json", options: { trailingComma: "none" } },
    {
      files: "**/*.hbs",
      options: {
        parser: "html"
      }
    }
  ],
  plugins: [
    "prettier-plugin-sh",
    "prettier-plugin-pkg",
    "prettier-plugin-toml",
    "prettier-plugin-organize-imports",
    "prettier-plugin-prisma"
  ],
  organizeImportsSkipDestructiveCodeActions: false
};
