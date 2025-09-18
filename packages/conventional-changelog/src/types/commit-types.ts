import { DEFAULT_COMMIT_TYPES } from "../commit-types";

export type CommitEnumItemProps = {
  description: string;
  title?: string;
  emoji?: string;
  hidden?: boolean;
};

export type CommitTypeProps = CommitEnumItemProps & {
  semverBump: "none" | "patch" | "minor" | "major";
  changelog: {
    title: string;
    hidden: boolean;
  };
};

export type DefaultCommitTypeKeys = keyof typeof DEFAULT_COMMIT_TYPES;

export type CommitTypesEnum<
  TCommitTypes extends DefaultCommitTypeKeys = DefaultCommitTypeKeys
> = Record<TCommitTypes, CommitTypeProps>;
