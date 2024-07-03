export const ignores = [
  "**/.git/**",
  "**/node_modules/**",
  "**/src/generators/**/files/**/*",

  "**/dist/**",
  "**/tmp/**",
  "**/coverage/**",
  "**/bench/**",
  "**/.wrangler/**",
  "**/.docusaurus/**",
  "**/.tamagui/**",
  "**/tamagui.css",
  "**/.nx/**",
  "**/.next/**",
  "**/workbox*.js",
  "**/sw*.js",
  "**/service-worker.js",
  "**/fallback*.js",
  "**/ios/**",
  "**/.android/**",
  "**/.DS_Store/**",
  "**/Thumbs.db/**",
  "**/.cspellcache",

  "**/package-lock.*",
  "**/npm-lock.*",
  "**/pnpm-lock.*",
  "**/pnpm-lock.*",
  "**/bun.lockb",
  "**/cargo.lock",

  "**/next-env.d.ts",
  "**/CODEOWNERS"
];