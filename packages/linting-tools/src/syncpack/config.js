/** @type {import("syncpack").RcFile} */
export const config = {
  customTypes: {
    engines: {
      strategy: "versionsByName",
      path: "engines"
    },
    packageManager: {
      strategy: "name@version",
      path: "packageManager"
    },
    nodeEngine: {
      strategy: "version",
      path: "engines.node"
    }
  },
  dependencyTypes: ["**"],
  formatBugs: true,
  formatRepository: true,
  indent: "  ",
  semverGroups: [],
  sortAz: [
    "bin",
    "contributors",
    "dependencies",
    "devDependencies",
    "keywords",
    "peerDependencies",
    "resolutions",
    "scripts"
  ],
  sortExports: [
    "types",
    "node-addons",
    "node",
    "browser",
    "import",
    "require",
    "development",
    "production",
    "default"
  ],
  sortFirst: ["name", "description", "version", "author"],
  sortPackages: true,
  specifierTypes: ["**"],
  versionGroups: [
    {
      label: "@types packages should only be under devDependencies",
      dependencies: ["@types/**"],
      dependencyTypes: ["!dev"],
      isBanned: true
    },
    {
      label:
        "Ensure semver ranges for locally developed packages satisfy the local version",
      dependencies: ["$LOCAL"],
      dependencyTypes: ["dev"],
      pinVersion: ["workspace-protocol"]
    }
  ]
};
