//! A crate with helper utilities for managing shared configuration in Storm workspaces.
//!
//! This crate provides a set of tools for working with configuration files and
//! environment variables in a consistent way. It supports multiple file formats,
//! including JSON, YAML, TOML, and XML, and allows for easy merging and overriding
//! of configuration values from different sources.
//!
//! # Features
//! - The `WorkspaceConfig` struct representing the universal workspace configuration definition.
//! - Support for multiple configuration file formats (JSON, YAML, TOML, XML).
//! - Environment variable overrides.
//! - Hierarchical configuration with support for nested structures.
//! - Type-safe access to configuration values.
//! - Custom configuration sources via the `Source` trait.
//!
//! # Example
//! ```rust
//! use storm_config::{Config, File, FileFormat, FileSourceFile, Format};
//!
//! // Create a new configuration instance
//! let mut config = Config::default();
//!
//! // Merge a JSON configuration file
//! let file = File::new("config.json", FileFormat::Json);
//! config.merge(file).unwrap();
//!
//! // Access a configuration value
//! let db_host: String = config.get("database.host").unwrap();
//! println!("Database host: {}", db_host);
//! ```
//! For more information, please refer to the [documentation](https://docs.rs/storm-config).
#![allow(unknown_lints)]
// #![warn(missing_docs)]

pub mod builder;
mod config;
mod de;
mod env;
mod errors;
mod file;
mod format;
mod map;
mod path;
mod ser;
mod source;
mod value;

// Re-export
#[cfg(feature = "convert-case")]
pub use convert_case::Case;

#[allow(deprecated)]
pub use crate::builder::AsyncConfigBuilder;
pub use crate::builder::ConfigBuilder;
pub use crate::config::Config;
pub use crate::env::Environment;
pub use crate::errors::ConfigError;
pub use crate::file::source::FileSource;
pub use crate::file::{File, FileFormat, FileSourceFile, FileSourceString, FileStoredFormat};
pub use crate::format::Format;
pub use crate::map::Map;
#[cfg(feature = "async")]
pub use crate::source::AsyncSource;
pub use crate::source::Source;
pub use crate::value::{Value, ValueKind};

pub mod types;
pub mod workspace_config;

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    let result = 2 + 2;
    assert_eq!(result, 4);
  }
}
