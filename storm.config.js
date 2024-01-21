module.exports = {
  name: "storm-ops",
  namespace: "storm-software",
  organization: "storm-software",
  preMajor: false,
  ci: true,
  owner: "@storm-software/development",
  worker: "stormie-bot",
  workspaceRoot: "C:\\Development\\storm-ops",
  runtimeDirectory: "node_modules/.storm",
  repository: "https://github.com/storm-software/storm-ops",
  timezone: "America/New_York",
  locale: "en-US",
  logLevel: "debug",
  colors: {
    primary: "#1fb2a6",
    background: "#1d232a",
    success: "#087f5b",
    info: "#0ea5e9",
    warning: "#fcc419",
    error: "#990000",
    fatal: "#7d1a1a"
  },
  extensions: {
    logging: {
      fileName: "storm",
      fileExtension: "log",
      path: "tmp/storm/logs",
      stacktrace: true
    }
  }
};
