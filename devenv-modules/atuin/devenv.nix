{ pkgs, ... }:
{
  packages = with pkgs; [
    zsh
    zsh-autosuggestions
    zsh-completions
    atuin
  ];

  enterShell = ''
    echo 'eval "$(atuin init zsh)"' >> ~/.zshrc
    atuin import zsh
    atuin gen-completions --shell zsh --out-dir $HOME
  '';
}
