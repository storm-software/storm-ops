import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import react from "./base";
import { formatConfig } from "./utils/format-config";

const config: Linter.FlatConfig[] = [
  ...react,
  importPlugin.configs["react-native"],
];

export default formatConfig("React Native", config);
