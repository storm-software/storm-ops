import { CommitsConfig, ParserConfig, WhatBumpFunction } from "./config";
import { WriteConfig } from "./write";

export interface StormSoftwarePreset {
  commits: CommitsConfig;
  parser: ParserConfig;
  writer: WriteConfig;
  whatBump: WhatBumpFunction;
}
