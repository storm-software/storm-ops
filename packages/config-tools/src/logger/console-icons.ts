import isUnicodeSupported from "is-unicode-supported";
import { LogLevelLabel } from "../types";

const unicode = isUnicodeSupported();
const useIcon = (c: string, fallback: string) => (unicode ? c : fallback);

export const CONSOLE_ICONS: { [k in LogLevelLabel]?: string } = {
  [LogLevelLabel.ERROR]: useIcon("✘", "×"),
  [LogLevelLabel.FATAL]: useIcon("💀", "×"),
  [LogLevelLabel.WARN]: useIcon("⚠", "‼"),
  [LogLevelLabel.INFO]: useIcon("ℹ", "i"),
  [LogLevelLabel.SUCCESS]: useIcon("✔", "√"),
  [LogLevelLabel.DEBUG]: useIcon("🛠", "D"),
  [LogLevelLabel.TRACE]: useIcon("✉", "→")
};

// start: s("◐", "o"),
