import type { Linter } from "eslint";

const config: Linter.RulesRecord = {
  /**
   * Disallow non-import statements appearing before import statements.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
   */
  "import/first": "warn",

  /**
   * Require a newline after the last import/require.
   *
   * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
   */
  "import/newline-after-import": "warn",

  /**
   * Disallow import of modules using absolute paths.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-absolute-path.md
   */
  "import/no-absolute-path": "error",

  /**
   * Disallow default exports.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-default-export.md
   */
  "import/no-default-export": "error",

  /**
   * Disallow the use of extraneous packages.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
   */
  "import/no-extraneous-dependencies": [
    "error",
    { includeInternal: true, includeTypes: true },
  ],

  /**
   * Disallow mutable exports.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md
   */
  "import/no-mutable-exports": "error",

  /**
   * Disallow importing packages through relative paths.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md
   */
  "import/no-relative-packages": "warn",

  /**
   * Disallow a module from importing itself.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md
   */
  "import/no-self-import": "error",

  /**
   * Ensures that there are no useless path segments.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
   */
  "import/no-useless-path-segments": ["error"],

  /**
   * Enforce a module import order convention.
   *
   * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
   */
  "import/order": [
    "warn",
    {
      groups: [
        "builtin", // Node.js built-in modules
        "external", // Packages
        "internal", // Aliased modules
        "parent", // Relative parent
        "sibling", // Relative sibling
        "index", // Relative index
      ],
      "newlines-between": "never",
    },
  ],

  "import/extensions": ["error", "ignorePackages"], // Bob when bundling requires to have `.js` extension
  "import/prefer-default-export": "off", // disable opposite of 'import/no-default-export'

  // Reports any imports that come after non-import statements
  // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
  "import/no-duplicates": "error",

  // ensure imports point to files/modules that can be resolved
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
  "import/no-unresolved": "off",

  // ensure named imports coupled with named exports
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/named.md#when-not-to-use-it
  "import/named": "error",

  // ensure default import coupled with default export
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/default.md#when-not-to-use-it
  "import/default": "off",

  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/namespace.md
  "import/namespace": "off",

  // Helpful warnings:

  // disallow invalid exports, e.g. multiple defaults
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/export.md
  "import/export": "error",

  // do not allow a default import name to match a named export
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
  "import/no-named-as-default": "error",

  // warn on accessing default export property names that are also named exports
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
  "import/no-named-as-default-member": "error",

  // disallow use of jsdoc-marked-deprecated imports
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
  "import/no-deprecated": "off",

  // Forbid the use of extraneous packages
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
  // paths are treated both as absolute paths, and relative to process.cwd()
  // "import/no-extraneous-dependencies": [
  //   "error",
  //   {
  //     devDependencies: [
  //       "test/**", // tape, common npm pattern
  //       "tests/**", // also common npm pattern
  //       "spec/**", // mocha, rspec-like pattern
  //       "**/__tests__/**", // jest pattern
  //       "**/__mocks__/**", // jest pattern
  //       "test.{js,jsx}", // repos with a single test file
  //       "test-*.{js,jsx}", // repos with multiple top-level test files
  //       "**/*{.,_}{test,spec}.{js,jsx}", // tests where the extension or filename suffix denotes that it is a test
  //       "**/jest.config.js", // jest config
  //       "**/jest.setup.js", // jest setup
  //       "**/vue.config.js", // vue-cli config
  //       "**/webpack.config.js", // webpack config
  //       "**/webpack.config.*.js", // webpack config
  //       "**/rollup.config.js", // rollup config
  //       "**/rollup.config.*.js", // rollup config
  //       "**/gulpfile.js", // gulp config
  //       "**/gulpfile.*.js", // gulp config
  //       "**/Gruntfile{,.js}", // grunt config
  //       "**/protractor.conf.js", // protractor config
  //       "**/protractor.conf.*.js", // protractor config
  //       "**/karma.conf.js", // karma config
  //       "**/.eslintrc.js" // eslint config
  //     ],
  //     optionalDependencies: false
  //   }
  // ],

  // Module systems:

  // disallow require()
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
  "import/no-commonjs": "off",

  // disallow AMD require/define
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-amd.md
  "import/no-amd": "error",

  // No Node.js builtin modules
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-nodejs-modules.md
  // TODO: enable?
  "import/no-nodejs-modules": "off",

  // Style guide:

  // disallow non-import statements appearing before import statements
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/imports-first.md
  // deprecated: use `import/first`
  "import/imports-first": "off",

  // disallow namespace imports
  // TODO: enable?
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
  "import/no-namespace": "off",

  // Restrict which files can be imported in a given folder
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md
  "import/no-restricted-paths": "off",

  // Forbid modules to have too many dependencies
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/max-dependencies.md
  "import/max-dependencies": ["warn", { max: 50 }],

  // Forbid require() calls with expressions
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
  "import/no-dynamic-require": "error",

  // prevent importing the submodules of other modules
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
  "import/no-internal-modules": [
    "off",
    {
      allow: [],
    },
  ],

  // Warn if a module could be mistakenly parsed as a script by a consumer
  // leveraging Unambiguous JavaScript Grammar
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/unambiguous.md
  // this should not be enabled until this proposal has at least been *presented* to TC39.
  // At the moment, it's not a thing.
  "import/unambiguous": "off",

  // Forbid Webpack loader syntax in imports
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
  "import/no-webpack-loader-syntax": "error",

  // Prevent unassigned imports
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md
  // importing for side effects is perfectly acceptable, if you need side effects.
  "import/no-unassigned-import": "off",

  // Prevent importing the default as if it were named
  // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-default.md
  "import/no-named-default": "error",

  // Reports if a module's default export is unnamed
  // https://github.com/import-js/eslint-plugin-import/blob/d9b712ac7fd1fddc391f7b234827925c160d956f/docs/rules/no-anonymous-default-export.md
  "import/no-anonymous-default-export": [
    "off",
    {
      allowArray: false,
      allowArrowFunction: false,
      allowAnonymousClass: false,
      allowAnonymousFunction: false,
      allowLiteral: false,
      allowObject: false,
    },
  ],

  // This rule enforces that all exports are declared at the bottom of the file.
  // https://github.com/import-js/eslint-plugin-import/blob/98acd6afd04dcb6920b81330114e146dc8532ea4/docs/rules/exports-last.md
  // TODO: enable?
  "import/exports-last": "off",

  // Reports when named exports are not grouped together in a single export declaration
  // or when multiple assignments to CommonJS module.exports or exports object are present
  // in a single file.
  // https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/group-exports.md
  "import/group-exports": "off",

  // Prohibit named exports. this is a terrible rule, do not use it.
  // https://github.com/import-js/eslint-plugin-import/blob/1ec80fa35fa1819e2d35a70e68fb6a149fb57c5e/docs/rules/no-named-export.md
  "import/no-named-export": "off",

  /**
   * Disallow cyclical dependencies between modules.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
   */
  "import/no-cycle": ["error", { maxDepth: "∞" }],

  // dynamic imports require a leading comment with a webpackChunkName
  // https://github.com/import-js/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/dynamic-import-chunkname.md
  "import/dynamic-import-chunkname": [
    "off",
    {
      importFunctions: [],
      webpackChunknameFormat: "[0-9a-zA-Z-_/.]+",
    },
  ],

  // Use this rule to prevent imports to folders in relative parent paths.
  // https://github.com/import-js/eslint-plugin-import/blob/c34f14f67f077acd5a61b3da9c0b0de298d20059/docs/rules/no-relative-parent-imports.md
  "import/no-relative-parent-imports": "off",

  // Reports modules without any exports, or with unused exports
  // https://github.com/import-js/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
  // TODO: enable once it supports CJS
  "import/no-unused-modules": [
    "off",
    {
      ignoreExports: [],
      missingExports: true,
      unusedExports: true,
    },
  ],

  // Reports the use of import declarations with CommonJS exports in any module except for the main module.
  // https://github.com/import-js/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-import-module-exports.md
  "import/no-import-module-exports": [
    "error",
    {
      exceptions: [],
    },
  ],

  // enforce a consistent style for type specifiers (inline or top-level)
  // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/consistent-type-specifier-style.md
  // TODO, semver-major: enable (just in case)
  "import/consistent-type-specifier-style": ["off", "prefer-inline"],

  // Reports the use of empty named import blocks.
  // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/no-empty-named-blocks.md
  // TODO, semver-minor: enable
  "import/no-empty-named-blocks": "off",
};

export default config;
