export const GLOB_CODE_BLOCK = "**/*.md{,x}/*";
export const GLOB_CODE_FILE = "**/*.{,c,m}{j,t}s{,x}";

export const ACRONYMS_LIST = [
  "API",
  "ASCII",
  "CPU",
  "CSS",
  "DNS",
  "EOF",
  "GUID",
  "HTML",
  "HTTP",
  "HTTPS",
  "ID",
  "IP",
  "JSON",
  "LHS",
  "OEM",
  "PP",
  "QA",
  "RAM",
  "RHS",
  "RPC",
  "RSS",
  "SLA",
  "SMTP",
  "SQL",
  "SSH",
  "SSL",
  "TCP",
  "TLS",
  "TTL",
  "UDP",
  "UI",
  "UID",
  "UUID",
  "URI",
  "URL",
  "UTF",
  "VM",
  "XML",
  "XSS"
];

export const GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
export const GLOB_SRC_FILE = `*.${GLOB_SRC_EXT}`;
export const GLOB_SRC = `**/${GLOB_SRC_FILE}`;

export const GLOB_JS_EXT = "?([cm])js";
export const GLOB_JS_FILE = `*.${GLOB_JS_EXT}`;
export const GLOB_JS = `**/${GLOB_JS_FILE}`;

export const GLOB_JSX_EXT = "?([cm])jsx";
export const GLOB_JSX_FILE = `*.${GLOB_JSX_EXT}`;
export const GLOB_JSX = `**/${GLOB_JSX_FILE}`;

export const GLOB_TS_EXT = "?([cm])ts";
export const GLOB_TS_FILE = `*.${GLOB_TS_EXT}`;
export const GLOB_TS = `**/${GLOB_TS_FILE}`;

export const GLOB_TSX_EXT = "?([cm])tsx";
export const GLOB_TSX_FILE = `*.${GLOB_TSX_EXT}`;
export const GLOB_TSX = `**/${GLOB_TSX_FILE}`;

export const GLOB_STYLE_EXT = "{c,le,sc}ss";
export const GLOB_STYLE_FILE = `*.${GLOB_STYLE_EXT}`;
export const GLOB_STYLE = `**/${GLOB_STYLE_FILE}`;

export const GLOB_CSS_EXT = "css";
export const GLOB_CSS_FILE = `*.${GLOB_CSS_EXT}`;
export const GLOB_CSS = `**/${GLOB_CSS_FILE}`;

export const GLOB_POSTCSS_EXT = "{p,post}css";
export const GLOB_POSTCSS_FILE = `*.${GLOB_POSTCSS_EXT}`;
export const GLOB_POSTCSS = `**/${GLOB_POSTCSS_FILE}`;

export const GLOB_LESS_EXT = "less";
export const GLOB_LESS_FILE = `*.${GLOB_LESS_EXT}`;
export const GLOB_LESS = `**/${GLOB_LESS_FILE}`;

export const GLOB_SCSS_EXT = "scss";
export const GLOB_SCSS_FILE = `*.${GLOB_SCSS_EXT}`;
export const GLOB_SCSS = `**/${GLOB_SCSS_FILE}`;

export const GLOB_JSON_EXT = "json";
export const GLOB_JSON_FILE = `*.${GLOB_JSON_EXT}`;
export const GLOB_JSON = `**/${GLOB_JSON_FILE}`;

export const GLOB_JSON5_EXT = "json5";
export const GLOB_JSON5_FILE = `*.${GLOB_JSON5_EXT}`;
export const GLOB_JSON5 = `**/${GLOB_JSON5_FILE}`;

export const GLOB_JSONC_EXT = "jsonc";
export const GLOB_JSONC_FILE = `*.${GLOB_JSONC_EXT}`;
export const GLOB_JSONC = `**/${GLOB_JSONC_FILE}`;

export const GLOB_MARKDOWN_EXT = "md";
export const GLOB_MARKDOWN_FILE = `*.${GLOB_MARKDOWN_EXT}`;
export const GLOB_MARKDOWN = `**/${GLOB_MARKDOWN_FILE}`;

export const GLOB_MDX_EXT = "mdx";
export const GLOB_MDX_FILE = `*.${GLOB_MDX_EXT}`;
export const GLOB_MDX = `**/${GLOB_MDX_FILE}`;
export const GLOB_MARKDOWN_IN_MARKDOWN = `${GLOB_MARKDOWN}/${GLOB_MARKDOWN_FILE}`;

export const GLOB_SVELTE_EXT = "svelte";
export const GLOB_SVELTE_FILE = `*.${GLOB_SVELTE_EXT}`;
export const GLOB_SVELTE = `**/${GLOB_SVELTE_FILE}`;

export const GLOB_VUE_EXT = "vue";
export const GLOB_VUE_FILE = `*.${GLOB_VUE_EXT}`;
export const GLOB_VUE = `**/${GLOB_VUE_FILE}`;

export const GLOB_YAML_EXT = "y?(a)ml";
export const GLOB_YAML_FILE = `*.${GLOB_YAML_EXT}`;
export const GLOB_YAML = `**/${GLOB_YAML_FILE}`;

export const GLOB_TOML_EXT = "toml";
export const GLOB_TOML_FILE = `*.${GLOB_TOML_EXT}`;
export const GLOB_TOML = `**/${GLOB_TOML_FILE}`;

export const GLOB_XML_EXT = "xml";
export const GLOB_XML_FILE = `*.${GLOB_XML_EXT}`;
export const GLOB_XML = `**/${GLOB_XML_FILE}`;

export const GLOB_SVG_EXT = "svg";
export const GLOB_SVG_FILE = `*.${GLOB_SVG_EXT}`;
export const GLOB_SVG = `**/${GLOB_SVG_FILE}`;

export const GLOB_HTML_EXT = "htm?(l)";
export const GLOB_HTML_FILE = `*.${GLOB_HTML_EXT}`;
export const GLOB_HTML = `**/${GLOB_HTML_FILE}`;

export const GLOB_ASTRO_EXT = "astro";
export const GLOB_ASTRO_FILE = `*.${GLOB_ASTRO_EXT}`;
export const GLOB_ASTRO = `**/${GLOB_ASTRO_FILE}`;
export const GLOB_ASTRO_TS = `${GLOB_ASTRO}/*.ts`;

export const GLOB_GRAPHQL_EXT = "{g,graph}ql";
export const GLOB_GRAPHQL_FILE = `*.${GLOB_GRAPHQL_EXT}`;
export const GLOB_GRAPHQL = `**/${GLOB_GRAPHQL_FILE}`;

export const GLOB_MARKDOWN_CODE = `${GLOB_MARKDOWN}/${GLOB_SRC}`;

export const GLOB_TESTS = [
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`,
  `**/*.bench.${GLOB_SRC_EXT}`,
  `**/*.benchmark.${GLOB_SRC_EXT}`
];

export const GLOB_ALL_SRC = [
  GLOB_SRC,
  GLOB_STYLE,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_MARKDOWN,
  GLOB_MDX,
  GLOB_SVELTE,
  GLOB_VUE,
  GLOB_YAML,
  GLOB_XML,
  GLOB_HTML
];

export const GLOB_EXCLUDE = [
  "**/.git",
  "**/node_modules",
  "**/dist",
  "**/tmp",
  "**/coverage",
  "**/bench",
  "**/__snapshots__",
  "**/__test__",
  "**/__mocks__",
  "**/__generated__",
  "**/.wrangler",
  "**/.rolldown",
  "**/.docusaurus",
  "**/.tamagui",
  "**/tamagui.css",
  "**/.nx",
  "**/.next",
  "**/.storm",
  "**/.powerlines",
  "**/.shell-shock",
  "**/.earthquake",
  "**/.aftershock",
  "**/workbox*.js",
  "**/sw*.js",
  "**/service-worker.js",
  "**/fallback*.js",
  "**/ios",
  "**/.android",
  "**/.DS_Store",
  "**/Thumbs.db",
  "**/.cspellcache",
  "**/package-lock.*",
  "**/npm-lock.*",
  "**/pnpm-lock.*",
  "**/bun.lockb",
  "**/cargo.lock",
  "**/next-env.d.ts",
  "**/CODEOWNERS",
  "**/yarn.lock",
  "**/jest.config.js",
  "**/jest.setup.js",
  "**/jest.config.ts",
  "**/jest.setup.ts",
  "**/jest.config.json",
  "**/jest.setup.json",
  "**/*.spec.{ts,tsx}",
  "**/*.test.{ts,tsx}",
  "**/output",
  "**/temp",
  "**/.temp",
  "**/.history",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.svelte-kit",
  "**/.vercel",
  "**/.changeset",
  "**/.idea",
  "**/.cache",
  "**/.vite-inspect",
  "**/.yarn",
  "**/*.min.*",
  "**/CHANGELOG*.md",
  "**/CONTRIBUTING.md",
  "**/SECURITY.md",
  "**/CODE_OF_CONDUCT.md",
  "**/PULL_REQUEST_TEMPLATE.md",
  "**/LICENSE*",
  "**/auto-import?(s).d.ts",
  "**/components.d.ts",
  "**/vite.config.*.timestamp-*",
  "**/webpack.config.*.timestamp-*",
  "**/rollup.config.*.timestamp-*",
  "**/nx/**/schema.d.ts",
  "**/nx/**/schema.json",
  "**/nx/**/schema.md",
  "**/nx/**/*.schema.d.ts",
  "**/nx/**/*.schema.json",
  "**/nx/**/*.schema.md",
  "**/nx/**/generators/**/files",
  ".agents/**/*",
  "**/.agents/**/*",
  ".claude/**/*",
  "**/.claude/**/*",
  ".codex/**/*",
  "**/.codex/**/*",
  ".cursor/**/*",
  "**/.cursor/**/*",
  ".opencode/**/*",
  "**/.opencode/**/*",
  ".nx/**/*",
  "**/.nx/**/*"
];
