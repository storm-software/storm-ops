import { LogLevelLabel } from "../types";
import { isUnicodeSupported } from "./is-unicode-supported";

const useIcon = (c: string, fallback: string) =>
  isUnicodeSupported() ? c : fallback;

export const CONSOLE_ICONS: { [k in LogLevelLabel]?: string } = {
  [LogLevelLabel.ERROR]: useIcon("✘", "×"),
  [LogLevelLabel.FATAL]: useIcon("☢", "×"),
  [LogLevelLabel.WARN]: useIcon("⚠", "‼"),
  [LogLevelLabel.INFO]: useIcon("ℹ", "i"),
  [LogLevelLabel.SUCCESS]: useIcon("✔", "√"),
  [LogLevelLabel.DEBUG]: useIcon("🛠", "D"),
  [LogLevelLabel.TRACE]: useIcon("⚙", "T"),
  [LogLevelLabel.ALL]: useIcon("✉", "→")
};

// start: s("◐", "o"),
