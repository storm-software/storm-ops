use crate::{types::PackageJson, Config, ConfigError, Environment, File, Value};
use serde::{Deserialize, Serialize};
use std::{cell::RefCell, collections::HashMap, fmt, fs, path::Path, str::FromStr};
use storm_workspace::utils::get_workspace_root;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum EnvironmentType {
  Development,
  Staging,
  Production,
}

impl FromStr for EnvironmentType {
  type Err = ();

  fn from_str(input: &str) -> Result<EnvironmentType, Self::Err> {
    match input {
      "development" => Ok(EnvironmentType::Development),
      "staging" => Ok(EnvironmentType::Staging),
      "production" => Ok(EnvironmentType::Production),
      _ => Err(()),
    }
  }
}

impl fmt::Display for EnvironmentType {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match *self {
      EnvironmentType::Development => write!(f, "development"),
      EnvironmentType::Staging => write!(f, "staging"),
      EnvironmentType::Production => write!(f, "production"),
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
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
pub enum LogLevel {
  Silent,
  Fatal,
  Error,
  Warn,
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
      LogLevel::Info => write!(f, "info"),
      LogLevel::Debug => write!(f, "debug"),
      LogLevel::Trace => write!(f, "trace"),
      LogLevel::All => write!(f, "all"),
    }
  }
}

/// Storm Workspace config values used during various dev-ops processes. It represents the config of the entire monorepo.
#[derive(Debug, Clone)]
pub struct StormConfig {
  /// The name of the package
  pub name: String,
  /// The namespace of the package
  pub namespace: String,
  /// The organization of the workspace
  pub organization: String,
  /// The repo URL of the workspace (i.e. GitHub)
  pub repository: String,
  /// The license used by the package
  pub license: String,
  /// The homepage of the workspace
  pub homepage: String,
  /// The branch of the workspace
  pub branch: String,
  /// A tag specifying the version pre-release identifier
  pub preid: Option<String>,
  /// The owner of the package
  pub owner: String,
  /// The worker of the package (this is the bot that will be used to perform various tasks)
  pub worker: String,
  /// The current runtime environment of the package
  pub env: EnvironmentType,
  /// The current profile id to use during processing
  pub profile: Option<String>,
  /// An indicator specifying if the current environment is a CI environment
  pub ci: bool,
  /// The root directory of the package
  pub workspace_root: String,
  /// The build will use these package patterns to determine if they should be external to the bundle
  pub external_package_patterns: Vec<String>,
  /// Should all known types of workspace caching be skipped?
  pub skip_cache: bool,
  /// The directory used to store the workspace's cached file data
  pub cache_directory: String,
  /// The build directory for the workspace
  pub build_directory: String,
  /// The package manager used by the repository
  pub package_manager: PackageManagerType,
  /// The default timezone of the workspace
  pub timezone: String,
  /// The default locale of the workspace
  pub locale: String,
  /// The log level used to filter out lower priority log messages. If not provided, this is defaulted using the `environment` config value (if `environment` is set to `production` then `level` is `error`, else `level` is `debug`).
  pub log_level: LogLevel,
  /// The filepath of the Storm config. When this field is null, no config file was found in the current workspace.
  pub config_file: Option<String>,
  /// Configuration of each used extension
  pub extensions: RefCell<HashMap<String, HashMap<String, Value>>>,
  /// The configuration values parsed from the file
  pub config: Option<Config>,
}

impl StormConfig {
  pub fn new() -> Result<Self, ConfigError> {
    let mut storm_config = StormConfig::default();

    let workspace_root = get_workspace_root().expect("No workspace root could be found");
    match fs::metadata(format!("{}/package.json", workspace_root.to_string_lossy())) {
      Ok(_) => {
        let package_json_path = format!("{}/package.json", workspace_root.to_string_lossy());

        let package_json: PackageJson = serde_json::from_reader(
          std::fs::File::open(Path::new(&package_json_path))
            .expect("Unable to read package.json file"),
        )
        .expect("error while reading or parsing");

        storm_config.config = Some(
          Config::builder()
            .set_default("name", package_json.name)?
            .set_default("namespace", package_json.namespace)?
            .set_default("repository", package_json.repository.get("url").unwrap().to_string())?
            .set_default("license", package_json.license)?
            .set_default("homepage", package_json.homepage)?
            .set_default("workspace_root", workspace_root.to_str().unwrap().to_string())?
            .add_source(
              File::with_name(&format!("{}/storm.json", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/.storm/config.json", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/storm.toml", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/.storm/config.toml", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/storm.yaml", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(
              File::with_name(&format!("{}/.storm/config.yaml", workspace_root.to_string_lossy()))
                .required(false),
            )
            .add_source(Environment::with_prefix("storm"))
            .build()?,
        );

        let config = storm_config.config.as_ref().unwrap();
        if let Ok(found) = config.get_string("name") {
          storm_config.name = found;
        }
        if let Ok(found) = config.get_string("namespace") {
          storm_config.namespace = found;
        }
        if let Ok(found) = config.get_string("organization") {
          storm_config.organization = found;
        }
        if let Ok(found) = config.get_string("repository") {
          storm_config.repository = found;
        }
        if let Ok(found) = config.get_string("license") {
          storm_config.license = found;
        }
        if let Ok(found) = config.get_string("homepage") {
          storm_config.homepage = found;
        }
        if let Ok(found) = config.get_string("branch") {
          storm_config.branch = found;
        }
        if let Ok(found) = config.get_string("preid") {
          storm_config.preid = Some(found);
        }
        if let Ok(found) = config.get_string("owner") {
          storm_config.owner = found;
        }
        if let Ok(found) = config.get_string("worker") {
          storm_config.worker = found;
        }
        if let Ok(found) = config.get_string("env") {
          storm_config.env = EnvironmentType::from_str(&found).unwrap();
        }
        if let Ok(found) = config.get_string("profile") {
          storm_config.profile = Some(found);
        }
        if let Ok(found) = config.get_bool("ci") {
          storm_config.ci = found;
        }
        if let Ok(found) = config.get_string("workspace_root") {
          storm_config.workspace_root = found;
        }
        if let Ok(found) = config.get_string("cache_directory") {
          storm_config.cache_directory = found;
        }
        if let Ok(found) = config.get_string("build_directory") {
          storm_config.build_directory = found;
        }
        if let Ok(found) = config.get_string("package_manager") {
          storm_config.package_manager = PackageManagerType::from_str(&found).unwrap();
        }
        if let Ok(found) = config.get_string("timezone") {
          storm_config.timezone = found;
        }
        if let Ok(found) = config.get_string("locale") {
          storm_config.locale = found;
        }
        if let Ok(found) = config.get_string("log_level") {
          storm_config.log_level = LogLevel::from_str(&found).unwrap();
        }
        if let Ok(found) = config.get_string("config_file") {
          storm_config.config_file = Some(found);
        }

        Ok(storm_config)
      }
      Err(_) => {
        return Err(ConfigError::NotFound(format!(
          "{}/package.json",
          workspace_root.to_string_lossy()
        )))
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

impl Default for StormConfig {
  fn default() -> Self {
    StormConfig {
      name: "storm-ops".to_string(),
      namespace: "storm".to_string(),
      organization: "storm-software".to_string(),
      log_level: LogLevel::Info,
      owner: "@storm-software/development".to_string(),
      worker: "Stormie-Bot".to_string(),
      env: EnvironmentType::Production,
      profile: None,
      ci: true,
      workspace_root: get_workspace_root().unwrap().to_str().unwrap().to_string(),
      external_package_patterns: vec![],
      skip_cache: false,
      cache_directory: "node_modules/.cache/storm".to_string(),
      build_directory: "dist".to_string(),
      package_manager: PackageManagerType::Npm,
      timezone: "America/New_York".to_string(),
      locale: "en-US".to_string(),
      repository: "".to_string(),
      license: "MIT".to_string(),
      homepage: "https://stormsoftware.org".to_string(),
      branch: "main".to_string(),
      preid: None,
      config_file: None,
      extensions: HashMap::new().into(),
      config: None,
    }
  }
}
