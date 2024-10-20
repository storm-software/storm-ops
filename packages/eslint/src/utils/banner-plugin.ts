import { ESLintUtils } from "@typescript-eslint/utils";
import { ESLint, Linter, Rule } from "eslint";
import os from "node:os";
import { CODE_FILE } from "./constants";
import { getFileBanner } from "./get-file-banner";

function match(actual, expected) {
  if (expected.test) {
    return expected.test(actual);
  } else {
    return expected === actual;
  }
}

function excludeShebangs(comments) {
  return comments.filter(function (comment) {
    return comment.type !== "Shebang";
  });
}

// Returns either the first block comment or the first set of line comments that
// are ONLY separated by a single newline. Note that this does not actually
// check if they are at the start of the file since that is already checked by
// hasBanner().
function getLeadingComments(context, node) {
  const all = excludeShebangs(
    context
      .getSourceCode()
      .getAllComments(node.body.length ? node.body[0] : node)
  );
  if (all[0].type.toLowerCase() === "block") {
    return [all[0]];
  }
  let i = 1;
  for (i = 1; i < all.length; ++i) {
    const txt = context
      .getSourceCode()
      .getText()
      .slice(all[i - 1].range[1], all[i].range[0]);
    if (!txt.match(/^(\r\n|\r|\n)$/)) {
      break;
    }
  }

  return all.slice(0, i);
}

function genCommentBody(commentType, textArray, eol, numNewlines) {
  const eols = eol.repeat(numNewlines);
  if (commentType === "block") {
    return "/*" + textArray.join(eol) + "*/" + eols;
  } else {
    return "//" + textArray.join(eol + "//") + eols;
  }
}

function genCommentsRange(context, comments, eol) {
  const start = comments[0].range[0];
  let end = comments.slice(-1)[0].range[1];
  if (context.getSourceCode().text[end] === eol) {
    end += eol.length;
  }
  return [start, end];
}

function genPrependFixer(commentType, node, bannerLines, eol, numNewlines) {
  return function (fixer) {
    return fixer.insertTextBefore(
      node,
      genCommentBody(commentType, bannerLines, eol, numNewlines)
    );
  };
}

function genReplaceFixer(
  commentType,
  context,
  leadingComments,
  bannerLines,
  eol,
  numNewlines
) {
  return function (fixer) {
    return fixer.replaceTextRange(
      genCommentsRange(context, leadingComments, eol),
      genCommentBody(commentType, bannerLines, eol, numNewlines)
    );
  };
}

function getEOL(options) {
  if (options.lineEndings === "unix") {
    return "\n";
  }
  if (options.lineEndings === "windows") {
    return "\r\n";
  }

  return os.EOL;
}

function hasBanner(commentType: "block" | "line" | string, src: string) {
  if (src.startsWith("#!")) {
    const bannerLines = src.split(/\r?\n/);
    if (bannerLines && bannerLines.length > 1) {
      bannerLines.shift();

      while (
        bannerLines.length &&
        bannerLines[0] &&
        !bannerLines[0].replace(/\s+/, "")
      ) {
        bannerLines.shift();
      }

      if (bannerLines.length) {
        src = bannerLines.join("\n");
      } else {
        return false;
      }
    }
  }

  return (
    (commentType === "block" && src.startsWith("/*")) ||
    (commentType === "lint" && src.startsWith("//")) ||
    (commentType !== "block" &&
      commentType !== "lint" &&
      commentType &&
      src.startsWith(commentType))
  );
}

// function hasBanner(
//   banner: string,
//   src: string,
//   commentType?: "block" | "line" | string
// ) {
//   if (src.substr(0, 2) === "#!") {
//     const m = src.match(/(\r\n|\r|\n)/);
//     if (m?.index) {
//       src = src.slice(m.index + m[0].length);
//     }
//   }
//   return (
//     ((commentType === "block" && src.substr(0, 2) === "/*") ||
//       (commentType === "lint" && src.substr(0, 2) === "//") ||
//       (commentType !== "block" &&
//         commentType !== "lint" &&
//         src.substr(0, commentType?.length) === commentType)) &&
//     src
//       .replaceAll(
//         commentType === "block"
//           ? "/*"
//           : commentType === "lint"
//             ? "//"
//             : commentType,
//         ""
//       )
//       .replaceAll("*/", "")
//       .includes(banner)
//   );
// }

function matchesLineEndings(src, num) {
  for (let j = 0; j < num; ++j) {
    const m = src.match(/^(\r\n|\r|\n)/);
    if (m) {
      src = src.slice(m.index + m[0].length);
    } else {
      return false;
    }
  }
  return true;
}

type Options = [
  {
    banner?: string;
    repositoryName?: string;
    commentType?: "block" | "line" | string;
    numNewlines?: number;
    lineEndings?: "unix" | "windows";
  }
];

export type MessageIds =
  | "missingBanner"
  | "incorrectComment"
  | "incorrectBanner"
  | "noNewlineAfterBanner";

const bannerRule = ESLintUtils.RuleCreator(
  () => `https://docs.stormsoftware.com/eslint/rules/banner`
)<Options, MessageIds>({
  name: "banner",
  meta: {
    docs: {
      description: "Ensures the file has a Storm Software banner",
      recommended: "recommended"
    },
    schema: [
      {
        type: "object",
        properties: {
          banner: {
            type: "string",
            description:
              "The banner to enforce at the top of the file. If not provided, the banner will be read from the file specified in the commentStart option"
          },
          repositoryName: {
            type: "string",
            description:
              "The name of the repository to use when reading the banner from a file."
          },
          commentType: {
            type: "string",
            description:
              "The comment token to use for the banner. Defaults to block ('/* <banner> */')"
          },
          numNewlines: {
            type: "number",
            description:
              "The number of newlines to use after the banner. Defaults to 2"
          }
        },
        additionalProperties: false
      }
    ],
    type: "layout",
    messages: {
      missingBanner: "Missing banner",
      incorrectComment: "Banner should use the {{commentType}} comment type",
      incorrectBanner: "Incorrect banner",
      noNewlineAfterBanner: "No newline after banner"
    },
    fixable: "whitespace"
  },
  defaultOptions: [
    {
      repositoryName: "",
      commentType: "block",
      numNewlines: 2
    }
  ],
  create(
    context,
    [{ banner, repositoryName = "", commentType = "block", numNewlines = 2 }]
  ) {
    if (!banner) {
      banner = getFileBanner(repositoryName);
    }

    const options = context.options;
    const eol = getEOL(options);

    // If just one option then read comment from file

    // If any of the lines are regular expressions, then we can't
    // automatically fix them. We set this to true below once we
    // ensure none of the lines are of type RegExp
    const canFix = true;
    const bannerLines = banner.split(/\r?\n/);
    let fixLines = bannerLines;

    return {
      Program: function (node) {
        if (!hasBanner(commentType, context.sourceCode.getText())) {
          context.report({
            loc: node.loc,
            messageId: "missingBanner",
            fix: genPrependFixer(commentType, node, fixLines, eol, numNewlines)
          });
        } else {
          const leadingComments = getLeadingComments(context, node);

          if (!leadingComments.length) {
            context.report({
              loc: node.loc,
              messageId: "missingBanner",
              fix: canFix
                ? genPrependFixer(commentType, node, fixLines, eol, numNewlines)
                : null
            });
          } else if (leadingComments[0].type.toLowerCase() !== commentType) {
            context.report({
              loc: node.loc,
              messageId: "incorrectComment",
              data: {
                commentType
              },
              fix: canFix
                ? genReplaceFixer(
                    commentType,
                    context,
                    leadingComments,
                    fixLines,
                    eol,
                    numNewlines
                  )
                : null
            });
          } else {
            if (commentType === "line") {
              if (leadingComments.length < bannerLines.length) {
                context.report({
                  loc: node.loc,
                  messageId: "missingBanner",
                  fix: canFix
                    ? genReplaceFixer(
                        commentType,
                        context,
                        leadingComments,
                        fixLines,
                        eol,
                        numNewlines
                      )
                    : null
                });
                return;
              }
              for (let i = 0; i < bannerLines.length; i++) {
                if (!match(leadingComments[i].value, bannerLines[i])) {
                  context.report({
                    loc: node.loc,
                    messageId: "incorrectBanner",
                    fix: canFix
                      ? genReplaceFixer(
                          commentType,
                          context,
                          leadingComments,
                          fixLines,
                          eol,
                          numNewlines
                        )
                      : null
                  });
                  return;
                }
              }

              const postLineBanner = context
                .getSourceCode()
                .text.substr(
                  leadingComments[bannerLines.length - 1].range[1],
                  (numNewlines ?? 1) * 2
                );
              if (!matchesLineEndings(postLineBanner, numNewlines)) {
                context.report({
                  loc: node.loc,
                  messageId: "noNewlineAfterBanner",
                  fix: canFix
                    ? genReplaceFixer(
                        commentType,
                        context,
                        leadingComments,
                        fixLines,
                        eol,
                        numNewlines
                      )
                    : null
                });
              }
            } else {
              // if block comment pattern has more than 1 line, we also split the comment
              let leadingLines = [leadingComments[0].value];
              if (bannerLines.length > 1) {
                leadingLines = leadingComments[0].value.split(/\r?\n/);
              }

              let hasError = false;
              if (leadingLines.length > bannerLines.length) {
                hasError = true;
              }
              for (let i = 0; !hasError && i < bannerLines.length; i++) {
                if (!match(leadingLines[i], bannerLines[i])) {
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
                        commentType,
                        context,
                        leadingComments,
                        fixLines,
                        eol,
                        numNewlines
                      )
                    : null
                });
              } else {
                const postBlockBanner = context
                  .getSourceCode()
                  .text.substr(
                    leadingComments[0].range[1],
                    (numNewlines ?? 1) * 2
                  );
                if (!matchesLineEndings(postBlockBanner, numNewlines)) {
                  context.report({
                    loc: node.loc,
                    messageId: "noNewlineAfterBanner",
                    fix: canFix
                      ? genReplaceFixer(
                          commentType,
                          context,
                          leadingComments,
                          fixLines,
                          eol,
                          numNewlines
                        )
                      : null
                  });
                }
              }
            }
          }
        }
      }
    };
  }
});

const plugin: ESLint.Plugin = {
  meta: {
    name: "eslint-plugin-banner",
    version: "0.0.1"
  },
  configs: {} as Record<string, Linter.FlatConfig<Linter.RulesRecord>>,
  rules: {
    banner: bannerRule as unknown as
      | Rule.RuleModule
      | ((context: Rule.RuleContext) => Rule.RuleListener)
  },
  processors: {}
};

plugin.configs &&
  (plugin.configs.recommended = {
    name: "banner/recommended",
    plugins: { banner: plugin },
    files: [CODE_FILE],
    ignores: [
      "!**/docs/**/*",
      "!**/crates/**/*",
      "!**/tmp/**/*",
      "!**/dist/**/*",
      "!**/coverage/**/*",
      "!**/node_modules/**/*",
      "!**/.cache/**/*",
      "!**/.nx/**/*"
    ],
    rules: {
      "banner/banner": ["error", { commentType: "block", numNewlines: 2 }]
    }
  });

export default plugin;
