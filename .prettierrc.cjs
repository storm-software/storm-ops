const {
  plugins,
  ...prettierConfig
} = require("./packages/prettier/src/config.json");

module.exports = {
  ...prettierConfig,
  plugins: [...plugins]
};
