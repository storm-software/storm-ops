import { Variant } from "@storm-software/config/types";
import { ParserConfig } from "./types/config";
import {
  MINIMAL_PARSER_DEFAULT_OPTIONS,
  MONOREPO_PARSER_DEFAULT_OPTIONS
} from "./utilities/constants";

/**
 * Create parser options based on the provided config.
 *
 * @param config The configuration object.
 * @returns The parser options.
 */
export function createParserOpts(variant: Variant): ParserConfig {
  return variant === "minimal"
    ? MINIMAL_PARSER_DEFAULT_OPTIONS
    : MONOREPO_PARSER_DEFAULT_OPTIONS;
}
