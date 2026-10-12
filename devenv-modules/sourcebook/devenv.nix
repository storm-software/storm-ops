{ config, pkgs, ... }:
let
  skillsDirectory = "${config.devenv.root}/.agents/skills";
in
{
  packages = [ pkgs.nodejs ];

  # Install each Sourcebook skill once. Skills already present are left alone,
  # so entering the shell stays fast and works offline after the first run.
  enterShell = ''
    for skill in sourcebook-adr sourcebook-editor sourcebook-docs sourcebook-readme; do
      if [ ! -d "${skillsDirectory}/$skill" ]; then
        echo "Installing Sourcebook skill $skill"
        (cd "${config.devenv.root}" && npx --yes skills add https://github.com/storm-software/sourcebook --skill "$skill" --yes) ||
          echo "Failed to install Sourcebook skill $skill" >&2
      fi
    done
  '';
}
