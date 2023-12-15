import type { Config, Dictionary, Platform } from "style-dictionary/types";
import type { Config as TailwindConfig } from "tailwindcss/types";

export type ConfigType = "tailwindcss" | "tamagui" | "all";
export const ConfigType = {
  TAILWINDCSS: "tailwindcss" as ConfigType,
  TAMAGUI: "tamagui" as ConfigType,
  ALL: "all" as ConfigType
};

export interface CreateConfigOptions {
  /**
   * The path to the tokens json file(s) exported from Figma Tokens Studio.
   */
  inputPath: string | string[];

  /**
   * The type of code to generate based on the supplied tokens (TailWind CSS, Tamagui, etc.)
   */
  type: ConfigType;
}

export type TailwindOptions = Pick<TailwindConfig, "content" | "darkMode"> & {
  plugins: Array<
    "typography" | "forms" | "aspect-ratio" | "line-clamp" | "container-queries"
  >;
};
export type TailwindFormatType = "js" | "cjs";

export type SdTailwindConfigType = {
  type?: "all" | string;
  formatType?: TailwindFormatType;
  excludeCompTokensOnType?: string[];
  isVariables?: boolean;
  isPreset?: boolean;
  source?: Config["source"];
  transforms?: Platform["transforms"];
  buildPath?: Platform["buildPath"];
  tailwind?: Partial<TailwindOptions>;
};

export type TailwindFormatObjType = Pick<
  SdTailwindConfigType,
  "type" | "isVariables" | "isPreset" | "excludeCompTokensOnType" | "tailwind"
> & {
  dictionary: Dictionary;
  formatType: TailwindFormatType;
};

export const DESIGN_COMPONENT_LIST = [
  "accordion",
  // "avatar",
  "badge",
  "breadcrumb",
  "button",
  "card",
  "checkbox",
  // "chip",
  "datepicker",
  "divider",
  "drawer",
  "text",
  "heading",
  "icon",
  "input",
  // "list",
  "link",
  //  "menu",
  "modal",
  "file-upload",
  "message-bar",
  //  "navbar",
  "notification",
  //  "pagination",
  //  "popover",
  "progress-tracker",
  "radio",
  "rating",
  "select",
  "skeleton",
  //  "slider",
  "section",
  "spinner",
  //  "stepper",
  //  "switch",
  //  "table",
  //  "tabs",
  //  "tag",
  "textarea",
  "toast"
  //  "tooltip",
  //  "tree",
];

export const TOKEN_PREFIX = "i";
export const SYS_TOKEN_PREFIX = "sys";
export const REF_TOKEN_PREFIX = "ref";
