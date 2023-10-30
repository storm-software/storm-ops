module.exports = {
  "$schema":
    "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
  version: "0.2",
  name: "Storm cspell settings",
  id: "storm-cspell",
  description: "Default cspell configuration used by Storm Software.",
  language: "en",
  caseSensitive: false,
  enabledLanguageIds: [
    "typescript",
    "javascript",
    "typescriptreact",
    "javascriptreact",
    "mdx",
    "json",
    "jsonc",
    "html",
    "handlebars",
    "markdown"
  ],
  maxNumberOfProblems: 10000,
  dictionaryDefinitions: [
    {
      // The name of the dictionary is used to look it up.
      name: "storm",
      // Path to the custom word file. Relative to this `cspell.json` file.
      path: "./dictionary.txt",
      // Some editor extensions will use `addWords` for adding words to your
      // personal dictionary.
      addWords: true
    }
  ],
  dictionaries: [
    "storm",
    "companies",
    "softwareTerms",
    "public-licenses",
    "filetypes"
  ],
  flagWords: [],

  // Ignore files that aren't check in to git as well as files that aren't written
  // by hand. Note that we do want to check, say, JSON files (as package.json
  // contains English text like package descriptions).
  useGitignore: true,
  // GitHub Security Advisories
  ignoreRegExpList: ["GHSA-[-\\w]+"],
  overrides: [
    {
      //Ignore anything in a changelog file that looks like a GitHub username.
      filename: "**/CHANGELOG*.md",
      ignoreRegExpList: ["@[-\\w]+"]
    },
    {
      //Ignore the targets of links in Markdown/MDX files.
      filename: "'**/*.md*",
      ignoreRegExpList: ["\\]\\([^)]+\\)"]
    }
  ],
  patterns: [
    {
      name: "HTML-symbol-entity",
      description: "Matches on HTML symbols like `&clubs;`",
      pattern: /&[a-z]+;/g
    },
    {
      name: "MARKDOWN-link-reference",
      description:
        "Markdown reference link: `[This is a link][reference]`, matches `[reference]`",
      pattern: /(?<=\])\[[-\w.`'"*&;#@ ]+\]/g
    },
    {
      name: "MARKDOWN-link-footer",
      description:
        "Markdown referenced link: `[reference]: https://www.google.com`, matches the entire reference.",
      pattern: /\[[-\w.`'"*&;#@ ]+\]:( [^\s]*)?/g
    },
    {
      name: "MARKDOWN-link",
      description: "Markdown link: `[link text](link)`, matches `link`",
      pattern: /(?<=\]\()[^)\s]+/g
    },
    {
      name: "MARKDOWN-anchor",
      description:
        'Markdown Anchors: `<a id="my_link"></a>`, matches `my_link`',
      pattern: /(?<=<a\s+id=")[^"\s]+/g
    }
  ],
  languageSettings: [
    {
      languageId: "javascript,javascriptreact",
      dictionaries: ["storm", "typescript", "node", "npm"]
    },
    {
      languageId: "typescript,typescriptreact,mdx",
      dictionaries: ["storm", "typescript", "node", "npm"]
    },
    {
      languageId: "javascriptreact,typescriptreact,mdx",
      dictionaries: ["storm", "html", "html-symbol-entities", "css", "fonts"]
    },
    {
      languageId: "markdown,asciidoc",
      dictionaries: ["storm", "npm", "html", "html-symbol-entities"]
    },
    {
      languageId: "html,pug,jade,php,handlebars",
      dictionaries: [
        "storm",
        "html",
        "fonts",
        "typescript",
        "css",
        "npm",
        "html-symbol-entities"
      ]
    },
    {
      languageId: "json,jsonc",
      dictionaries: ["storm", "node", "npm"]
    },
    {
      languageId: "php",
      dictionaries: ["storm", "php"]
    },
    {
      languageId: "css,less,scss",
      dictionaries: ["storm", "fonts", "css"]
    },
    {
      languageId: "map",
      enabled: false
    },
    {
      languageId: "image",
      enabled: false
    },
    {
      languageId: "binary",
      enabled: false
    },
    {
      languageId: "markdown,html,mdx",
      ignoreRegExpList: ["HTML-symbol-entity"]
    },
    {
      languageId: "html",
      ignoreRegExpList: ["href"]
    },
    {
      languageId: "markdown",
      ignoreRegExpList: [
        "MARKDOWN-link-reference",
        "MARKDOWN-link-footer",
        "MARKDOWN-link",
        "MARKDOWN-anchor"
      ]
    }
  ],
  import: [
    "@cspell/dict-ada/cspell-ext.json",
    "@cspell/dict-aws/cspell-ext.json",
    "@cspell/dict-bash/cspell-ext.json",
    "@cspell/dict-companies/cspell-ext.json",
    "@cspell/dict-cpp/cspell-ext.json",
    "@cspell/dict-cryptocurrencies/cspell-ext.json",
    "@cspell/dict-csharp/cspell-ext.json",
    "@cspell/dict-css/cspell-ext.json",
    "@cspell/dict-dart/cspell-ext.json",
    "@cspell/dict-django/cspell-ext.json",
    "@cspell/dict-docker/cspell-ext.json",
    "@cspell/dict-dotnet/cspell-ext.json",
    "@cspell/dict-elixir/cspell-ext.json",
    "@cspell/dict-en_us/cspell-ext.json",
    "@cspell/dict-en-common-misspellings/cspell-ext.json",
    "@cspell/dict-en-gb/cspell-ext.json",
    "@cspell/dict-filetypes/cspell-ext.json",
    "@cspell/dict-fonts/cspell-ext.json",
    "@cspell/dict-fsharp/cspell-ext.json",
    "@cspell/dict-fullstack/cspell-ext.json",
    "@cspell/dict-gaming-terms/cspell-ext.json",
    "@cspell/dict-git/cspell-ext.json",
    "@cspell/dict-golang/cspell-ext.json",
    "@cspell/dict-haskell/cspell-ext.json",
    "@cspell/dict-html-symbol-entities/cspell-ext.json",
    "@cspell/dict-html/cspell-ext.json",
    "@cspell/dict-java/cspell-ext.json",
    "@cspell/dict-k8s/cspell-ext.json",
    "@cspell/dict-latex/cspell-ext.json",
    "@cspell/dict-lorem-ipsum/cspell-ext.json",
    "@cspell/dict-lua/cspell-ext.json",
    "@cspell/dict-makefile/cspell-ext.json",
    "@cspell/dict-node/cspell-ext.json",
    "@cspell/dict-npm/cspell-ext.json",
    "@cspell/dict-php/cspell-ext.json",
    "@cspell/dict-powershell/cspell-ext.json",
    "@cspell/dict-public-licenses/cspell-ext.json",
    "@cspell/dict-python/cspell-ext.json",
    "@cspell/dict-r/cspell-ext.json",
    "@cspell/dict-ruby/cspell-ext.json",
    "@cspell/dict-rust/cspell-ext.json",
    "@cspell/dict-scala/cspell-ext.json",
    "@cspell/dict-sql/cspell-ext.json",
    "@cspell/dict-software-terms/cspell-ext.json",
    "@cspell/dict-svelte/cspell-ext.json",
    "@cspell/dict-swift/cspell-ext.json",
    "@cspell/dict-typescript/cspell-ext.json",
    "@cspell/dict-vue/cspell-ext.json"
  ]
};
