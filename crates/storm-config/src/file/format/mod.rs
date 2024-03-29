// If no features are used, there is an "unused mut" warning in `ALL_EXTENSIONS`
// BUG: ? For some reason this doesn't do anything if I try and function scope this
#![allow(unused_mut)]

use crate::map::Map;
use crate::{file::FileStoredFormat, value::Value, Format};
use lazy_static::lazy_static;
use std::collections::HashMap;
use std::error::Error;

mod json;

#[cfg(feature = "toml")]
mod toml;

#[cfg(feature = "yaml")]
mod yaml;

#[cfg(feature = "ini")]
mod ini;

#[cfg(feature = "ron")]
mod ron;

#[cfg(feature = "json5")]
mod json5;

/// File formats provided by the library.
///
/// Although it is possible to define custom formats using [`Format`] trait it is recommended to use FileFormat if possible.
#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub enum FileFormat {
  /// JSON (parsed with serde_json)
  Json,

  /// TOML (parsed with toml)
  #[cfg(feature = "toml")]
  Toml,

  /// YAML (parsed with yaml_rust)
  #[cfg(feature = "yaml")]
  Yaml,

  /// INI (parsed with rust_ini)
  #[cfg(feature = "ini")]
  Ini,

  /// RON (parsed with ron)
  #[cfg(feature = "ron")]
  Ron,

  /// JSON5 (parsed with json5)
  #[cfg(feature = "json5")]
  Json5,
}

lazy_static! {
    #[doc(hidden)]
    // #[allow(unused_mut)] ?
    pub static ref ALL_EXTENSIONS: HashMap<FileFormat, Vec<&'static str>> = {
        let mut formats: HashMap<FileFormat, Vec<_>> = HashMap::new();

        formats.insert(FileFormat::Json, vec!["json"]);

        #[cfg(feature = "toml")]
        formats.insert(FileFormat::Toml, vec!["toml"]);

        #[cfg(feature = "yaml")]
        formats.insert(FileFormat::Yaml, vec!["yaml", "yml"]);

        #[cfg(feature = "ini")]
        formats.insert(FileFormat::Ini, vec!["ini"]);

        #[cfg(feature = "ron")]
        formats.insert(FileFormat::Ron, vec!["ron"]);

        #[cfg(feature = "json5")]
        formats.insert(FileFormat::Json5, vec!["json5"]);

        formats
    };
}

impl FileFormat {
  pub(crate) fn extensions(&self) -> &'static [&'static str] {
    // It should not be possible for this to fail
    // A FileFormat would need to be declared without being added to the
    // ALL_EXTENSIONS map.
    ALL_EXTENSIONS.get(self).unwrap()
  }

  pub(crate) fn parse(
    &self,
    uri: Option<&String>,
    text: &str,
  ) -> Result<Map<String, Value>, Box<dyn Error + Send + Sync>> {
    match self {
      FileFormat::Json => json::parse(uri, text),

      #[cfg(feature = "toml")]
      FileFormat::Toml => toml::parse(uri, text),

      #[cfg(feature = "yaml")]
      FileFormat::Yaml => yaml::parse(uri, text),

      #[cfg(feature = "ini")]
      FileFormat::Ini => ini::parse(uri, text),

      #[cfg(feature = "ron")]
      FileFormat::Ron => ron::parse(uri, text),

      #[cfg(feature = "json5")]
      FileFormat::Json5 => json5::parse(uri, text),

      #[cfg(all(
        not(feature = "toml"),
        not(feature = "yaml"),
        not(feature = "ini"),
        not(feature = "ron"),
        not(feature = "json5"),
      ))]
      _ => unreachable!("No features are enabled, this library won't work without features"),
    }
  }
}

impl Format for FileFormat {
  fn parse(
    &self,
    uri: Option<&String>,
    text: &str,
  ) -> Result<Map<String, Value>, Box<dyn Error + Send + Sync>> {
    self.parse(uri, text)
  }
}

impl FileStoredFormat for FileFormat {
  fn file_extensions(&self) -> &'static [&'static str] {
    self.extensions()
  }
}
