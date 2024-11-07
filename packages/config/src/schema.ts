import z from "zod";
import {
  STORM_DEFAULT_DOCS,
  STORM_DEFAULT_HOMEPAGE,
  STORM_DEFAULT_LICENSING
} from "./constants";

const DarkColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#1d1e22")
  .describe("The dark background color of the workspace");
const LightColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#f4f4f5")
  .describe("The light background color of the workspace");
const BrandColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#1fb2a6")
  .describe("The primary brand specific color of the workspace");
const AlternateColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .optional()
  .describe("The alternate brand specific color of the workspace");
const AccentColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .optional()
  .describe("The secondary brand specific color of the workspace");
const LinkColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .optional()
  .describe("The color used to display hyperlink text");
const HelpColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#8256D0")
  .describe("The second brand specific color of the workspace");
const SuccessColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#12B66A")
  .describe("The success color of the workspace");
const InfoColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#0070E0")
  .describe("The informational color of the workspace");
const WarningColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#fcc419")
  .describe("The warning color of the workspace");
const DangerColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#D8314A")
  .describe("The danger color of the workspace");
const FatalColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .optional()
  .describe("The fatal color of the workspace");
const PositiveColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#4ade80")
  .describe("The positive number color of the workspace");
const NegativeColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}){1,2}$/i)
  .length(7)
  .default("#ef4444")
  .describe("The negative number color of the workspace");

export const DarkThemeColorConfigSchema = z.object({
  foreground: LightColorSchema,
  background: DarkColorSchema,
  brand: BrandColorSchema,
  alternate: AlternateColorSchema,
  accent: AccentColorSchema,
  link: LinkColorSchema,
  help: HelpColorSchema,
  success: SuccessColorSchema,
  info: InfoColorSchema,
  warning: WarningColorSchema,
  danger: DangerColorSchema,
  fatal: FatalColorSchema,
  positive: PositiveColorSchema,
  negative: NegativeColorSchema
});

export const LightThemeColorConfigSchema = z.object({
  foreground: DarkColorSchema,
  background: LightColorSchema,
  brand: BrandColorSchema,
  alternate: AlternateColorSchema,
  accent: AccentColorSchema,
  link: LinkColorSchema,
  help: HelpColorSchema,
  success: SuccessColorSchema,
  info: InfoColorSchema,
  warning: WarningColorSchema,
  danger: DangerColorSchema,
  fatal: FatalColorSchema,
  positive: PositiveColorSchema,
  negative: NegativeColorSchema
});

export const MultiThemeColorConfigSchema = z.object({
  dark: DarkThemeColorConfigSchema,
  light: LightThemeColorConfigSchema
});

export const SingleThemeColorConfigSchema = z.object({
  dark: DarkColorSchema,
  light: LightColorSchema,
  brand: BrandColorSchema,
  alternate: AlternateColorSchema,
  accent: AccentColorSchema,
  link: LinkColorSchema,
  help: HelpColorSchema,
  success: SuccessColorSchema,
  info: InfoColorSchema,
  warning: WarningColorSchema,
  danger: DangerColorSchema,
  fatal: FatalColorSchema,
  positive: PositiveColorSchema,
  negative: NegativeColorSchema
});

export const RegistryUrlConfigSchema = z
  .string()
  .trim()
  .toLowerCase()
  .url()
  .optional()
  .describe("A remote registry URL used to publish distributable packages");

export const RegistryConfigSchema = z
  .object({
    github: RegistryUrlConfigSchema,
    npm: RegistryUrlConfigSchema,
    cargo: RegistryUrlConfigSchema,
    cyclone: RegistryUrlConfigSchema,
    container: RegistryUrlConfigSchema
  })
  .default({})
  .describe("A list of remote registry URLs used by Storm Software");

/**
 * Storm theme color config values used for styling various workspace elements
 */
export const ColorConfigSchema = SingleThemeColorConfigSchema.or(
  MultiThemeColorConfigSchema
).describe("Colors used for various workspace elements");

export const ColorConfigMapSchema = z.union([
  z.object({ "base": ColorConfigSchema }),
  z.record(z.string(), ColorConfigSchema)
]);

/**
 * Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
 */
export const StormConfigSchema = z
  .object({
    $schema: z
      .string()
      .trim()
      .default(
        "https://cdn.jsdelivr.net/npm/@storm-software/config/schemas/storm.schema.json"
      )
      .describe(
        "The URL to the JSON schema file that describes the Storm configuration file"
      ),
    extends: z
      .string()
      .trim()
      .optional()
      .describe(
        "The path to a base JSON file to use as a configuration preset file"
      ),
    name: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .describe("The name of the package"),
    namespace: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .describe("The namespace of the package"),
    organization: z
      .string()
      .trim()
      .default("storm-software")
      .describe("The organization of the workspace"),
    repository: z
      .string()
      .trim()
      .url()
      .optional()
      .describe("The repo URL of the workspace (i.e. GitHub)"),
    license: z
      .string()
      .trim()
      .default("Apache-2.0")
      .describe("The license type of the package"),
    homepage: z
      .string()
      .trim()
      .url()
      .default(STORM_DEFAULT_HOMEPAGE)
      .describe("The homepage of the workspace"),
    docs: z
      .string()
      .trim()
      .url()
      .default(STORM_DEFAULT_DOCS)
      .describe("The base documentation site for the workspace"),
    licensing: z
      .string()
      .trim()
      .url()
      .default(STORM_DEFAULT_LICENSING)
      .describe("The base licensing site for the workspace"),
    branch: z
      .string()
      .trim()
      .default("main")
      .describe("The branch of the workspace"),
    preid: z
      .string()
      .optional()
      .describe("A tag specifying the version pre-release identifier"),
    owner: z
      .string()
      .trim()
      .default("@storm-software/development")
      .describe("The owner of the package"),
    worker: z
      .string()
      .trim()
      .default("Stormie-Bot")
      .describe(
        "The worker of the package (this is the bot that will be used to perform various tasks)"
      ),
    env: z
      .enum(["development", "staging", "production"])
      .default("production")
      .describe("The current runtime environment of the package"),
    workspaceRoot: z
      .string()
      .trim()
      .default("")
      .describe("The root directory of the workspace"),
    packageDirectory: z
      .string()
      .trim()
      .optional()
      .describe("The root directory of the package"),
    externalPackagePatterns: z
      .array(z.string())
      .default([])
      .describe(
        "The build will use these package patterns to determine if they should be external to the bundle"
      ),
    skipCache: z
      .boolean()
      .default(false)
      .describe("Should all known types of workspace caching be skipped?"),
    cacheDirectory: z
      .string()
      .trim()
      .default("node_modules/.cache/storm")
      .describe("The directory used to store the workspace's cached file data"),
    buildDirectory: z
      .string()
      .trim()
      .default("dist")
      .describe("The build directory for the workspace"),
    outputDirectory: z
      .string()
      .trim()
      .default("node_modules/.storm")
      .describe("The runtime directory of Storm"),
    runtimeVersion: z
      .string()
      .trim()
      .regex(
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
      )
      .default("1.0.0")
      .describe("The global version of the Storm runtime"),
    packageManager: z
      .enum(["npm", "yarn", "pnpm", "bun"])
      .default("pnpm")
      .describe("The package manager used by the repository"),
    timezone: z
      .string()
      .trim()
      .default("America/New_York")
      .describe("The default timezone of the workspace"),
    locale: z
      .string()
      .trim()
      .default("en-US")
      .describe("The default locale of the workspace"),
    logLevel: z
      .enum([
        "silent",
        "fatal",
        "error",
        "warn",
        "info",
        "debug",
        "trace",
        "all"
      ])
      .default("debug")
      .describe(
        "The log level used to filter out lower priority log messages. If not provided, this is defaulted using the `environment` config value (if `environment` is set to `production` then `level` is `error`, else `level` is `debug`)."
      ),
    cloudflareAccountId: z
      .string()
      .trim()
      .toLowerCase()
      .length(32)
      .regex(/^([0-9a-fA-F]{32})$/i)
      .nullable()
      .default(null)
      .describe("The default Cloudflare account ID of the workspace"),
    registry: RegistryConfigSchema,
    configFile: z
      .string()
      .trim()
      .nullable()
      .default(null)
      .describe(
        "The filepath of the Storm config. When this field is null, no config file was found in the current workspace."
      ),
    colors: ColorConfigSchema.or(ColorConfigMapSchema).describe(
      "Storm theme config values used for styling various package elements"
    ),
    extensions: z
      .record(z.any())
      .optional()
      .default({})
      .describe("Configuration of each used extension")
  })
  .describe(
    "Storm Workspace config values used during various dev-ops processes. This type is a combination of the StormPackageConfig and StormProject types. It represents the config of the entire monorepo."
  );
