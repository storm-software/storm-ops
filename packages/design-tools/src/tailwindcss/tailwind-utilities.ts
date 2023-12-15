import type { TailwindOptions } from "../types";

export const getTemplateConfigByType = (
  content: string,
  isPreset: boolean,
  darkMode: TailwindOptions["darkMode"] = ["class", "[data-mode='dark']"],
  tailwindContent: TailwindOptions["content"],
  plugins: string[]
) => {
  if (isPreset) {
    return `module.exports = {
  theme: {
    extend: ${content},
  },
  plugins: [${plugins}]
}`;
  }

  const getTemplateConfig = () => {
    let config = `{
  mode: "jit",
  content: [${tailwindContent}, createGlobPatternsForDependencies(__dirname)],
  darkMode: "${darkMode}",
  blocklist: [],
  theme: {
    extend: ${content},
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  `;

    if (plugins.length > 0) {
      config += `\n plugins: [${plugins}]`;
    }

    return config + "\n}";
  };

  const configs = `
const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = ${getTemplateConfig()}`;

  return configs;
};
