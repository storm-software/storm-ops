import { Variant } from "@storm-software/config/types";
import createBasePreset from "conventional-changelog-conventionalcommits";
import { ParserConfig } from "./types/config";

/**
 * Create parser options based on the provided config.
 *
 * @param config The configuration object.
 * @returns The parser options.
 */
export function createParserOpts(variant: Variant): ParserConfig {
  return createBasePreset(variant === "minimal").parser;
}
