export interface CloudflarePublishExecutorSchema {
  name: string;
  noBundle: boolean;
  env: string;
  outdir: string;
  compatibilityDate: string;
  compatibilityFlags: string[];
  latest: boolean;
  assets: string;
  site: string;
  siteInclude: string[];
  siteExclude: string[];
  var: string[];
  define: string[];
  triggers: string[];
  routes: string[];
  tsConfig: string;
  minify: boolean;
  nodeCompat: boolean;
  dryRun: boolean;
  keepVars: boolean;
}
