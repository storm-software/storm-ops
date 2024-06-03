const {
  plugins,
  ...prettierConfig
} = require("@storm-software/prettier/config.json");

module.exports = {
  ...prettierConfig,
  plugins: [...plugins]
};
