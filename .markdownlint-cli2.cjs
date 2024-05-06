const options = require("./dist/packages/markdownlint/index.js").init({
  "default": true,
  "line-length": false
});

module.exports = {
  config: options,
  customRules: ["./dist/packages/markdownlint/index.js"]
};
