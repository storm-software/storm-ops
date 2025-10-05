import * as z from "zod/mini";
import {
  STORM_DEFAULT_BANNER_ALT,
  STORM_DEFAULT_ERROR_CODES_FILE
} from "./constants";

export const schemaRegistry = z.registry<{ description: string }>();

const colorSchema = z
  .string()
  .check(
    z.length(7),
    z.toLowerCase(),
    z.regex(/^#([0-9a-f]{3}){1,2}$/i),
    z.trim()
  );
schemaRegistry.add(colorSchema, {
  description: "A base schema for describing the format of colors"
});

export const darkColorSchema = z._default(colorSchema, "#151718");
schemaRegistry.add(darkColorSchema, {
  description: "The dark background color of the workspace"
});

export const lightColorSchema = z._default(colorSchema, "#cbd5e1");
schemaRegistry.add(lightColorSchema, {
  description: "The light background color of the workspace"
});

export const brandColorSchema = z._default(colorSchema, "#1fb2a6");
schemaRegistry.add(brandColorSchema, {
  description: "The primary brand specific color of the workspace"
});

export const alternateColorSchema = z.optional(colorSchema);
schemaRegistry.add(alternateColorSchema, {
  description: "The alternate brand specific color of the workspace"
});

export const accentColorSchema = z.optional(colorSchema);
schemaRegistry.add(accentColorSchema, {
  description: "The secondary brand specific color of the workspace"
});

export const linkColorSchema = z._default(colorSchema, "#3fa6ff");
schemaRegistry.add(linkColorSchema, {
  description: "The color used to display hyperlink text"
});

export const helpColorSchema = z._default(colorSchema, "#818cf8");
schemaRegistry.add(helpColorSchema, {
  description: "The second brand specific color of the workspace"
});

export const successColorSchema = z._default(colorSchema, "#45b27e");
schemaRegistry.add(successColorSchema, {
  description: "The success color of the workspace"
});

export const infoColorSchema = z._default(colorSchema, "#38bdf8");
schemaRegistry.add(infoColorSchema, {
  description: "The informational color of the workspace"
});
export const warningColorSchema = z._default(colorSchema, "#f3d371");
schemaRegistry.add(warningColorSchema, {
  description: "The warning color of the workspace"
});

export const dangerColorSchema = z._default(colorSchema, "#d8314a");
schemaRegistry.add(dangerColorSchema, {
  description: "The danger color of the workspace"
});

export const fatalColorSchema = z.optional(colorSchema);
schemaRegistry.add(fatalColorSchema, {
  description: "The fatal color of the workspace"
});

export const positiveColorSchema = z._default(colorSchema, "#4ade80");
schemaRegistry.add(positiveColorSchema, {
  description: "The positive number color of the workspace"
});

export const negativeColorSchema = z._default(colorSchema, "#ef4444");
schemaRegistry.add(negativeColorSchema, {
  description: "The negative number color of the workspace"
});

export const gradientStopsSchema = z.optional(z.array(colorSchema));
schemaRegistry.add(gradientStopsSchema, {
  description:
    "The color stops for the base gradient color pattern used in the workspace"
});

export const darkColorsSchema = z.object({
  foreground: lightColorSchema,
  background: darkColorSchema,
  brand: brandColorSchema,
  alternate: alternateColorSchema,
  accent: accentColorSchema,
  link: linkColorSchema,
  help: helpColorSchema,
  success: successColorSchema,
  info: infoColorSchema,
  warning: warningColorSchema,
  danger: dangerColorSchema,
  fatal: fatalColorSchema,
  positive: positiveColorSchema,
  negative: negativeColorSchema,
  gradient: gradientStopsSchema
});

export const lightColorsSchema = z.object({
  foreground: darkColorSchema,
  background: lightColorSchema,
  brand: brandColorSchema,
  alternate: alternateColorSchema,
  accent: accentColorSchema,
  link: linkColorSchema,
  help: helpColorSchema,
  success: successColorSchema,
  info: infoColorSchema,
  warning: warningColorSchema,
  danger: dangerColorSchema,
  fatal: fatalColorSchema,
  positive: positiveColorSchema,
  negative: negativeColorSchema,
  gradient: gradientStopsSchema
});

export const multiColorsSchema = z.object({
  dark: darkColorsSchema,
  light: lightColorsSchema
});

export const singleColorsSchema = z.object({
  dark: darkColorSchema,
  light: lightColorSchema,
  brand: brandColorSchema,
  alternate: alternateColorSchema,
  accent: accentColorSchema,
  link: linkColorSchema,
  help: helpColorSchema,
  success: successColorSchema,
  info: infoColorSchema,
  warning: warningColorSchema,
  danger: dangerColorSchema,
  fatal: fatalColorSchema,
  positive: positiveColorSchema,
  negative: negativeColorSchema,
  gradient: gradientStopsSchema
});

const registryUrlConfigSchema = z.optional(z.url());
schemaRegistry.add(registryUrlConfigSchema, {
  description: "A remote registry URL used to publish distributable packages"
});

export const registrySchema = z._default(
  z.object({
    github: registryUrlConfigSchema,
    npm: registryUrlConfigSchema,
    cargo: registryUrlConfigSchema,
    cyclone: registryUrlConfigSchema,
    container: registryUrlConfigSchema
  }),
  {}
);
schemaRegistry.add(registrySchema, {
  description: "A list of remote registry URLs used by Storm Software"
});

/**
 * Storm theme color config values used for styling various workspace elements
 */
export const colorsSchema = z.union([singleColorsSchema, multiColorsSchema]);
schemaRegistry.add(colorsSchema, {
  description: "Colors used for various workspace elements"
});

export const themeColorsSchema = z.record(
  z.union([z.union([z.literal("base"), z.string()]), z.string()]),
  colorsSchema
);
schemaRegistry.add(themeColorsSchema, {
  description:
    "Storm theme config values used for styling various package elements"
});

export const extendsSchema = z.optional(
  z.union([z.string().check(z.trim()), z.array(z.string().check(z.trim()))])
);
schemaRegistry.add(extendsSchema, {
  description:
    "The path to a base config file to use as a configuration preset file. Documentation can be found at https://github.com/unjs/c12#extending-configuration."
});

const workspaceBotNameSchema = z.string().check(z.trim());
schemaRegistry.add(workspaceBotNameSchema, {
  description:
    "The workspace bot user's name (this is the bot that will be used to perform various tasks)"
});

const workspaceBotEmailSchema = z.string().check(z.trim());
schemaRegistry.add(workspaceBotEmailSchema, {
  description: "The email of the workspace bot"
});

export const workspaceBotSchema = z.object({
  name: workspaceBotNameSchema,
  email: workspaceBotEmailSchema
});
schemaRegistry.add(workspaceBotSchema, {
  description:
    "The workspace's bot user's config used to automated various operations tasks"
});

export const workspaceReleaseBannerUrlSchema = z.optional(
  z.string().check(z.trim(), z.url())
);
schemaRegistry.add(workspaceReleaseBannerUrlSchema, {
  description: "A URL to a banner image used to display the workspace's release"
});

export const workspaceReleaseBannerAltSchema = z._default(
  z.string().check(z.trim()),
  STORM_DEFAULT_BANNER_ALT
);
schemaRegistry.add(workspaceReleaseBannerAltSchema, {
  description: "The alt text for the workspace's release banner image"
});

export const workspaceReleaseBannerSchema = z.object({
  url: workspaceReleaseBannerUrlSchema,
  alt: workspaceReleaseBannerAltSchema
});
schemaRegistry.add(workspaceReleaseBannerSchema, {
  description: "The workspace's banner image used during the release process"
});

export const workspaceReleaseHeaderSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceReleaseHeaderSchema, {
  description:
    "A header message appended to the start of the workspace's release notes"
});

export const workspaceReleaseFooterSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceReleaseFooterSchema, {
  description:
    "A footer message appended to the end of the workspace's release notes"
});

export const workspaceReleaseSchema = z.object({
  banner: z.union([
    workspaceReleaseBannerSchema,
    z.string().check(z.trim(), z.url())
  ]),
  header: workspaceReleaseHeaderSchema,
  footer: workspaceReleaseFooterSchema
});
schemaRegistry.add(workspaceReleaseSchema, {
  description: "The workspace's release config used during the release process"
});

export const workspaceSocialsTwitterSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceSocialsTwitterSchema, {
  description: "A Twitter/X account associated with the organization/project"
});

export const workspaceSocialsDiscordSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceSocialsDiscordSchema, {
  description: "A Discord account associated with the organization/project"
});

export const workspaceSocialsTelegramSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceSocialsTelegramSchema, {
  description: "A Telegram account associated with the organization/project"
});

export const workspaceSocialsSlackSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceSocialsSlackSchema, {
  description: "A Slack account associated with the organization/project"
});

export const workspaceSocialsMediumSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceSocialsMediumSchema, {
  description: "A Medium account associated with the organization/project"
});

export const workspaceSocialsGithubSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceSocialsGithubSchema, {
  description: "A GitHub account associated with the organization/project"
});

export const workspaceSocialsSchema = z.object({
  twitter: workspaceSocialsTwitterSchema,
  discord: workspaceSocialsDiscordSchema,
  telegram: workspaceSocialsTelegramSchema,
  slack: workspaceSocialsSlackSchema,
  medium: workspaceSocialsMediumSchema,
  github: workspaceSocialsGithubSchema
});
schemaRegistry.add(workspaceSocialsSchema, {
  description:
    "The workspace's account config used to store various social media links"
});

export const workspaceDirectoryCacheSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceDirectoryCacheSchema, {
  description: "The directory used to store the environment's cached file data"
});

export const workspaceDirectoryDataSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceDirectoryDataSchema, {
  description: "The directory used to store the environment's data files"
});

export const workspaceDirectoryConfigSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceDirectoryConfigSchema, {
  description:
    "The directory used to store the environment's configuration files"
});

export const workspaceDirectoryTempSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceDirectoryTempSchema, {
  description: "The directory used to store the environment's temp files"
});

export const workspaceDirectoryLogSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(workspaceDirectoryLogSchema, {
  description: "The directory used to store the environment's log files"
});

export const workspaceDirectoryBuildSchema = z._default(
  z.string().check(z.trim()),
  "dist"
);
schemaRegistry.add(workspaceDirectoryBuildSchema, {
  description:
    "The directory used to store the workspace's distributable files after a build (relative to the workspace root)"
});

export const workspaceDirectorySchema = z.object({
  cache: workspaceDirectoryCacheSchema,
  data: workspaceDirectoryDataSchema,
  config: workspaceDirectoryConfigSchema,
  temp: workspaceDirectoryTempSchema,
  log: workspaceDirectoryLogSchema,
  build: workspaceDirectoryBuildSchema
});
schemaRegistry.add(workspaceDirectorySchema, {
  description:
    "Various directories used by the workspace to store data, cache, and configuration files"
});

export const variantSchema = z._default(
  z.enum(["minimal", "monorepo"]),
  "monorepo"
);
schemaRegistry.add(variantSchema, {
  description:
    "The variant of the workspace. This can be used to enable or disable certain features or configurations."
});

export const errorCodesFileSchema = z._default(
  z.string().check(z.trim()),
  STORM_DEFAULT_ERROR_CODES_FILE
);
schemaRegistry.add(errorCodesFileSchema, {
  description: "The path to the workspace's error codes JSON file"
});

export const errorUrlSchema = z.optional(z.url());
schemaRegistry.add(errorUrlSchema, {
  description:
    "A URL to a page that looks up the workspace's error messages given a specific error code"
});

export const errorSchema = z.object({
  codesFile: errorCodesFileSchema,
  url: errorUrlSchema
});
schemaRegistry.add(errorSchema, {
  description:
    "The workspace's error config used when creating error details during a system error"
});

export const organizationNameSchema = z.optional(
  z.string().check(z.trim(), z.toLowerCase())
);
schemaRegistry.add(organizationNameSchema, {
  description: "The name of the organization"
});

export const organizationDescriptionSchema = z.optional(
  z.string().check(z.trim())
);
schemaRegistry.add(organizationDescriptionSchema, {
  description: "A description of the organization"
});

export const organizationLogoSchema = z.optional(z.url());
schemaRegistry.add(organizationLogoSchema, {
  description: "A URL to the organization's logo image"
});

export const organizationIconSchema = z.optional(z.url());
schemaRegistry.add(organizationIconSchema, {
  description: "A URL to the organization's icon image"
});

export const organizationUrlSchema = z.optional(z.url());
schemaRegistry.add(organizationUrlSchema, {
  description:
    "A URL to a page that provides more information about the organization"
});

export const organizationSchema = z.object({
  name: organizationNameSchema,
  description: organizationDescriptionSchema,
  logo: organizationLogoSchema,
  icon: organizationIconSchema,
  url: organizationUrlSchema
});
schemaRegistry.add(organizationSchema, {
  description: "The workspace's organization details"
});

const schemaNameSchema = z._default(
  z.string().check(z.trim(), z.toLowerCase()),
  "https://public.storm-cdn.com/schemas/storm-workspace.schema.json"
);
schemaRegistry.add(schemaNameSchema, {
  description:
    "The URL or file path to the JSON schema file that describes the Storm configuration file"
});

const nameSchema = z.string().check(z.trim(), z.toLowerCase());
schemaRegistry.add(nameSchema, {
  description:
    "The name of the workspace/project/service/package/scope using this configuration"
});

const namespaceSchema = z.string().check(z.trim(), z.toLowerCase());
schemaRegistry.add(namespaceSchema, {
  description:
    "The namespace of the workspace/project/service/package/scope using this configuration"
});

const orgSchema = z.union([
  organizationSchema,
  z.string().check(z.trim(), z.toLowerCase())
]);
schemaRegistry.add(orgSchema, {
  description:
    "The organization of the workspace. This can be a string or an object containing the organization's details"
});

const repositorySchema = z.string().check(z.trim(), z.toLowerCase());
schemaRegistry.add(repositorySchema, {
  description: "The repo URL of the workspace (i.e. the GitHub repository URL)"
});

/**
 * Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
 */
export const licenseSchema = z._default(
  z.string().check(z.trim()),
  "Apache-2.0"
);
schemaRegistry.add(licenseSchema, {
  description: "The license type of the package"
});

export const homepageSchema = z.optional(z.url());
schemaRegistry.add(homepageSchema, {
  description: "The homepage of the workspace"
});

export const docsSchema = z.optional(z.url());
schemaRegistry.add(docsSchema, {
  description: "The documentation site for the workspace"
});

export const portalSchema = z.optional(z.url());
schemaRegistry.add(portalSchema, {
  description: "The development portal site for the workspace"
});

export const licensingSchema = z.optional(z.url());
schemaRegistry.add(licensingSchema, {
  description: "The licensing site for the workspace"
});

export const contactSchema = z.optional(z.url());
schemaRegistry.add(contactSchema, {
  description: "The contact site for the workspace"
});

export const supportSchema = z.optional(z.url());
schemaRegistry.add(supportSchema, {
  description:
    "The support site for the workspace. If not provided, this is defaulted to the `contact` config value"
});

export const branchSchema = z._default(
  z.string().check(z.trim(), z.toLowerCase()),
  "main"
);
schemaRegistry.add(branchSchema, {
  description: "The branch of the workspace"
});

export const preidSchema = z.optional(
  z.string().check(z.trim(), z.toLowerCase())
);
schemaRegistry.add(preidSchema, {
  description: "A tag specifying the version pre-release identifier"
});

export const ownerSchema = z.optional(
  z.string().check(z.trim(), z.toLowerCase())
);
schemaRegistry.add(ownerSchema, {
  description: "The owner of the package"
});

export const modeSchema = z._default(
  z
    .enum(["development", "staging", "production"])
    .check(z.trim(), z.toLowerCase()),
  "production"
);
schemaRegistry.add(modeSchema, {
  description: "The current runtime environment mode for the package"
});

export const workspaceRootSchema = z.string().check(z.trim(), z.toLowerCase());
schemaRegistry.add(workspaceRootSchema, {
  description: "The root directory of the workspace"
});

export const skipCacheSchema = z._default(z.boolean(), false);
schemaRegistry.add(skipCacheSchema, {
  description: "Should all known types of workspace caching be skipped?"
});

export const packageManagerSchema = z._default(
  z.enum(["npm", "yarn", "pnpm", "bun"]),
  "npm"
);
schemaRegistry.add(packageManagerSchema, {
  description:
    "The JavaScript/TypeScript package manager used by the repository"
});

export const timezoneSchema = z._default(
  z.string().check(z.trim()),
  "America/New_York"
);
schemaRegistry.add(timezoneSchema, {
  description: "The default timezone of the workspace"
});

export const localeSchema = z._default(z.string().check(z.trim()), "en-US");
schemaRegistry.add(localeSchema, {
  description: "The default locale of the workspace"
});

export const logLevelSchema = z._default(
  z.enum([
    "silent",
    "fatal",
    "error",
    "warn",
    "success",
    "info",
    "debug",
    "trace",
    "all"
  ]),
  "info"
);
schemaRegistry.add(logLevelSchema, {
  description:
    "The log level used to filter out lower priority log messages. If not provided, this is defaulted using the `environment` config value (if `environment` is set to `production` then `level` is `error`, else `level` is `debug`)."
});

export const skipConfigLoggingSchema = z._default(z.boolean(), true);
schemaRegistry.add(skipConfigLoggingSchema, {
  description:
    "Should the logging of the current Storm Workspace configuration be skipped?"
});

export const configFileSchema = z._default(
  z.nullable(z.string().check(z.trim())),
  null
);
schemaRegistry.add(configFileSchema, {
  description:
    "The filepath of the Storm config. When this field is null, no config file was found in the current workspace."
});

export const extensionsSchema = z._default(z.record(z.string(), z.any()), {});
schemaRegistry.add(extensionsSchema, {
  description: "Configuration of each used extension"
});

/**
 * Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
 */
export const workspaceConfigSchema = z.object({
  $schema: schemaNameSchema,
  extends: extendsSchema,
  name: nameSchema,
  variant: variantSchema,
  namespace: namespaceSchema,
  organization: orgSchema,
  repository: repositorySchema,
  license: licenseSchema,
  homepage: homepageSchema,
  docs: docsSchema,
  portal: portalSchema,
  licensing: licensingSchema,
  contact: contactSchema,
  support: supportSchema,
  branch: branchSchema,
  preid: preidSchema,
  owner: ownerSchema,
  bot: workspaceBotSchema,
  release: workspaceReleaseSchema,
  socials: workspaceSocialsSchema,
  error: errorSchema,
  mode: modeSchema,
  workspaceRoot: workspaceRootSchema,
  skipCache: skipCacheSchema,
  directories: workspaceDirectorySchema,
  packageManager: packageManagerSchema,
  timezone: timezoneSchema,
  locale: localeSchema,
  logLevel: logLevelSchema,
  skipConfigLogging: skipConfigLoggingSchema,
  registry: registrySchema,
  configFile: configFileSchema,
  colors: z.union([colorsSchema, themeColorsSchema]),
  extensions: extensionsSchema
});
schemaRegistry.add(extensionsSchema, {
  description:
    "Storm Workspace config values used during various dev-ops processes. This type is a combination of the StormPackageConfig and StormProject types. It represents the config of the entire monorepo."
});
