{ pkgs, ... }:
{
  # https://devenv.sh/packages/
  packages = [
    # Shell
    pkgs.zsh
    pkgs.zsh-autosuggestions
    pkgs.zsh-completions
    pkgs.atuin
  ];

  enterShell = ''
    echo 'eval "$(atuin init zsh)"' >> ~/.zshrc
    atuin import zsh
    atuin gen-completions --shell zsh --out-dir $HOME
  '';
}
