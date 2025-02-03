import defaultRules from "@commitlint/rules";
import { CommitParser } from "conventional-commits-parser";
import util from "util";
import {
  CommitLintOutcome,
  CommitLintRuleOutcome,
  DefaultCommitRulesEnum,
  RuleConfigSeverity,
} from "../types";
import { CommitLintOptions, DEFAULT_COMMITLINT_CONFIG } from "./config";

interface CommitMessageData {
  header: string | null;
  body?: string | null;
  footer?: string | null;
}

const buildCommitMessage = ({
  header,
  body,
  footer,
}: CommitMessageData): string => {
  let message = header;

  message = body ? `${message}\n\n${body}` : message;
  message = footer ? `${message}\n\n${footer}` : message;

  return message || "";
};

export default async function lint(
  message: string,
  rawRulesConfig?: DefaultCommitRulesEnum,
  rawOpts?: {
    parserOpts?: CommitLintOptions["parserOpts"];
    helpUrl?: CommitLintOptions["helpUrl"];
  },
): Promise<CommitLintOutcome> {
  const rulesConfig = rawRulesConfig || {};

  const parser = new CommitParser(
    rawOpts?.parserOpts ?? DEFAULT_COMMITLINT_CONFIG.parserOpts,
  );
  const parsed = parser.parse(message);

  if (
    parsed.header === null &&
    parsed.body === null &&
    parsed.footer === null
  ) {
    // Commit is empty, skip
    return {
      valid: true,
      errors: [],
      warnings: [],
      input: message,
    };
  }

  const allRules: Map<string, any> = new Map(Object.entries(defaultRules));

  // Find invalid rules configs
  const missing = Object.keys(rulesConfig).filter(
    (name) => typeof allRules.get(name) !== "function",
  );

  if (missing.length > 0) {
    const names = [...allRules.keys()];
    throw new RangeError(
      [
        `Found rules without implementation: ${missing.join(", ")}.`,
        `Supported rules are: ${names.join(", ")}.`,
      ].join("\n"),
    );
  }

  const invalid = Object.entries(rulesConfig)
    .map(([name, config]) => {
      if (!Array.isArray(config)) {
        return new Error(
          `config for rule ${name} must be array, received ${util.inspect(
            config,
          )} of type ${typeof config}`,
        );
      }

      const [level] = config;

      if (level === RuleConfigSeverity.Disabled && config.length === 1) {
        return null;
      }

      const [, when] = config;

      if (typeof level !== "number" || isNaN(level)) {
        return new Error(
          `level for rule ${name} must be number, received ${util.inspect(
            level,
          )} of type ${typeof level}`,
        );
      }

      if (config.length < 2 || config.length > 3) {
        return new Error(
          `config for rule ${name} must be 2 or 3 items long, received ${util.inspect(
            config,
          )} of length ${config.length}`,
        );
      }

      if (level < 0 || level > 2) {
        return new RangeError(
          `level for rule ${name} must be between 0 and 2, received ${util.inspect(
            level,
          )}`,
        );
      }

      if (typeof when !== "string") {
        return new Error(
          `condition for rule ${name} must be string, received ${util.inspect(
            when,
          )} of type ${typeof when}`,
        );
      }

      if (when !== "never" && when !== "always") {
        return new Error(
          `condition for rule ${name} must be "always" or "never", received ${util.inspect(
            when,
          )}`,
        );
      }

      return null;
    })
    .filter((item): item is Error => item instanceof Error);

  if (invalid.length > 0) {
    throw new Error(invalid.map((i) => i.message).join("\n"));
  }

  // Validate against all rules
  const pendingResults = Object.entries(rulesConfig as DefaultCommitRulesEnum)
    // Level 0 rules are ignored
    .filter(([, config]) => !!config && config.length && config[0] > 0)
    .map(async (entry) => {
      const [name, config] = entry;
      const [level, when, value] = config!; //

      const rule = allRules.get(name);

      if (!rule) {
        throw new Error(`Could not find rule implementation for ${name}`);
      }

      const executableRule = rule as any;
      const [valid, message] = await executableRule(parsed, when, value);

      return {
        level,
        valid,
        name,
        message,
      };
    });

  const results = (await Promise.all(pendingResults)).filter(
    (result): result is CommitLintRuleOutcome => result !== null,
  );

  const errors = results.filter(
    (result) => result.level === RuleConfigSeverity.Error && !result.valid,
  );
  const warnings = results.filter(
    (result) => result.level === RuleConfigSeverity.Warning && !result.valid,
  );

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
    input: buildCommitMessage(parsed),
  };
}
