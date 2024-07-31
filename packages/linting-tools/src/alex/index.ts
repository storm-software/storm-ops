/* eslint-disable @typescript-eslint/no-explicit-any */
import { filter } from "alex/filter";
import retextEnglish from "retext-english";
import retextEquality from "retext-equality";
import retextProfanities from "retext-profanities";
import { type PluggableList, unified } from "unified";
import { engine } from "unified-engine";
import vfileReporter from "vfile-reporter";

Error.stackTraceLimit = Infinity;

export const runAlex = (
  rcName = "@storm-software/linting-tools/alex/.alexrc",
  ignoreName = "@storm-software/linting-tools/alex/.alexignore"
) => {
  return new Promise(
    (resolve: (value: unknown) => void, reject: (reason?: any) => void) =>
      engine(
        {
          processor: unified(),
          files: ["**/*.{txt,js,jsx,ts,tsx,md,mdx,json}"],
          extensions: [
            "txt",
            "text",
            "md",
            "mdx",
            "markdown",
            "mkd",
            "mkdn",
            "mkdown",
            "ron"
          ],
          configTransform: transform,
          out: false,
          output: false,
          rcName,
          rcPath: undefined,
          packageField: "alex",
          color: true,
          reporter: vfileReporter,
          reporterOptions: {
            verbose: false
          },
          quiet: true,
          ignoreName,
          ignorePatterns: [
            "**/CODE_OF_CONDUCT.md",
            "**/dist/**",
            "**/node_modules/**"
          ],
          silent: false,
          silentlyIgnore: true,
          frail: true,
          defaultConfig: transform({})
        },
        (error, code) => {
          if (error) {
            console.error(error.message);
            return reject(code);
          }
          return resolve(code);
        }
      )
  );
};

const transform = (options: any) => {
  return {
    plugins: [
      retextEnglish,
      [retextProfanities, { sureness: options.profanitySureness }],
      [retextEquality, { noBinary: options.noBinary }],
      [
        filter,
        {
          allow: options.allow,
          deny: options.deny
        }
      ]
    ] as PluggableList
  };
};
