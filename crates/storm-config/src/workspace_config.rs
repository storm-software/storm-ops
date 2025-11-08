use std::cell::RefCell;
use std::collections::HashMap;
use std::path::Path;
use std::str::FromStr;
use std::{fmt, fs};

use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use storm_workspace::utils::get_workspace_root;

use crate::types::PackageJson;
use crate::{Config, ConfigError, Environment, File, Value};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum WorkspaceMode {
  Development,
  Test,
  Production,
}

impl Default for WorkspaceMode {
  fn default() -> Self {
    WorkspaceMode::Production
  }
}

impl FromStr for WorkspaceMode {
  type Err = ();

  fn from_str(input: &str) -> Result<WorkspaceMode, Self::Err> {
    match input {
      "development" => Ok(WorkspaceMode::Development),
      "test" => Ok(WorkspaceMode::Test),
      "production" => Ok(WorkspaceMode::Production),
      _ => Err(()),
    }
  }
}

impl fmt::Display for WorkspaceMode {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match *self {
      WorkspaceMode::Development => write!(f, "development"),
      WorkspaceMode::Test => write!(f, "test"),
      WorkspaceMode::Production => write!(f, "production"),
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum WorkspaceVariant {
  Minimal,
  Monorepo,
}

impl Default for WorkspaceVariant {
  fn default() -> Self {
    WorkspaceVariant::Monorepo
  }
}

impl FromStr for WorkspaceVariant {
  type Err = ();

  fn from_str(input: &str) -> Result<WorkspaceVariant, Self::Err> {
    match input {
      "minimal" => Ok(WorkspaceVariant::Minimal),
      "monorepo" => Ok(WorkspaceVariant::Monorepo),
      _ => Err(()),
    }
  }
}

impl fmt::Display for WorkspaceVariant {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match *self {
      WorkspaceVariant::Minimal => write!(f, "minimal"),
      WorkspaceVariant::Monorepo => write!(f, "monorepo"),
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum PackageManagerType {
  Npm,
  Yarn,
  Pnpm,
  Bun,
}

impl FromStr for PackageManagerType {
  type Err = ();

  fn from_str(input: &str) -> Result<PackageManagerType, Self::Err> {
    match input {
      "npm" => Ok(PackageManagerType::Npm),
      "yarn" => Ok(PackageManagerType::Yarn),
      "pnpm" => Ok(PackageManagerType::Pnpm),
      "bun" => Ok(PackageManagerType::Bun),
      _ => Err(()),
    }
  }
}

impl fmt::Display for PackageManagerType {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match *self {
      PackageManagerType::Npm => write!(f, "npm"),
      PackageManagerType::Yarn => write!(f, "yarn"),
      PackageManagerType::Pnpm => write!(f, "pnpm"),
      PackageManagerType::Bun => write!(f, "bun"),
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum LogLevel {
  Silent,
  Fatal,
  Error,
  Warn,
  Success,
  Info,
  Debug,
  Trace,
  All,
}

impl FromStr for LogLevel {
  type Err = ();

  fn from_str(input: &str) -> Result<LogLevel, Self::Err> {
    match input {
      "silent" => Ok(LogLevel::Silent),
      "fatal" => Ok(LogLevel::Fatal),
      "error" => Ok(LogLevel::Error),
      "warn" => Ok(LogLevel::Warn),
      "success" => Ok(LogLevel::Success),
      "info" => Ok(LogLevel::Info),
      "debug" => Ok(LogLevel::Debug),
      "trace" => Ok(LogLevel::Trace),
      "all" => Ok(LogLevel::All),
      _ => Err(()),
    }
  }
}

impl fmt::Display for LogLevel {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match *self {
      LogLevel::Silent => write!(f, "silent"),
      LogLevel::Fatal => write!(f, "fatal"),
      LogLevel::Error => write!(f, "error"),
      LogLevel::Warn => write!(f, "warn"),
      LogLevel::Success => write!(f, "success"),
      LogLevel::Info => write!(f, "info"),
      LogLevel::Debug => write!(f, "debug"),
      LogLevel::Trace => write!(f, "trace"),
      LogLevel::All => write!(f, "all"),
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(untagged)]
pub enum ExtendsConfig {
  Single(String),
  Multiple(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct OrganizationDetails {
  /// The name of the organization
  pub name: Option<String>,
  /// A description of the organization
  pub description: Option<String>,
  /// A URL to the organization's logo image
  pub logo: Option<String>,
  /// A URL to the organization's icon image
  pub icon: Option<String>,
  /// A URL to a page that provides more information about the organization
  pub url: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(untagged)]
pub enum OrganizationConfig {
  Details(OrganizationDetails),
  Name(String),
}

impl Default for OrganizationConfig {
  fn default() -> Self {
    OrganizationConfig::Name("storm-software".to_string())
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ColorPaletteConfig {
  /// The dark background color of the workspace
  pub dark: String,
  /// The light background color of the workspace
  pub light: String,
  /// The primary brand specific color of the workspace
  pub brand: String,
  /// The alternate brand specific color of the workspace
  pub alternate: Option<String>,
  /// The secondary brand specific color of the workspace
  pub accent: Option<String>,
  /// The color used to display hyperlink text
  pub link: String,
  /// The help color of the workspace
  pub help: String,
  /// The success color of the workspace
  pub success: String,
  /// The info color of the workspace
  pub info: String,
  /// The warning color of the workspace
  pub warning: String,
  /// The danger color of the workspace
  pub danger: String,
  /// The fatal color of the workspace
  pub fatal: Option<String>,
  /// The positive color of the workspace
  pub positive: String,
  /// The negative color of the workspace
  pub negative: String,
  /// The gradient color stops of the workspace
  pub gradient: Option<Vec<String>>,
}

impl Default for ColorPaletteConfig {
  fn default() -> Self {
    Self {
      dark: "#151718".to_string(),
      light: "#cbd5e1".to_string(),
      brand: "#1fb2a6".to_string(),
      alternate: None,
      accent: None,
      link: "#3fa6ff".to_string(),
      help: "#818cf8".to_string(),
      success: "#45b27e".to_string(),
      info: "#38bdf8".to_string(),
      warning: "#f3d371".to_string(),
      danger: "#d8314a".to_string(),
      fatal: None,
      positive: "#4ade80".to_string(),
      negative: "#ef4444".to_string(),
      gradient: None,
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ColorSchemaConfig {
  /// The foreground color of the workspace
  pub foreground: String,
  /// The background color of the workspace
  pub background: String,
  /// The primary brand specific color of the workspace
  pub brand: String,
  /// The alternate brand specific color of the workspace
  pub alternate: Option<String>,
  /// The secondary brand specific color of the workspace
  pub accent: Option<String>,
  /// The color used to display hyperlink text
  pub link: String,
  /// The help color of the workspace
  pub help: String,
  /// The success color of the workspace
  pub success: String,
  /// The info color of the workspace
  pub info: String,
  /// The warning color of the workspace
  pub warning: String,
  /// The danger color of the workspace
  pub danger: String,
  /// The fatal color of the workspace
  pub fatal: Option<String>,
  /// The positive color of the workspace
  pub positive: String,
  /// The negative color of the workspace
  pub negative: String,
  /// The gradient color stops of the workspace
  pub gradient: Option<Vec<String>>,
}

impl ColorSchemaConfig {
  fn default_dark() -> Self {
    Self {
      foreground: "#cbd5e1".to_string(),
      background: "#151718".to_string(),
      brand: "#1fb2a6".to_string(),
      alternate: None,
      accent: None,
      link: "#3fa6ff".to_string(),
      help: "#818cf8".to_string(),
      success: "#45b27e".to_string(),
      info: "#38bdf8".to_string(),
      warning: "#f3d371".to_string(),
      danger: "#d8314a".to_string(),
      fatal: None,
      positive: "#4ade80".to_string(),
      negative: "#ef4444".to_string(),
      gradient: None,
    }
  }

  fn default_light() -> Self {
    Self {
      foreground: "#151718".to_string(),
      background: "#cbd5e1".to_string(),
      brand: "#1fb2a6".to_string(),
      alternate: None,
      accent: None,
      link: "#3fa6ff".to_string(),
      help: "#818cf8".to_string(),
      success: "#45b27e".to_string(),
      info: "#38bdf8".to_string(),
      warning: "#f3d371".to_string(),
      danger: "#d8314a".to_string(),
      fatal: None,
      positive: "#4ade80".to_string(),
      negative: "#ef4444".to_string(),
      gradient: None,
    }
  }
}

impl Default for ColorSchemaConfig {
  fn default() -> Self {
    ColorSchemaConfig::default_dark()
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ColorThemeConfig {
  /// The light color schema of the workspace
  pub light: ColorSchemaConfig,
  /// The dark color schema of the workspace
  pub dark: ColorSchemaConfig,
}

impl Default for ColorThemeConfig {
  fn default() -> Self {
    Self { light: ColorSchemaConfig::default_light(), dark: ColorSchemaConfig::default_dark() }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(untagged)]
pub enum ColorThemeEntry {
  Palette(ColorPaletteConfig),
  Theme(ColorThemeConfig),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(untagged)]
pub enum ColorsConfig {
  Palette(ColorPaletteConfig),
  Theme(ColorThemeConfig),
  Collection(HashMap<String, ColorThemeEntry>),
}

impl Default for ColorsConfig {
  fn default() -> Self {
    ColorsConfig::Palette(ColorPaletteConfig::default())
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct RegistryUrlConfig {
  /// A remote registry URL used to publish distributable packages to GitHub
  pub github: Option<String>,
  /// A remote registry URL used to publish distributable packages to npm
  pub npm: Option<String>,
  /// A remote registry URL used to publish distributable packages to crates.io
  pub cargo: Option<String>,
  /// A remote registry URL used to publish distributable packages to Cyclone
  pub cyclone: Option<String>,
  /// A remote registry URL used to publish container images
  pub container: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceBotConfig {
  /// The workspace bot user's name (this is the bot that will be used to perform various tasks)
  pub name: String,
  /// The email of the workspace bot
  pub email: String,
}

impl Default for WorkspaceBotConfig {
  fn default() -> Self {
    Self { name: "stormie-bot".to_string(), email: "stormie-bot@stormsoftware.com".to_string() }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceReleaseBannerConfig {
  /// The URL for the workspace's release banner image
  pub url: Option<String>,
  /// The alt text for the workspace's release banner image
  pub alt: String,
}

impl Default for WorkspaceReleaseBannerConfig {
  fn default() -> Self {
    Self { url: None, alt: "The workspace's banner image".to_string() }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(untagged)]
pub enum ReleaseBannerConfig {
  Url(String),
  Details(WorkspaceReleaseBannerConfig),
}

impl Default for ReleaseBannerConfig {
  fn default() -> Self {
    ReleaseBannerConfig::Details(WorkspaceReleaseBannerConfig::default())
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceReleaseConfig {
  /// The workspace's release banner details or URL
  pub banner: ReleaseBannerConfig,
  /// A header message appended to the start of the release notes
  pub header: Option<String>,
  /// A footer message appended to the end of the release notes
  pub footer: Option<String>,
}

impl Default for WorkspaceReleaseConfig {
  fn default() -> Self {
    Self { banner: ReleaseBannerConfig::default(), header: None, footer: None }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct SocialsConfig {
  /// A Twitter/X account associated with the organization/project
  pub twitter: Option<String>,
  /// A Discord account associated with the organization/project
  pub discord: Option<String>,
  /// A Telegram account associated with the organization/project
  pub telegram: Option<String>,
  /// A Slack account associated with the organization/project
  pub slack: Option<String>,
  /// A Medium account associated with the organization/project
  pub medium: Option<String>,
  /// A GitHub account associated with the organization/project
  pub github: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceErrorConfig {
  /// The path to the workspace's error codes JSON file
  pub codes_file: String,
  /// A URL to a page that looks up the workspace's error messages given a specific error code
  pub url: Option<String>,
}

impl Default for WorkspaceErrorConfig {
  fn default() -> Self {
    Self { codes_file: "tools/errors/codes.json".to_string(), url: None }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceDirectoriesConfig {
  /// The directory used to store the environment's cached file data
  pub cache: Option<String>,
  /// The directory used to store the environment's data files
  pub data: Option<String>,
  /// The directory used to store the environment's configuration files
  pub config: Option<String>,
  /// The directory used to store the environment's temp files
  pub temp: Option<String>,
  /// The directory used to store the environment's log files
  pub log: Option<String>,
  /// The directory used to store the workspace's distributable files after a build
  pub build: String,
}

impl Default for WorkspaceDirectoriesConfig {
  fn default() -> Self {
    Self { cache: None, data: None, config: None, temp: None, log: None, build: "dist".to_string() }
  }
}

/// Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
#[derive(Debug, Clone)]
pub struct WorkspaceConfig {
  /// The JSON schema reference describing the workspace configuration
  pub schema: String,
  /// The configuration values parsed from the file
  pub config: Option<Config>,
  /// The filepath of the Storm config. When this field is null, no config file was found in the current workspace.
  pub config_file: Option<String>,
  /// Optional configuration presets to extend from
  pub extends: Option<ExtendsConfig>,
  /// The root directory of the package
  pub workspace_root: String,
  /// The name of the package
  pub name: String,
  /// The namespace of the package
  pub namespace: String,
  /// The configured workspace variant
  pub variant: WorkspaceVariant,
  /// The organization configuration backing the workspace
  pub organization: OrganizationConfig,
  /// The repo URL of the workspace (i.e. GitHub)
  pub repository: String,
  /// The license used by the package
  pub license: String,
  /// The homepage of the workspace
  pub homepage: String,
  /// The documentation site for the workspace
  pub docs: Option<String>,
  /// The development portal site for the workspace
  pub portal: Option<String>,
  /// The licensing site for the workspace
  pub licensing: Option<String>,
  /// The contact site for the workspace
  pub contact: Option<String>,
  /// The support site for the workspace
  pub support: Option<String>,
  /// The branch of the workspace
  pub branch: String,
  /// A tag specifying the version pre-release identifier
  pub preid: Option<String>,
  /// The owner of the package
  pub owner: String,
  /// The workspace bot configuration used to automate tasks
  pub bot: WorkspaceBotConfig,
  /// The current workspace runtime mode (development/test/production)
  pub mode: WorkspaceMode,
  /// Configured color settings for the workspace
  pub colors: ColorsConfig,
  /// The workspace release configuration
  pub release: WorkspaceReleaseConfig,
  /// The workspace socials configuration
  pub socials: SocialsConfig,
  /// The workspace error configuration
  pub error: WorkspaceErrorConfig,
  /// Should all known types of workspace caching be skipped?
  pub skip_cache: bool,
  /// The registry configuration for the workspace
  pub registry: RegistryUrlConfig,
  /// The directories configuration for the workspace
  pub directories: WorkspaceDirectoriesConfig,
  /// The package manager used by the repository
  pub package_manager: PackageManagerType,
  /// The default timezone of the workspace
  pub timezone: String,
  /// The default locale of the workspace
  pub locale: String,
  /// The log level used to filter out lower priority log messages. If not provided, this is defaulted using the `environment` config value (if `environment` is set to `production` then `level` is `error`, else `level` is `debug`).
  pub log_level: LogLevel,
  /// Should the logging of the current Storm Workspace configuration be skipped?
  pub skip_config_logging: bool,
  /// Configuration of each used extension
  pub extensions: RefCell<HashMap<String, HashMap<String, Value>>>,
}

impl WorkspaceConfig {
  pub fn new() -> Result<Self, ConfigError> {
    let mut workspace_config = WorkspaceConfig::default();

    let workspace_root = get_workspace_root().expect("No workspace root could be found");
    match fs::metadata(format!("{}/package.json", workspace_root.to_string_lossy())) {
      Ok(_) => {
        let package_json_path = format!("{}/package.json", workspace_root.to_string_lossy());

        let package_json: PackageJson = serde_json::from_reader(
          std::fs::File::open(Path::new(&package_json_path))
            .expect("Unable to read package.json file"),
        )
        .expect("error while reading or parsing");

        workspace_config.config = Some(
          Config::builder()
            .set_default("name", package_json.name)?
            .set_default("namespace", package_json.namespace)?
            .set_default("repository", package_json.repository.get("url").unwrap().to_string())?
            .set_default("license", package_json.license)?
            .set_default("homepage", package_json.homepage)?
            .set_default("workspace_root", workspace_root.to_str().unwrap().to_string())?
            .add_source(
              File::with_name(&format!(
                "{}/storm-workspace.json",
                workspace_root.to_string_lossy()
              ))
              .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/.storm/config.json", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!(
                "{}/storm-workspace.toml",
                workspace_root.to_string_lossy()
              ))
              .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/.storm/config.toml", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!(
                "{}/storm-workspace.yaml",
                workspace_root.to_string_lossy()
              ))
              .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/.storm/config.yaml", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(Environment::with_prefix("storm"))
            .build()?,
        );

        let config = workspace_config.config.as_ref().unwrap();
        if let Ok(found) = config.get_string("config_file") {
          workspace_config.config_file = Some(found);
        }
        if let Ok(found) = config.get_string("schema") {
          workspace_config.schema = found;
        }
        if let Ok(found) = config.get::<ExtendsConfig>("extends") {
          workspace_config.extends = Some(found);
        }
        if let Ok(found) = config.get_string("workspace_root") {
          workspace_config.workspace_root = found;
        }
        if let Ok(found) = config.get_string("name") {
          workspace_config.name = found;
        }
        if let Ok(found) = config.get_string("namespace") {
          workspace_config.namespace = found;
        }
        if let Ok(found) = config.get::<WorkspaceVariant>("variant") {
          workspace_config.variant = found;
        }
        if let Ok(found) = config.get::<OrganizationConfig>("organization") {
          workspace_config.organization = found;
        } else if let Ok(found) = config.get::<OrganizationConfig>("org") {
          workspace_config.organization = found;
        } else if let Ok(found) = config.get::<OrganizationConfig>("organization_config") {
          workspace_config.organization = found;
        }
        if let Ok(found) = config.get_string("repository") {
          workspace_config.repository = found;
        }
        if let Ok(found) = config.get_string("license") {
          workspace_config.license = found;
        }
        if let Ok(found) = config.get_string("homepage") {
          workspace_config.homepage = found;
        }
        if let Ok(found) = config.get_string("docs") {
          workspace_config.docs = Some(found);
        }
        if let Ok(found) = config.get_string("portal") {
          workspace_config.portal = Some(found);
        }
        if let Ok(found) = config.get_string("licensing") {
          workspace_config.licensing = Some(found);
        }
        if let Ok(found) = config.get_string("contact") {
          workspace_config.contact = Some(found);
        }
        if let Ok(found) = config.get_string("support") {
          workspace_config.support = Some(found);
        }
        if let Ok(found) = config.get_string("branch") {
          workspace_config.branch = found;
        }
        if let Ok(found) = config.get_string("preid") {
          workspace_config.preid = Some(found);
        }
        if let Ok(found) = config.get_string("owner") {
          workspace_config.owner = found;
        }
        if let Ok(found) = config.get_string("mode") {
          workspace_config.mode = WorkspaceMode::from_str(&found).unwrap();
        }
        if let Ok(found) = config.get_bool("skip_cache") {
          workspace_config.skip_cache = found;
        }
        if let Ok(found) = config.get_string("package_manager") {
          workspace_config.package_manager = PackageManagerType::from_str(&found).unwrap();
        }
        if let Ok(found) = config.get_string("timezone") {
          workspace_config.timezone = found;
        }
        if let Ok(found) = config.get_string("locale") {
          workspace_config.locale = found;
        }
        if let Ok(found) = config.get_string("log_level") {
          workspace_config.log_level = LogLevel::from_str(&found).unwrap();
        }
        if let Ok(found) = config.get_bool("skip_config_logging") {
          workspace_config.skip_config_logging = found;
        }
        if let Ok(found) = config.get::<WorkspaceReleaseConfig>("release") {
          workspace_config.release = found;
        }
        if let Ok(found) = config.get::<ColorsConfig>("colors") {
          workspace_config.colors = found;
        }
        if let Ok(found) = config.get::<WorkspaceBotConfig>("bot") {
          workspace_config.bot = found;
        } else if let Ok(found) = config.get::<WorkspaceBotConfig>("bot_config") {
          workspace_config.bot = found;
        } else if let Ok(found) = config.get::<WorkspaceBotConfig>("workspaceBot") {
          workspace_config.bot = found;
        }
        if let Ok(found) = config.get::<SocialsConfig>("socials") {
          workspace_config.socials = found;
        }
        if let Ok(found) = config.get::<WorkspaceErrorConfig>("error") {
          workspace_config.error = found;
        }
        if let Ok(found) = config.get::<RegistryUrlConfig>("registry") {
          workspace_config.registry = found;
        } else if let Ok(found) = config.get::<RegistryUrlConfig>("registry_urls") {
          workspace_config.registry = found;
        } else if let Ok(found) = config.get::<RegistryUrlConfig>("registryUrls") {
          workspace_config.registry = found;
        }
        if let Ok(found) = config.get::<WorkspaceDirectoriesConfig>("directories") {
          workspace_config.directories = found;
        }
        if let Ok(found) = config.get_string("package_manager") {
          workspace_config.package_manager = PackageManagerType::from_str(&found).unwrap();
        }

        Ok(workspace_config)
      }
      Err(_) => {
        return Err(ConfigError::NotFound(format!(
          "{}/package.json",
          workspace_root.to_string_lossy()
        )));
      }
    }
  }

  pub fn get_extension(&self, name: &str) -> Option<HashMap<String, Value>> {
    if let Some(existing) = self.extensions.borrow().get(name) {
      return Some(existing.clone());
    }

    let extension = self.config.as_ref().expect("Config value must be determined").get_table(name);
    match extension.is_ok() {
      true => {
        self.extensions.borrow_mut().insert(name.to_string(), extension.ok().unwrap());
        return self.extensions.borrow().get(name).cloned();
      }
      false => None,
    }
  }
}

impl Default for WorkspaceConfig {
  fn default() -> Self {
    WorkspaceConfig {
      schema: "https://stormsoftware.com/schemas/storm-workspace.json".to_string(),
      config: None,
      config_file: None,
      extends: None,
      workspace_root: get_workspace_root().unwrap().to_str().unwrap().to_string(),
      mode: WorkspaceMode::Production,
      variant: WorkspaceVariant::Monorepo,
      name: "storm-monorepo".to_string(),
      namespace: "storm-software".to_string(),
      organization: OrganizationConfig::default(),
      repository: "https://github.com/storm-software/storm-monorepo".to_string(),
      license: "Apache-2.0".to_string(),
      homepage: "https://stormsoftware.com".to_string(),
      branch: "main".to_string(),
      preid: None,
      docs: None,
      portal: None,
      licensing: None,
      contact: None,
      support: None,
      release: WorkspaceReleaseConfig::default(),
      socials: SocialsConfig::default(),
      error: WorkspaceErrorConfig::default(),
      directories: WorkspaceDirectoriesConfig::default(),
      owner: "@storm-software/admin".to_string(),
      bot: WorkspaceBotConfig::default(),
      log_level: LogLevel::Info,
      skip_config_logging: true,
      skip_cache: false,
      package_manager: PackageManagerType::Npm,
      registry: RegistryUrlConfig::default(),
      timezone: "America/New_York".to_string(),
      locale: "en-US".to_string(),
      colors: ColorsConfig::default(),
      extensions: HashMap::new().into(),
    }
  }
}
