module.exports = {
  "proseWrap": "always",
  "trailingComma": "none",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "quoteProps": "preserve",
  "insertPragma": false,
  "bracketSameLine": true,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.md{,x}",
      "options": {
        "semi": false,
        "trailingComma": "none"
      }
    },
    {
      "files": "*.svg",
      "options": {
        "parser": "html"
      }
    },
    { "files": "*.json", "options": { "trailingComma": "none" } },
    {
      "files": "**/*.hbs",
      "options": {
        "parser": "html"
      }
    },
    {
      "files": "**/*.acid",
      "options": {
        "parser": "prisma-parse"
      }
    },
    {
      "files": "**/*.acidic",
      "options": {
        "parser": "prisma-parse"
      }
    }
  ],
  "plugins": [
    "prettier-plugin-sh",
    "prettier-plugin-pkg",
    "prettier-plugin-prisma"
  ],
  "importOrder": [
    "^react(-dom)?$",
    "^next(/.*|$)",
    "<THIRD_PARTY_MODULES>",
    "^(@|\\d|_)",
    "^(?=\\.+)(.(?!\\.(graphql|css|png|svg|jpe?g|webp|avif|wasm|mp4|webm)))+$",
    "^.+\\.(graphql|css|png|svg|jpe?g|webp|avif|wasm|mp4|webm)$"
  ],
  "importOrderParserPlugins": ["typescript", "jsx", "decorators-legacy"]
};
