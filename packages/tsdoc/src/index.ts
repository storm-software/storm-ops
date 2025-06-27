import apiExtractor from "./api-extractor.json";
import base from "./base.json";
import callouts from "./callouts.json";
import core from "./core.json";
import recommended from "./recommended.json";
import typedoc from "./typedoc.json";

export const configs = {
  base,
  typedoc,
  apiExtractor,
  core,
  callouts,
  recommended
} as const;

export default configs;
