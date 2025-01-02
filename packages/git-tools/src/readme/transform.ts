import md from "@textlint/markdown-to-ast";
import anchor from "anchor-markdown-header";
import { Parser } from "htmlparser2";
import _ from "underscore";
import updateSection from "update-section";

export const start =
  "<!-- START doctoc -->\n" +
  "<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->";
export const end = "<!-- END doctoc -->";
export const skipTag = "<!-- DOCTOC SKIP -->";

function matchesStart(line) {
  return /<!-- START doctoc /.test(line);
}

function matchesEnd(line) {
  return /<!-- END doctoc /.test(line);
}

function notNull(x) {
  return x !== null;
}

function addAnchor(mode, header) {
  header.anchor = anchor(header.name, mode, header.instance);
  return header;
}

function getMarkdownHeaders(lines, maxHeaderLevel) {
  function extractText(header) {
    return header.children
      .map(function (x) {
        if (x.type === md.Syntax.Link) {
          return extractText(x);
        } else if (x.type === md.Syntax.Image) {
          // Images (at least on GitHub, untested elsewhere) are given a hyphen
          // in the slug. We can achieve this behavior by adding an '*' to the
          // TOC entry. Think of it as a "magic char" that represents the iamge.
          return "*";
        } else {
          return x.raw;
        }
      })
      .join("");
  }

  return md
    .parse(lines.join("\n"))
    .children.filter(function (x) {
      return x.type === md.Syntax.Header;
    })
    .map(function (x) {
      return !maxHeaderLevel || x.depth <= maxHeaderLevel
        ? { rank: x.depth, name: extractText(x), line: x.loc.start.line }
        : null;
    })
    .filter(notNull);
}

function countHeaders(headers) {
  const instances = {};

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const name = header.name;

    if (Object.prototype.hasOwnProperty.call(instances, name)) {
      // `instances.hasOwnProperty(name)` fails when there’s an instance named "hasOwnProperty".
      instances[name]++;
    } else {
      instances[name] = 0;
    }

    header.instance = instances[name];
  }

  return headers;
}

function getLinesToToc(lines, currentToc, info, processAll) {
  if (processAll || !currentToc) return lines;

  let tocableStart = 0;

  // when updating an existing toc, we only take the headers into account
  // that are below the existing toc
  if (info.hasEnd) tocableStart = info.endIdx + 1;

  return lines.slice(tocableStart);
}

// Use document context as well as command line args to infer the title
function determineTitle(title, notitle, lines, info) {
  const defaultTitle = "**Table of Contents** ";

  if (notitle) return "";
  if (title) return title;
  return info.hasStart ? lines[info.startIdx + 2] : defaultTitle;
}

export function transform(
  content,
  mode,
  maxHeaderLevel,
  title,
  notitle,
  entryPrefix,
  processAll,
  updateOnly
): any {
  if (content.indexOf(skipTag) !== -1) return { transformed: false };

  mode = mode || "github.com";
  entryPrefix = entryPrefix || "-";

  // only limit *HTML* headings by default
  const maxHeaderLevelHtml = maxHeaderLevel || 4;

  const lines = content.split("\n"),
    info = updateSection.parse(lines, matchesStart, matchesEnd);

  if (!info.hasStart && updateOnly) {
    return { transformed: false };
  }

  const inferredTitle = determineTitle(title, notitle, lines, info);

  const titleSeparator = inferredTitle ? "\n\n" : "\n";

  const currentToc =
      info.hasStart && lines.slice(info.startIdx, info.endIdx + 1).join("\n"),
    linesToToc = getLinesToToc(lines, currentToc, info, processAll);

  const headers = getMarkdownHeaders(linesToToc, maxHeaderLevel).concat(
    getHtmlHeaders(linesToToc, maxHeaderLevelHtml)
  );

  headers.sort(function (a, b) {
    return a.line - b.line;
  });

  const allHeaders = countHeaders(headers),
    lowestRank = _(allHeaders).chain().pluck("rank").min().value(),
    linkedHeaders = _(allHeaders).map(addAnchor.bind(null, mode));

  if (linkedHeaders.length === 0) return { transformed: false };

  // 4 spaces required for proper indention on Bitbucket and GitLab
  const indentation =
    mode === "bitbucket.org" || mode === "gitlab.com" ? "    " : "  ";

  const toc =
    inferredTitle +
    titleSeparator +
    linkedHeaders
      .map(function (x) {
        const indent = _(_.range(x.rank - lowestRank)).reduce(function (
          acc,
          x
        ) {
          return acc + indentation;
        }, "");

        return indent + entryPrefix + " " + x.anchor;
      })
      .join("\n") +
    "\n";

  const wrappedToc = start + "\n" + toc + "\n" + end;

  if (currentToc === toc) return { transformed: false };

  const data = updateSection(
    lines.join("\n"),
    wrappedToc,
    matchesStart,
    matchesEnd,
    true
  );
  return { transformed: true, data: data, toc: toc, wrappedToc: wrappedToc };
}

function addLinenos(lines, headers) {
  let current = 0,
    line;

  return headers.map(function (x) {
    for (let lineno = current; lineno < lines.length; lineno++) {
      line = lines[lineno];
      if (new RegExp(x.text[0]).test(line)) {
        current = lineno;
        x.line = lineno;
        x.name = x.text.join("");
        return x;
      }
    }

    // in case we didn't find a matching line, which is odd,
    // we'll have to assume it's right on the next line
    x.line = ++current;
    x.name = x.text.join("");
    return x;
  });
}

function rankify(headers, max) {
  return headers
    .map(function (x) {
      x.rank = parseInt(x.tag.slice(1), 10);
      return x;
    })
    .filter(function (x) {
      return x.rank <= max;
    });
}

export function getHtmlHeaders(lines, maxHeaderLevel) {
  const source = md
    .parse(lines.join("\n"))
    .children.filter(function (node) {
      return node.type === md.Syntax.HtmlBlock || node.type === md.Syntax.Html;
    })
    .map(function (node) {
      return node.raw;
    })
    .join("\n");

  let headers = [] as any[];
  const grabbing = [] as any[];
  let text = [] as any[];

  const parser = new Parser(
    {
      onopentag: function (name, attr) {
        // Short circuit if we're already inside a pre
        if (grabbing[grabbing.length - 1] === "pre") return;

        if (name === "pre" || /h\d/.test(name)) {
          grabbing.push(name);
        }
      },
      ontext: function (text_) {
        // Explicitly skip pre tags, and implicitly skip all others
        if (grabbing.length === 0 || grabbing[grabbing.length - 1] === "pre")
          return;

        text.push(text_);
      },
      onclosetag: function (name) {
        if (grabbing.length === 0) return;
        if (grabbing[grabbing.length - 1] === name) {
          const tag = grabbing.pop();
          headers.push({ text: text, tag: tag });
          text = [];
        }
      }
    },
    { decodeEntities: true }
  );

  parser.write(source);
  parser.end();

  headers = addLinenos(lines, headers);
  // consider anything past h4 to small to warrant a link, may be made configurable in the future
  headers = rankify(headers, maxHeaderLevel);
  return headers;
}
