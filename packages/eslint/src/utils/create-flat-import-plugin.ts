import { rules, config } from "eslint-plugin-import";

export default {
  meta: {
    name: "eslint-plugin-import",
    version: "2.29.1"
  },
  configs: {
    ...config
  },
  rules: {
    ...rules
  },
  processors: {}
};
