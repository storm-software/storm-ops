module.exports = {
  plugins: ["@nx"],
  extends: [
    "plugin:@nx/eslint",
    "plugin:@nx/react",
    "plugin:@nx/next",
    "plugin:@nx/typescript",
    "plugin:@nx/javascript",
    "plugin:@nx/prettier"
  ],
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-restricted-imports": ["error", "create-nx-workspace"],
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["nx/src/plugins/js*"],
            "message":
              "Imports from 'nx/src/plugins/js' are not allowed. Use '@nx/js' instead"
          },
          {
            "group": ["**/native-bindings", "**/native-bindings.js", ""],
            "message":
              "Direct imports from native-bindings.js are not allowed. Import from index.js instead."
          }
        ]
      }
    ]
  },
  overrides: [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "checkDynamicDependenciesExceptions": [".*"],
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["plugin:@nx/typescript"],
      "rules": {}
    },
    {
      "files": ["*.js", "*.jsx"],
      "extends": ["plugin:@nx/javascript"],
      "rules": {}
    },
    {
      "files": ["*.spec.ts", "*.spec.tsx", "*.spec.js", "*.spec.jsx"],
      "env": {
        "jest": true
      },
      "rules": {}
    }
  ]
};
