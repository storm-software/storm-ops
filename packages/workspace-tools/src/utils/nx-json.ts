import { NxJsonConfiguration } from "@nx/devkit";
import recommendedJson from "../../config/recommended.json" with { type: "json" };

/**
 * The values provided in `recommended.json` (this package's shared nx.json configuration) file's {@link NxJsonConfiguration.namedInputs} section.
 */
export const NAMED_INPUTS = {
  allProjectFiles: recommendedJson.namedInputs.allProjectFiles,
  default: recommendedJson.namedInputs.default,
  sharedGlobals: recommendedJson.namedInputs.sharedGlobals,
  production: recommendedJson.namedInputs.production,
  testing: recommendedJson.namedInputs.testing,
  linting: recommendedJson.namedInputs.linting,
  documentation: recommendedJson.namedInputs.documentation,
  rust: recommendedJson.namedInputs.rust,
  typescript: recommendedJson.namedInputs.typescript
} as const;

/**
 * The values provided in `recommended.json` (this package's shared nx.json configuration) file's {@link NxJsonConfiguration.release} section.
 */
export const RELEASE: NxJsonConfiguration["release"] =
  recommendedJson.release as NxJsonConfiguration["release"];

/**
 * Looks up the actual input string using the provided {@link namedInputs}, merges with the {@link currentInputs}, ensures no duplicates and sorts the result alphabetically.
 *
 * @param namedInputs - The named inputs to merge.
 * @param currentInputs - The current inputs to merge with.
 * @returns An array of unique input names.
 */
export function withNamedInputs(
  currentInputs: string[] = [],
  namedInputs: (keyof typeof NAMED_INPUTS)[] = []
): string[] {
  return currentInputs
    .concat(namedInputs.flatMap(n => NAMED_INPUTS[n] as unknown as string[]))
    .reduce((ret, inputName) => {
      if (
        Object.keys(NAMED_INPUTS).includes(inputName) &&
        Array.isArray(NAMED_INPUTS[inputName]) &&
        NAMED_INPUTS[inputName].length > 0
      ) {
        NAMED_INPUTS[inputName].forEach(input => {
          if (!ret.includes(input)) {
            ret.push(input);
          }
        });

        return ret;
      }

      if (!ret.includes(inputName)) {
        ret.push(inputName);
      }

      return ret;
    }, [] as string[])
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
}
