import { ParserConfig, ResolvedPresetOptions } from "./types/config";

/**
 * Create parser options based on the provided config.
 *
 * @param config The configuration object.
 * @returns The parser options.
 */
export function createParserOpts(options: ResolvedPresetOptions): ParserConfig {
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
    headerCorrespondence: ["type", "scope", "subject"],
    noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
    revertPattern:
      /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ["header", "hash"],
    issuePrefixes: options.issuePrefixes
  };
}
