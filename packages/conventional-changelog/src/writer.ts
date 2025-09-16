import compareFunc from "compare-func";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import {
  CommitGroup,
  CommitKnownProps,
  CommitNote,
  Context,
  Reference,
  ResolvedPresetOptions,
  TransformedCommit,
  WriteConfig
} from "./types";
import {
  CHANGELOG_COMMIT_TITLE_ORDER,
  HASH_SHORT_LENGTH,
  HEADER_MAX_LENGTH
} from "./utilities/constants";
import { matchScope } from "./utilities/helpers";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const releaseAsRegex =
  /release-as:\s*\w*@?([0-9]+\.[0-9]+\.[0-9a-z]+(-[0-9a-z.]+)?)\s*/i;

/**
 * Handlebar partials for various property substitutions based on commit context.
 */
const owner =
  "{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}";
const host = "{{~@root.host}}";
const repository =
  "{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}";

/**
 * Create writer options based on the provided config.
 *
 * @param config The configuration object.
 * @returns The writer options.
 */
export async function createWriterOpts(
  options: ResolvedPresetOptions
): Promise<WriteConfig> {
  const commitUrlFormat = expandTemplate(options.commitUrlFormat, {
    host,
    owner,
    repository
  });
  const compareUrlFormat = expandTemplate(options.compareUrlFormat, {
    host,
    owner,
    repository
  });
  const issueUrlFormat = expandTemplate(options.issueUrlFormat, {
    host,
    owner,
    repository,
    id: "{{this.issue}}",
    prefix: "{{this.prefix}}"
  });
  const [template, header, commit, footer] = await Promise.all([
    readFile(resolve(dirname, "./templates/template.hbs"), "utf-8"),
    readFile(resolve(dirname, "./templates/header.hbs"), "utf-8"),
    readFile(resolve(dirname, "./templates/commit.hbs"), "utf-8"),
    readFile(resolve(dirname, "./templates/footer.hbs"), "utf-8")
  ]);

  const writerOpts = getWriterOpts(options) as WriteConfig;
  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header.replace(
    /{{compareUrlFormat}}/g,
    compareUrlFormat
  );
  writerOpts.commitPartial = commit
    .replace(/{{commitUrlFormat}}/g, commitUrlFormat)
    .replace(/{{issueUrlFormat}}/g, issueUrlFormat);
  writerOpts.footerPartial = footer;

  return writerOpts;
}

function getWriterOpts(options: ResolvedPresetOptions): Partial<WriteConfig> {
  return {
    transform: (
      commit: CommitKnownProps,
      context: Context
    ): TransformedCommit | undefined => {
      let discard = true;
      const issues: string[] = [];
      const entry = findTypeEntry(options.types, commit);

      // Add an entry in the CHANGELOG if special Release-As footer
      // is used:
      if (
        (commit.footer && releaseAsRegex.test(commit.footer)) ||
        (commit.body && releaseAsRegex.test(commit.body))
      ) {
        discard = false;
      }

      const notes: CommitNote[] = (commit.notes || []).map(
        (note: CommitNote) => {
          discard = false;

          return {
            ...note,
            title: "BREAKING CHANGES"
          };
        }
      );

      if (
        // breaking changes attached to any type are still displayed.
        (discard && (entry === undefined || entry.hidden)) ||
        !matchScope(options, commit)
      ) {
        return undefined;
      }

      const type: string = entry ? entry.section : commit.type;
      const scope: string | undefined =
        commit.scope === "*" || options.scope ? "" : commit.scope;
      let { subject }: { subject?: string } = commit;

      if (typeof subject === "string") {
        // Issue URLs.
        const issueRegEx = `(${options.issuePrefixes.join("|")})([a-z0-9]+)`;
        const re = new RegExp(issueRegEx, "g");

        subject = subject.replace(re, (_, prefix: string, issue: string) => {
          issues.push(prefix + issue);

          const url: string = expandTemplate(options.issueUrlFormat, {
            host: context.host,
            owner: context.owner,
            repository: context.repository,
            id: issue,
            prefix
          });

          return `[${prefix}${issue}](${url})`;
        });

        subject = subject.replace(
          /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
          (_, user: string) => {
            if (user.includes("/")) {
              return `@${user}`;
            }

            const usernameUrl: string = expandTemplate(options.userUrlFormat, {
              host: context.host,
              owner: context.owner,
              repository: context.repository,
              user
            });

            return `[@${user}](${usernameUrl})`;
          }
        );
      }

      // remove references that already appear in the subject
      const references: Reference[] = (commit.references || []).filter(
        (reference: Reference) =>
          !issues.includes(reference.prefix + reference.issue)
      );

      return {
        ...commit,
        raw: commit,
        notes,
        type,
        scope: scope === undefined ? null : scope,
        subject,
        references,
        shortHash:
          typeof commit.hash === "string"
            ? commit.hash.substring(0, HASH_SHORT_LENGTH)
            : commit.shortHash,
        header:
          typeof commit.header === "string"
            ? commit.header.substring(0, HEADER_MAX_LENGTH)
            : commit.header,
        committerDate: commit.committerDate
          ? options.formatDate(commit.committerDate)
          : commit.committerDate
      };
    },
    groupBy: "type",
    // the groupings of commit messages, e.g., Features vs., Bug Fixes, are
    // sorted based on their probable importance:
    commitGroupsSort: (a: CommitGroup, b: CommitGroup) => {
      const gRankA: number = CHANGELOG_COMMIT_TITLE_ORDER.indexOf(a.title);
      const gRankB: number = CHANGELOG_COMMIT_TITLE_ORDER.indexOf(b.title);

      return gRankA - gRankB;
    },
    commitsSort: ["scope", "subject"],
    noteGroupsSort: "title",
    notesSort: compareFunc
  };
}

function findTypeEntry(types, commit) {
  const typeKey = (commit.revert ? "revert" : commit.type || "").toLowerCase();

  return types.find(entry => {
    if (entry.type !== typeKey) {
      return false;
    }

    if (entry.scope && entry.scope !== commit.scope) {
      return false;
    }

    return true;
  });
}

// expand on the simple mustache-style templates supported in
// configuration (we may eventually want to use handlebars for this).
function expandTemplate(template, context) {
  let expanded = template;

  Object.keys(context).forEach(key => {
    expanded = expanded.replace(new RegExp(`{{${key}}}`, "g"), context[key]);
  });
  return expanded;
}
