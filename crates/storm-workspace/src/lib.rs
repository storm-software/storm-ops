pub mod errors;
pub mod utils;

#[cfg(test)]
mod tests {
  use crate::utils::get_workspace_root;
  use std::fs::read_to_string;

  #[test]
  fn it_should_find_workspace_root() {
    let crate_name = "name = 'storm-ops'";

    let project_root = get_workspace_root().expect("There is no project root");
    let toml_path = project_root.to_str().unwrap().to_owned() + "/Cargo.toml";
    let toml_string = read_to_string(toml_path).unwrap();

    assert!(toml_string.contains(crate_name));
  }
}
