use thiserror::Error;

#[derive(Error, Debug)]
pub enum StormWorkspaceError {
  #[error("Unable to find the current directory - are you in a valid workspace?")]
  NoCurrentDirectory,
  #[error("A failure occured while attempting to read the directory {0}")]
  ReadDirectoryFailure(String),
  #[error(
    "Unable to find the workspace root directory - must contain one of the following files: {0}"
  )]
  WorkspaceRootNotFound(String),
}
