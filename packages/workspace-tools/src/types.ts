export interface BaseWorkspaceToolOptions<TSchema = any> {
  skipReadingConfig?: boolean;
  applyDefaultFn?: (options: Partial<TSchema>) => TSchema;
}
