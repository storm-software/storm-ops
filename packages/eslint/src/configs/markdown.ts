import {
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_IN_MARKDOWN
} from "@storm-software/package-constants/globs";
import markdownlint from "eslint-plugin-markdownlint";
import markdownlintParser from "eslint-plugin-markdownlint/parser";
import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem
} from "../types";

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_MARKDOWN], overrides = {} } = options;

  return [
    {
      name: "storm/markdown/setup",
      plugins: {
        markdownlint
      }
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      languageOptions: {
        parser: markdownlintParser
      },
      name: "storm/markdown/rules",
      rules: {
        "markdownlint/md001": "error",
        "markdownlint/md003": ["error", { style: "atx" }],
        "markdownlint/md004": ["error", { style: "dash" }],
        "markdownlint/md005": "error",
        "markdownlint/md007": ["error", { indent: 2, start_indented: false }],
        "markdownlint/md009": [
          "error",
          { br_spaces: 0, list_item_empty_lines: false }
        ],
        "markdownlint/md010": ["error", { code_blocks: true }],
        "markdownlint/md011": "error",
        "markdownlint/md012": ["error", { maximum: 1 }],
        "markdownlint/md013": [
          "error",
          {
            code_blocks: false,
            headings: false,
            line_length: 1000,
            tables: false
          }
        ],
        "markdownlint/md014": "error",
        "markdownlint/md018": "error",
        "markdownlint/md019": "error",
        "markdownlint/md020": "error",
        "markdownlint/md021": "error",
        "markdownlint/md022": "off",
        "markdownlint/md023": "error",
        "markdownlint/md024": "off",
        "markdownlint/md025": "off",
        "markdownlint/md026": ["error", { punctuation: ".,:!?" }],
        "markdownlint/md027": "error",
        "markdownlint/md028": "off",
        "markdownlint/md029": ["error", { style: "one_or_ordered" }],
        "markdownlint/md030": [
          "error",
          {
            ol_multi: 1,
            ol_single: 1,
            ul_multi: 1,
            ul_single: 1
          }
        ],
        "markdownlint/md031": "error",
        "markdownlint/md032": "error",
        "markdownlint/md033": "off",
        "markdownlint/md034": "error",
        "markdownlint/md035": ["error", { style: "---" }],
        "markdownlint/md036": "off",
        "markdownlint/md037": "error",
        "markdownlint/md038": "error",
        "markdownlint/md039": "off",
        "markdownlint/md040": "error",
        "markdownlint/md041": "off",
        "markdownlint/md042": "error",
        "markdownlint/md043": "off",
        "markdownlint/md044": "off",
        "markdownlint/md045": "off",
        "markdownlint/md046": ["error", { style: "fenced" }],
        "markdownlint/md047": "error",
        "markdownlint/md048": ["error", { style: "backtick" }],
        "markdownlint/md049": ["error", { style: "consistent" }],
        "markdownlint/md050": ["error", { style: "asterisk" }],
        "markdownlint/md051": "error",
        "markdownlint/md052": ["error", { shortcut_syntax: false }],
        "markdownlint/md053": ["error", { ignored_definitions: ["//"] }],
        "markdownlint/md054": [
          "error",
          {
            autolink: true,
            collapsed: true,
            full: true,
            inline: true,
            shortcut: true,
            url_inline: true
          }
        ],
        "markdownlint/md055": ["error", { style: "consistent" }],
        "markdownlint/md056": "error",
        "markdownlint/md058": "error",
        "markdownlint/md059": "error",

        ...overrides
      }
    }
  ];
}
