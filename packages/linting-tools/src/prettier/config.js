const config = {
  plugins: ["prettier-plugin-packagejson", "prettier-plugin-prisma"],
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
      files: "**/*.hbs",
      options: {
        parser: "html"
      }
    },
    {
      files: "**/*.4cast",
      options: {
        parser: "prisma-parse"
      }
    }
  ]
};

module.exports = config;
