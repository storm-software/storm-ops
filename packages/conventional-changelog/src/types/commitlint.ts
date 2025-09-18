export type RuleConfigCondition = "always" | "never";
export enum RuleConfigSeverity {
  Disabled = 0,
  Warning = 1,
  Error = 2
}

export type CommitRulesEnum = Record<
  string,
  | [RuleConfigSeverity, RuleConfigCondition]
  | [RuleConfigSeverity, RuleConfigCondition, number]
  | [RuleConfigSeverity, RuleConfigCondition, string]
  | [RuleConfigSeverity, RuleConfigCondition, string[]]
  | [RuleConfigSeverity, RuleConfigCondition, any]
  | any
>;

export type CommitlintRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "body-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "footer-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "footer-max-line-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-trim": [RuleConfigSeverity, RuleConfigCondition];
  "subject-case": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "subject-empty": [RuleConfigSeverity, RuleConfigCondition];
  "subject-full-stop": [RuleConfigSeverity, RuleConfigCondition, string];
  "subject-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "subject-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-case": [RuleConfigSeverity, RuleConfigCondition, string];
  "type-empty": [RuleConfigSeverity, RuleConfigCondition];
  "type-enum": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "scope-empty": [RuleConfigSeverity, RuleConfigCondition];
  "scope-case"?: [RuleConfigSeverity, RuleConfigCondition, string[]];
  "scope-enum"?: [RuleConfigSeverity, RuleConfigCondition, string[]];
  "type-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
} & CommitRulesEnum;
