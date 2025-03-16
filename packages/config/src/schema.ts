import z from "zod";
import {
  STORM_DEFAULT_DOCS,
  STORM_DEFAULT_HOMEPAGE,
  STORM_DEFAULT_LICENSING,
  STORM_DEFAULT_RELEASE_BANNER,
  STORM_DEFAULT_RELEASE_FOOTER
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
  z.object({ base: ColorConfigSchema }),
  z.record(z.string(), ColorConfigSchema)
]);

const ExtendsItemSchema = z
  .string()
  .trim()
  .describe(
    "The path to a base config file to use as a configuration preset file. Documentation can be found at https://github.com/unjs/c12#extending-configuration."
  );

export const ExtendsSchema = ExtendsItemSchema.or(
  z.array(ExtendsItemSchema)
).describe(
  "The path to a base config file to use as a configuration preset file. Documentation can be found at https://github.com/unjs/c12#extending-configuration."
);

export const WorkspaceBotConfigSchema = z
  .object({
    name: z
      .string()
      .trim()
      .default("stormie-bot")
      .describe(
        "The workspace bot user's name (this is the bot that will be used to perform various tasks)"
      ),
    email: z
      .string()
      .trim()
      .email()
      .default("bot@stormsoftware.com")
      .describe("The email of the workspace bot")
  })
  .describe(
    "The workspace's bot user's config used to automated various operations tasks"
  );

export const WorkspaceReleaseConfigSchema = z
  .object({
    banner: z
      .string()
      .trim()
      .default(STORM_DEFAULT_RELEASE_BANNER)
      .describe(
        "A URL to a banner image used to display the workspace's release"
      ),
    header: z
      .string()
      .trim()
      .optional()
      .describe(
        "A header message appended to the start of the workspace's release notes"
      ),
    footer: z
      .string()
      .trim()
      .default(STORM_DEFAULT_RELEASE_FOOTER)
      .describe(
        "A footer message appended to the end of the workspace's release notes"
      )
  })
  .describe("The workspace's release config used during the release process");

export const WorkspaceDirectoryConfigSchema = z
  .object({
    cache: z
      .string()
      .trim()
      .optional()
      .describe(
        "The directory used to store the environment's cached file data"
      ),
    data: z
      .string()
      .trim()
      .optional()
      .describe("The directory used to store the environment's data files"),
    config: z
      .string()
      .trim()
      .optional()
      .describe(
        "The directory used to store the environment's configuration files"
      ),
    temp: z
      .string()
      .trim()
      .optional()
      .describe("The directory used to store the environment's temp files"),
    log: z
      .string()
      .trim()
      .optional()
      .describe("The directory used to store the environment's temp files"),
    build: z
      .string()
      .trim()
      .default("dist")
      .describe(
        "The directory used to store the workspace's distributable files after a build (relative to the workspace root)"
      )
  })
  .describe(
    "Various directories used by the workspace to store data, cache, and configuration files"
  );

/**
 * Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
 */
export const StormConfigSchema = z
  .object({
    $schema: z
      .string()
      .trim()
      .default(
        "https://cdn.jsdelivr.net/npm/@storm-software/config/schemas/storm-workspace.schema.json"
      )
      .optional()
      .nullish()
      .describe(
        "The URL to the JSON schema file that describes the Storm configuration file"
      ),
    extends: ExtendsSchema.optional(),
    name: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .describe(
        "The name of the service/package/scope using this configuration"
      ),
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
      .default("@storm-software/admin")
      .describe("The owner of the package"),
    bot: WorkspaceBotConfigSchema,
    release: WorkspaceReleaseConfigSchema,
    mode: z
      .enum(["development", "staging", "production"])
      .default("production")
      .describe("The current runtime environment mode for the package"),
    workspaceRoot: z
      .string()
      .trim()
      .default("")
      .describe("The root directory of the workspace"),
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
    directories: WorkspaceDirectoryConfigSchema,
    packageManager: z
      .enum(["npm", "yarn", "pnpm", "bun"])
      .default("npm")
      .describe(
        "The JavaScript/TypeScript package manager used by the repository"
      ),
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
        "success",
        "info",
        "debug",
        "trace",
        "all"
      ])
      .default("info")
      .describe(
        "The log level used to filter out lower priority log messages. If not provided, this is defaulted using the `environment` config value (if `environment` is set to `production` then `level` is `error`, else `level` is `debug`)."
      ),
    skipConfigLogging: z
      .boolean()
      .optional()
      .describe(
        "Should the logging of the current Storm Workspace configuration be skipped?"
      ),
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
