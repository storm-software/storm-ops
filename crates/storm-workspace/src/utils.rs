use std::env;
use std::fs::read_dir;
use std::path::PathBuf;

use crate::errors::StormWorkspaceError;

const WORKSPACE_ROOT_FILES: [&str; 35] = [
  "storm.json",
  "storm.toml",
  "storm.yaml",
  "storm.yml",
  "storm.xml",
  "storm.config.js",
  "storm.config.ts",
  ".storm.json",
  ".storm.yaml",
  ".storm.yml",
  ".storm.js",
  ".storm.ts",
  "lerna.json",
  "nx.json",
  "turbo.json",
  "Cargo.lock",
  "npm-workspace.json",
  "yarn-workspace.json",
  "pnpm-workspace.json",
  "npm-workspace.yaml",
  "yarn-workspace.yaml",
  "pnpm-workspace.yaml",
  "npm-workspace.yml",
  "yarn-workspace.yml",
  "pnpm-workspace.yml",
  "npm-lock.json",
  "yarn-lock.json",
  "pnpm-lock.json",
  "npm-lock.yaml",
  "yarn-lock.yaml",
  "pnpm-lock.yaml",
  "npm-lock.yml",
  "yarn-lock.yml",
  "pnpm-lock.yml",
  "bun.lockb",
];

/// Get the workspace root
///
/// This function will return the workspace root directory by checking the current directory and its ancestors for the presence of a workspace root file.
///
/// The file list checked to determine the workspace root directory include:
/// - storm.json
/// - storm.toml
/// - storm.yaml
/// - storm.yml
/// - storm.xml
/// - storm.config.js
/// - storm.config.ts
/// - .storm.json
/// - .storm.yaml
/// - .storm.yml
/// - .storm.js
/// - .storm.ts
/// - lerna.json
/// - nx.json
/// - turbo.json
/// - Cargo.lock
/// - npm-workspace.json
/// - yarn-workspace.json
/// - pnpm-workspace.json
/// - npm-workspace.yaml
/// - yarn-workspace.yaml
/// - pnpm-workspace.yaml
/// - npm-workspace.yml
/// - yarn-workspace.yml
/// - pnpm-workspace.yml
/// - npm-lock.json
/// - yarn-lock.json
/// - pnpm-lock.json
/// - npm-lock.yaml
/// - yarn-lock.yaml
/// - pnpm-lock.yaml
/// - npm-lock.yml
/// - yarn-lock.yml
/// - pnpm-lock.yml
/// - bun.lockb
///
/// ```rust,no_run
/// match project_root::get_project_root() {
///     Ok(p) => println!("Current project root is {:?}", p),
///     Err(e) => println!("Error obtaining project root {:?}", e)
/// };
/// ```
pub fn get_workspace_root() -> Result<PathBuf, StormWorkspaceError> {
  match env::var("STORM_WORKSPACE_ROOT") {
    Ok(workspace_root) => {
      return Ok(PathBuf::from(workspace_root));
    }
    Err(_) => {}
  }
  match env::var("NX_WORKSPACE_ROOT") {
    Ok(workspace_root) => {
      return Ok(PathBuf::from(workspace_root));
    }
    Err(_) => {}
  }

  match env::current_dir() {
    Ok(path) => {
      let mut path_ancestors = path.as_path().ancestors();

      while let Some(p) = path_ancestors.next() {
        match read_dir(p) {
          Ok(dir) => {
            if dir
              .into_iter()
              .any(|p| WORKSPACE_ROOT_FILES.contains(&p.unwrap().file_name().to_str().unwrap()))
            {
              return Ok(PathBuf::from(p));
            }
          }

          Err(_) => {
            return Err(StormWorkspaceError::ReadDirectoryFailure(p.to_str().unwrap().to_string()))
          }
        }
      }
      Err(StormWorkspaceError::WorkspaceRootNotFound(
        WORKSPACE_ROOT_FILES.iter().map(|f| f.to_string()).collect::<Vec<String>>().join(", \r\n"),
      ))
    }
    Err(_) => Err(StormWorkspaceError::NoCurrentDirectory),
  }
}
