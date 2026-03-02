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
export const GLOB_SRC = "**/*.?([cm])[jt]s?(x)";

export const GLOB_JS = "**/*.?([cm])js";
export const GLOB_JSX = "**/*.?([cm])jsx";

export const GLOB_TS = "**/*.?([cm])ts";
export const GLOB_TSX = "**/*.?([cm])tsx";

export const GLOB_STYLE = "**/*.{c,le,sc}ss";
export const GLOB_CSS = "**/*.css";
export const GLOB_POSTCSS = "**/*.{p,post}css";
export const GLOB_LESS = "**/*.less";
export const GLOB_SCSS = "**/*.scss";

export const GLOB_JSON = "**/*.json";
export const GLOB_JSON5 = "**/*.json5";
export const GLOB_JSONC = "**/*.jsonc";

export const GLOB_MARKDOWN = "**/*.md";
export const GLOB_MDX = "**/*.mdx";
export const GLOB_MARKDOWN_IN_MARKDOWN = "**/*.md/*.md";
export const GLOB_SVELTE = "**/*.svelte";
export const GLOB_VUE = "**/*.vue";
export const GLOB_YAML = "**/*.y?(a)ml";
export const GLOB_TOML = "**/*.toml";
export const GLOB_XML = "**/*.xml";
export const GLOB_SVG = "**/*.svg";
export const GLOB_HTML = "**/*.htm?(l)";
export const GLOB_ASTRO = "**/*.astro";
export const GLOB_ASTRO_TS = "**/*.astro/*.ts";
export const GLOB_GRAPHQL = "**/*.{g,graph}ql";

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
  "**/__snapshots__",
  "**/auto-import?(s).d.ts",
  "**/components.d.ts",
  "**/vite.config.*.timestamp-*",
  "**/webpack.config.*.timestamp-*",
  "**/rollup.config.*.timestamp-*",
  "**/nx/**/?(.)schema.d.ts",
  "**/nx/**/?(.)schema.json",
  "**/nx/**/?(.)schema.md",
  "**/nx/**/generators/**/files"
];
