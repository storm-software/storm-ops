import wrap from "word-wrap";
import type { CommitState } from "../types";

const MAX_LINE_WIDTH = 72;

/*export const makeAffectsLine = function (answers: CommitStateAnswers) {
  const selectedPackages = answers.packages;

  if (selectedPackages && selectedPackages.length) {
    return `\naffects: ${selectedPackages.join(", ")}`;
  }

  return "";
};*/

export const formatCommitMessage = (state: CommitState) => {
  const { config, answers } = state;
  const wrapOptions = {
    indent: "",
    trim: true,
    width: MAX_LINE_WIDTH
  };

  const emoji = answers.type?.[answers.type]?.emoji ? answers.type[answers.type].emoji : "";
  const scope = answers.scope ? answers.scope.trim() : "";
  const subject = answers.subject?.trim();
  const type = answers.type;

  const format = config.format || "{type}({scope}): {emoji}{subject}";

  //const affectsLine = makeAffectsLine(answers);

  // Wrap these lines at MAX_LINE_WIDTH character
  const body = wrap(answers.body || "", wrapOptions);
  const breaking = wrap(answers.breaking || "", wrapOptions);
  const issues = wrap(answers.issues || "", wrapOptions);

  // @note(emoji) Add space after emoji (breakingChangePrefix/closedIssueEmoji)
  const head = format
    .replace(/\{emoji\}/g, config.disableEmoji ? "" : `${emoji} `)
    .replace(/\{scope\}/g, scope)
    .replace(/\{subject\}/g, subject || "")
    .replace(/\{type\}/g, type || "");

  let msg = head;

  if (body) {
    msg += `\n\n${body}`;
  }

  if (breaking) {
    const breakingEmoji = config.disableEmoji ? "" : config.breakingChangePrefix;

    msg += `\n\nBREAKING CHANGE: ${breakingEmoji}${breaking}`;
  }

  if (issues) {
    const closedIssueEmoji = config.disableEmoji ? "" : config.closedIssuePrefix;

    msg += `\n\n${closedIssueEmoji}${config.closedIssueMessage}${issues}`;
  }

  return msg;
};
