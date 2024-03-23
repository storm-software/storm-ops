use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct PackageJson {
  pub name: String,
  pub namespace: String,
  pub version: String,
  pub description: String,
  pub main: String,
  pub scripts: HashMap<String, String>,
  pub repository: HashMap<String, String>,
  pub keywords: Vec<String>,
  pub license: String,
  pub homepage: String,
}
