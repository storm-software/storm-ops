/**
 * The specific options available to the default implementation of the ChangelogRenderer that nx exports
 * for the common case.
 */
export interface StormChangelogRenderOptions extends Record<string, unknown> {
  /**
   * Whether or not the commit authors should be added to the bottom of the changelog in a "Thank You"
   * section. Defaults to true.
   */
  authors?: boolean;
  /**
   * Whether or not the commit references (such as commit and/or PR links) should be included in the changelog.
   * Defaults to true.
   */
  commitReferences?: boolean;
  /**
   * Whether or not to include the date in the version title. It can be set to false to disable it, or true to enable
   * with the default of (YYYY-MM-DD). Defaults to true.
   */
  versionTitleDate?: boolean;
}

declare function changelogRenderer(params: StormChangelogRenderOptions): Promise<string>;
export { changelogRenderer };
