export const markdownlintConfig = {
  $schema:
    "https://raw.githubusercontent.com/DavidAnson/markdownlint/v0.37.4/schema/markdownlint-config-schema.json",
  "header-increment": true,
  "first-header-h1": false,
  "heading-style": {
    style: "atx"
  },
  "ul-style": {
    style: "dash"
  },
  "list-indent": true,
  "ul-start-left": false,
  "ul-indent": {
    indent: 2,
    start_indented: true
  },
  "no-trailing-spaces": {
    br_spaces: 0,
    list_item_empty_lines: false
  },
  "no-hard-tabs": {
    code_blocks: true
  },
  "no-reversed-links": true,
  "no-multiple-blanks": {
    maximum: 1
  },
  "line-length": {
    tables: false,
    code_blocks: true,
    headings: true,
    line_length: 80,
    heading_line_length: 80,
    code_block_line_length: 80
  },
  "commands-show-output": true,
  "no-missing-space-atx": true,
  "no-multiple-space-atx": true,
  "no-missing-space-closed-atx": true,
  "no-multiple-space-closed-atx": true,
  "blanks-around-headers": false,
  "header-start-left": true,
  "no-duplicate-heading": true,
  "single-h1": false,
  "no-trailing-punctuation": {
    punctuation: ".,:!?"
  },
  "no-multiple-space-blockquote": true,
  "no-blanks-blockquote": false,
  "ol-prefix": {
    style: "one"
  },
  "list-marker-space": {
    ul_single: 1,
    ol_single: 1,
    ul_multi: 1,
    ol_multi: 1
  },
  "no-empty-code-blocks": true,
  "no-empty-lists": true,
  "no-inline-html": false,
  "no-bare-urls": true,
  "hr-style": {
    style: "---"
  },
  "no-emphasis-as-header": false,
  "no-space-in-emphasis": true,
  "no-space-in-code": true,
  "no-space-in-links": false,
  "fenced-code-language": true,
  "first-line-h1": false,
  "no-empty-links": true,
  "required-headers": false,
  "proper-names": false,
  "no-alt-text": false,
  "code-block-style": {
    style: "fenced"
  },
  "single-trailing-newline": true,
  "code-fence-style": {
    style: "backtick"
  },
  "emphasis-style": {
    style: "consistent"
  },
  "strong-style": {
    style: "asterisk"
  },
  "link-fragments": true,
  "reference-links-images": {
    shortcut_syntax: false
  },
  "link-image-reference-definitions": {
    ignored_definitions: ["//"]
  },
  "link-image-style": {
    autolink: true,
    collapsed: true,
    full: true,
    inline: true,
    shortcut: true,
    url_inline: true
  },
  "table-pipe-style": {
    style: "consistent"
  },
  "table-column-count": true,
  "blanks-around-tables": true,
  "spaces-around-links": {
    both: true
  }
};
