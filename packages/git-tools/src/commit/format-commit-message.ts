import { StormWorkspaceConfig } from "@storm-software/config/types";
import wrap from "word-wrap";
import type { CommitState } from "../types";

const MAX_LINE_WIDTH = 72;

export const formatCommitMessage = (
  state: CommitState,
  workspaceConfig: StormWorkspaceConfig
) => {
  const { config, answers } = state;
  const wrapOptions = {
    indent: "",
    trim: true,
    width: MAX_LINE_WIDTH
  };

  if (typeof answers.type !== "string") {
    throw new Error("Invalid commit type.");
  }
  if (typeof answers.subject !== "string") {
    throw new Error("Invalid subject type.");
  }
  if (
    workspaceConfig.variant !== "minimal" &&
    typeof answers.scope !== "string"
  ) {
    throw new Error("Invalid commit scope.");
  }

  const emoji = answers.type?.[answers.type]?.emoji
    ? answers.type[answers.type].emoji
    : "";
  const scope =
    workspaceConfig.variant !== "minimal" &&
    typeof answers.scope === "string" &&
    answers.scope
      ? answers.scope.trim()
      : "";
  const subject = answers.subject?.trim();
  const type = answers.type;

  const format =
    config.settings.format ||
    (workspaceConfig.variant !== "minimal"
      ? "{type}({scope}): {emoji}{subject}"
      : "{type}: {emoji}{subject}");

  // Wrap these lines at MAX_LINE_WIDTH character
  const body =
    answers.body && typeof answers.body === "string"
      ? wrap(answers.body || "", wrapOptions)
      : "";
  const breaking =
    answers.breakingBody && typeof answers.breakingBody === "string"
      ? wrap(answers.breakingBody || "", wrapOptions)
      : "";
  const issues =
    answers.issuesBody && typeof answers.issuesBody === "string"
      ? wrap(answers.issuesBody || "", wrapOptions)
      : "";

  // @note(emoji) Add space after emoji (breakingChangePrefix/closedIssueEmoji)
  const head = format
    .replace(/\{emoji\}/g, config.settings.disableEmoji ? "" : `${emoji} `)
    .replace(/\{scope\}/g, scope)
    .replace(/\{subject\}/g, subject || "")
    .replace(/\{type\}/g, type || "");

  let msg = head;

  if (body) {
    msg += `\n\n${body}`;
  }

  if (breaking) {
    const breakingEmoji = config.settings.disableEmoji
      ? ""
      : config.settings.breakingChangePrefix;

    msg += `\n\nBREAKING CHANGE: ${breakingEmoji}${breaking}`;
  }

  if (issues) {
    const closedIssueEmoji = config.settings.disableEmoji
      ? ""
      : config.settings.closedIssuePrefix;

    msg += `\n\n${closedIssueEmoji}${config.settings.closedIssueMessage}${issues}`;
  }

  return msg;
};
