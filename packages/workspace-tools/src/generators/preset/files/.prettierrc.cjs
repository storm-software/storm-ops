const {
  plugins,
  ...prettierConfig
} = require("@storm-software/prettier/src/config.json");

module.exports = {
  ...prettierConfig,
  plugins: [...plugins]
};
