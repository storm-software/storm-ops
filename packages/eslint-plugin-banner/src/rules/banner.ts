/* -------------------------------------------------------------------

                  ⚡ Storm Software - Shell Shock

 This code was released as part of the Shell Shock project. Shell Shock
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/shell-shock.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/shell-shock
 Documentation:            https://docs.stormsoftware.com/projects/shell-shock
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { RuleFix, RuleFixer } from "@typescript-eslint/utils/ts-eslint";
import { EOL } from "node:os";
import { createRule } from "../helpers/create-rule";
import { getBanner } from "../helpers/get-banner";

export const RULE_NAME = "banner";
export type MessageIds =
  | "missingBanner"
  | "incorrectComment"
  | "incorrectBanner"
  | "noNewlineAfterBanner";
export type Options = [
  {
    name: string;
    license?: string;
    organization?: string;
    licensing?: string;
    repository?: string;
    docs?: string;
    homepage?: string;
    commentStyle?: "block" | "line" | string;
    newlines?: number;
    lineEndings?: "unix" | "windows";
  }
];

function match(actual: string, expected: string | RegExp | undefined) {
  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else {
    return expected === actual;
  }
}

type RuleNode = {
  type: string;
  range: [number, number];
  loc?: unknown;
  body?: unknown[];
};

type SourceCodeLike = {
  getText(): string;
  getAllComments(node: unknown): CommentNode[];
  text: string;
};

type RuleContextLike = {
  getSourceCode(): SourceCodeLike;
  sourceCode: SourceCodeLike;
};

type RuleNodeWithBody = RuleNode;

type CommentNode = RuleNode & {
  type: string;
  value: string;
  range: [number, number];
};

function excludeShebangs(comments: CommentNode[]) {
  return comments.filter(comment => {
    return comment.type !== "Shebang";
  });
}

/**
 * Get the leading comments for a node, excluding shebangs, and return either the first block comment or the first set of line comments that are only separated by a single newline.
 *
 * @param context - The ESLint rule context
 * @param node - The AST node to get the leading comments for
 * @returns An array of comment nodes that are either the first block comment or the first set of line comments that are only separated by a single newline
 */
function getLeadingComments(context: RuleContextLike, node: RuleNodeWithBody) {
  const firstBodyNode =
    Array.isArray(node.body) && node.body.length ? node.body[0] : node;
  const all = excludeShebangs(
    (context.sourceCode || context.getSourceCode()).getAllComments(
      firstBodyNode
    )
  );

  if (!all.length) {
    return [];
  }

  if (all[0] && all[0].type.toLowerCase() === "block") {
    return [all[0]];
  }

  let i = 1;
  for (i = 1; i < all.length; ++i) {
    const prev = all[i - 1];
    const current = all[i];
    if (!prev || !current) {
      break;
    }

    const txt = (context.sourceCode || context.getSourceCode())
      .getText()
      .slice(prev.range[1], current.range[0]);
    if (!txt.match(/^(\r\n|\r|\n)$/)) {
      break;
    }
  }

  return all.slice(0, i);
}

function genCommentBody(
  commentStyle: string,
  textArray: string[],
  eol: string,
  newlines: number
) {
  const eols = eol.repeat(newlines);
  if (commentStyle === "block") {
    return "/*" + textArray.join(eol) + "*/" + eols;
  } else {
    return "//" + textArray.join(eol + "//") + eols;
  }
}

function genCommentsRange(
  context: RuleContextLike,
  comments: CommentNode[],
  eol: string
): [number, number] {
  if (!comments[0]) {
    return [0, 0];
  }

  const start = comments[0].range[0];
  let end = comments.slice(-1)[0]?.range[1] ?? start;
  if ((context.sourceCode || context.getSourceCode()).text[end] === eol) {
    end += eol.length;
  }
  return [start, end];
}

function genPrependFixer(
  commentStyle: string,
  node: Parameters<RuleFixer["insertTextBefore"]>[0],
  bannerLines: string[],
  eol: string,
  newlines: number
) {
  return function (fixer: RuleFixer): RuleFix {
    return fixer.insertTextBefore(
      node,
      genCommentBody(commentStyle, bannerLines, eol, newlines)
    );
  };
}

function genReplaceFixer(
  commentStyle: string,
  context: RuleContextLike,
  leadingComments: CommentNode[],
  bannerLines: string[],
  eol: string,
  newlines: number
) {
  return function (fixer: RuleFixer): RuleFix {
    return fixer.replaceTextRange(
      genCommentsRange(context, leadingComments, eol),
      genCommentBody(commentStyle, bannerLines, eol, newlines)
    );
  };
}

function getEOL(options: Options[0]) {
  if (options.lineEndings === "unix") {
    return "\n";
  }
  if (options.lineEndings === "windows") {
    return "\r\n";
  }

  return EOL;
}

function hasBanner(
  commentStyle: "block" | "line" | string = "block",
  src: string,
  eol: string
) {
  if (src.startsWith("#!")) {
    const bannerLines = src.split(eol);
    if (bannerLines && bannerLines.length > 1) {
      bannerLines.shift();

      while (bannerLines.length && bannerLines[0] && !bannerLines[0].trim()) {
        bannerLines.shift();
      }

      if (bannerLines.length) {
        src = bannerLines.join(eol);
      } else {
        return false;
      }
    }
  }

  return (
    (commentStyle === "block" && src.startsWith("/*")) ||
    (commentStyle === "line" && src.startsWith("//")) ||
    (commentStyle !== "block" &&
      commentStyle !== "line" &&
      commentStyle &&
      src.startsWith(commentStyle))
  );
}

function matchesLineEndings(src: string, num: number) {
  for (let j = 0; j < num; ++j) {
    const m = src.match(/^(\r\n|\r|\n)/);
    if (m) {
      src = src.slice((m.index ?? 0) + m[0].length);
    } else {
      return false;
    }
  }
  return true;
}

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Ensures the file has a organization specific banner at the top of source code files"
    },
    schema: [
      {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "The name of the repository to use when reading the banner from a file."
          },
          license: {
            type: "string",
            description: "The project license to include in the banner."
          },
          organization: {
            type: "string",
            description: "The organization to include in the banner."
          },
          licensing: {
            type: "string",
            description: "The licensing URL to include in the banner."
          },
          repository: {
            type: "string",
            description: "The repository URL to include in the banner."
          },
          docs: {
            type: "string",
            description: "The documentation URL to include in the banner."
          },
          homepage: {
            type: "string",
            description: "The homepage URL to include in the banner."
          },
          commentStyle: {
            type: "string",
            description:
              "The comment token to use for the banner. Defaults to block ('/* <banner> */')"
          },
          newlines: {
            type: "number",
            description:
              "The number of newlines to use after the banner. Defaults to 1"
          },
          lineEndings: {
            type: "string",
            enum: ["unix", "windows"],
            description:
              "The type of line endings to use. Defaults to the system default"
          }
        },
        additionalProperties: false,
        required: ["name"]
      }
    ],
    type: "layout",
    messages: {
      missingBanner: "Missing banner",
      incorrectComment: "Banner should use the {{commentStyle}} comment type",
      incorrectBanner: "Incorrect banner",
      noNewlineAfterBanner: "No newline after banner"
    },
    fixable: "whitespace"
  },
  defaultOptions: [
    {
      name: "",
      commentStyle: "block",
      lineEndings: "unix",
      newlines: 2
    }
  ],
  create: context => {
    const {
      name,
      license,
      organization,
      licensing,
      repository,
      docs,
      homepage,
      commentStyle,
      newlines,
      lineEndings
    } = context.options[0];

    const banner = getBanner({
      name,
      license,
      organization,
      licensing,
      repository,
      docs,
      homepage
    });
    const eol = getEOL({ lineEndings, ...context.options[0] });
    const canFix = true;
    const bannerLines = banner.split(/\r?\n/);
    const normalizedCommentStyle = commentStyle ?? "block";
    let fixLines = bannerLines;

    return {
      Program(node) {
        const normalizedNewlines = newlines ?? 1;

        if (
          !hasBanner(
            normalizedCommentStyle,
            (context.sourceCode || context.getSourceCode()).getText(),
            eol
          )
        ) {
          context.report({
            loc: node.loc,
            messageId: "missingBanner",
            fix: genPrependFixer(
              normalizedCommentStyle,
              node,
              fixLines,
              eol,
              normalizedNewlines
            )
          });
        } else {
          const leadingComments = getLeadingComments(context, node);

          if (!leadingComments.length) {
            context.report({
              loc: node.loc,
              messageId: "missingBanner",
              fix: canFix
                ? genPrependFixer(
                    normalizedCommentStyle,
                    node,
                    fixLines,
                    eol,
                    normalizedNewlines
                  )
                : null
            });
          } else {
            const firstLeadingComment = leadingComments[0];
            if (!firstLeadingComment) {
              return;
            }

            if (
              firstLeadingComment.type.toLowerCase() !== normalizedCommentStyle
            ) {
              context.report({
                loc: node.loc,
                messageId: "incorrectComment",
                data: {
                  commentStyle: normalizedCommentStyle
                },
                fix: canFix
                  ? genReplaceFixer(
                      normalizedCommentStyle,
                      context,
                      leadingComments,
                      fixLines,
                      eol,
                      normalizedNewlines
                    )
                  : null
              });
            } else {
              if (normalizedCommentStyle === "line") {
                if (leadingComments.length < bannerLines.length) {
                  context.report({
                    loc: node.loc,
                    messageId: "missingBanner",
                    fix: canFix
                      ? genReplaceFixer(
                          normalizedCommentStyle,
                          context,
                          leadingComments,
                          fixLines,
                          eol,
                          normalizedNewlines
                        )
                      : null
                  });
                  return;
                }
                for (let i = 0; i < bannerLines.length; i++) {
                  const currentLeadingComment = leadingComments[i];
                  if (!currentLeadingComment) {
                    context.report({
                      loc: node.loc,
                      messageId: "incorrectBanner",
                      fix: canFix
                        ? genReplaceFixer(
                            normalizedCommentStyle,
                            context,
                            leadingComments,
                            fixLines,
                            eol,
                            normalizedNewlines
                          )
                        : null
                    });
                    return;
                  }

                  if (!match(currentLeadingComment.value, bannerLines[i])) {
                    context.report({
                      loc: node.loc,
                      messageId: "incorrectBanner",
                      fix: canFix
                        ? genReplaceFixer(
                            normalizedCommentStyle,
                            context,
                            leadingComments,
                            fixLines,
                            eol,
                            normalizedNewlines
                          )
                        : null
                    });
                    return;
                  }
                }

                const lastLeadingComment =
                  leadingComments[bannerLines.length - 1] ??
                  leadingComments[leadingComments.length - 1];

                if (!lastLeadingComment) {
                  return;
                }

                const postLineBanner = (
                  context.sourceCode || context.getSourceCode()
                ).text.substr(
                  lastLeadingComment.range[1],
                  normalizedNewlines * 2
                );
                if (!matchesLineEndings(postLineBanner, normalizedNewlines)) {
                  context.report({
                    loc: node.loc,
                    messageId: "noNewlineAfterBanner",
                    fix: canFix
                      ? genReplaceFixer(
                          normalizedCommentStyle,
                          context,
                          leadingComments,
                          fixLines,
                          eol,
                          normalizedNewlines
                        )
                      : null
                  });
                }
              } else {
                // if block comment pattern has more than 1 line, we also split the comment
                const firstLeadingComment = leadingComments[0];
                if (!firstLeadingComment) {
                  return;
                }

                let leadingLines = [firstLeadingComment.value];
                if (bannerLines.length > 1) {
                  leadingLines = firstLeadingComment.value.split(/\r?\n/);
                }

                let hasError = false;
                if (leadingLines.length > bannerLines.length) {
                  hasError = true;
                }
                for (let i = 0; !hasError && i < bannerLines.length; i++) {
                  if (!match(leadingLines[i] ?? "", bannerLines[i])) {
                    hasError = true;
                  }
                }

                if (hasError) {
                  if (canFix && bannerLines.length > 1) {
                    fixLines = [fixLines.join(eol)];
                  }
                  context.report({
                    loc: node.loc,
                    messageId: "incorrectBanner",
                    fix: canFix
                      ? genReplaceFixer(
                          normalizedCommentStyle,
                          context,
                          leadingComments,
                          fixLines,
                          eol,
                          normalizedNewlines
                        )
                      : null
                  });
                } else {
                  const postBlockBanner = (
                    context.sourceCode || context.getSourceCode()
                  ).text.substr(
                    firstLeadingComment.range[1],
                    normalizedNewlines * 2
                  );
                  if (
                    !matchesLineEndings(postBlockBanner, normalizedNewlines)
                  ) {
                    context.report({
                      loc: node.loc,
                      messageId: "noNewlineAfterBanner",
                      fix: canFix
                        ? genReplaceFixer(
                            normalizedCommentStyle,
                            context,
                            leadingComments,
                            fixLines,
                            eol,
                            normalizedNewlines
                          )
                        : null
                    });
                  }
                }
              }
            }
          }
        }
      }
    };
  }
});
