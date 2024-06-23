import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import base from "./base";
import { formatConfig } from "./utils/format-config";

const config: Linter.FlatConfig[] = [...base, importPlugin.configs.electron];

export default formatConfig("Electron", config);
