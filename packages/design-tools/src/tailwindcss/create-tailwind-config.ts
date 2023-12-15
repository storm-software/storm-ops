import { CreateConfigOptions } from "../types";
import { formatTailwindConfig } from "./format-tailwind-config";

export const createTailwindConfig = ({ inputPath }: CreateConfigOptions) => {
  const config = formatTailwindConfig({
    source: Array.isArray(inputPath) ? inputPath : [inputPath],
    isPreset: true,
    excludeCompTokensOnType: [
      "spacing",
      "borderWidth",
      "shadow",
      "boxShadow",
      "opacity",
      "fontSizes"
    ],
    tailwind: {
      "content": ["./src/**/*.{js,ts,jsx,tsx}"],
      "plugins": ["typography", "forms"]
    }
  });

  return {
    ...config,
    platforms: {
      ...config.platforms,
      css: {
        transformGroup: "css",
        buildPath: "./styles/",
        files: [
          {
            destination: "tailwind.css",
            format: "css/variables"
          }
        ]
      }
    }
  };
};
