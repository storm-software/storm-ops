import wrap from "word-wrap";
import type { CommitState } from "../types";

const MAX_LINE_WIDTH = 72;

export const formatCommitMessage = (state: CommitState) => {
  const { config, answers } = state;
  const wrapOptions = {
    indent: "",
    trim: true,
    width: MAX_LINE_WIDTH,
  };

  if (typeof answers.type !== "string") {
    throw new Error("Invalid commit type.");
  }
  if (typeof answers.scope !== "string") {
    throw new Error("Invalid commit scope.");
  }
  if (typeof answers.subject !== "string") {
    throw new Error("Invalid subject type.");
  }

  const emoji = answers.type?.[answers.type]?.emoji
    ? answers.type[answers.type].emoji
    : "";
  const scope = answers.scope ? answers.scope.trim() : "";
  const subject = answers.subject?.trim();
  const type = answers.type;

  const format =
    config.prompt.settings.format || "{type}({scope}): {emoji}{subject}";

  //const affectsLine = makeAffectsLine(answers);

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
    .replace(
      /\{emoji\}/g,
      config.prompt.settings.disableEmoji ? "" : `${emoji} `,
    )
    .replace(/\{scope\}/g, scope)
    .replace(/\{subject\}/g, subject || "")
    .replace(/\{type\}/g, type || "");

  let msg = head;

  if (body) {
    msg += `\n\n${body}`;
  }

  if (breaking) {
    const breakingEmoji = config.prompt.settings.disableEmoji
      ? ""
      : config.prompt.settings.breakingChangePrefix;

    msg += `\n\nBREAKING CHANGE: ${breakingEmoji}${breaking}`;
  }

  if (issues) {
    const closedIssueEmoji = config.prompt.settings.disableEmoji
      ? ""
      : config.prompt.settings.closedIssuePrefix;

    msg += `\n\n${closedIssueEmoji}${config.prompt.settings.closedIssueMessage}${issues}`;
  }

  return msg;
};
