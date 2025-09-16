export interface Reference {
  prefix: string;
  issue: string;
}

export interface Context {
  host: string;
  owner: string;
  repository: string;
}

export interface CommitKnownProps {
  type: string;
  scope?: string;
  subject: string;
  header?: string;
  body?: string;
  footer?: string;
  version?: string;
  hash?: string;
  shortHash?: string;
  revert?: boolean;
  notes?: CommitNote[];
  committerDate?: string;
  references?: Reference[];
}

export interface CommitNote {
  title: string;
  text: string;
  [key: string]: any;
}

export interface TransformedCommit<
  TCommit extends CommitKnownProps = CommitKnownProps
> {
  raw: TCommit;
  header?: string;
  version?: string;
  hash?: string;
  shortHash?: string;
  revert?: boolean;
  type: string;
  scope: string | null;
  footer?: string;
  body?: string;
  notes: CommitNote[];
  committerDate?: string;
  subject: string;
  references: Reference[];
}

export interface CommitGroup<
  TCommit extends CommitKnownProps = CommitKnownProps
> {
  title: string;
  commits: TCommit[];
}

export interface CommitNoteGroup {
  title: string;
  notes: CommitNote[];
}

export interface TemplatesOptions {
  mainTemplate?: string;
  headerPartial?: string;
  commitPartial?: string;
  footerPartial?: string;
  partials?: Record<string, string | null>;
}

type RequiredTemplatesOptions = Required<TemplatesOptions>;

export interface FinalTemplatesOptions extends TemplatesOptions {
  mainTemplate: RequiredTemplatesOptions["mainTemplate"];
  headerPartial: RequiredTemplatesOptions["headerPartial"];
  commitPartial: RequiredTemplatesOptions["commitPartial"];
  footerPartial: RequiredTemplatesOptions["footerPartial"];
}

type extractFunc<T> = (e: T) => number | string;

export type WriteConfig<TCommit extends CommitKnownProps = CommitKnownProps> =
  FinalTemplatesOptions & {
    transform: (
      commit: TCommit,
      context: Context
    ) => TransformedCommit | undefined;
    groupBy: string;
    commitGroupsSort: (a: CommitGroup, b: CommitGroup) => number;
    commitsSort: string[];
    noteGroupsSort: string;
    notesSort: <T>(
      prop?: ReadonlyArray<string | extractFunc<T>> | string | extractFunc<T>
    ) => (e1: T, e2: T) => number;
  };
