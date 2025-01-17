import type { ExecutorContext } from "@nx/devkit";
import { joinPathFragments } from "@nx/devkit";
import esBuildPlugin from "@size-limit/esbuild";
import esBuildWhyPlugin from "@size-limit/esbuild-why";
import filePlugin from "@size-limit/file";
import type { StormConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools";
import sizeLimit from "size-limit";
import { withRunExecutor } from "../../base/base-executor";
import type { SizeLimitExecutorSchema } from "./schema.d";

// export default [
//   {
//     async finally(config, check) {
//       let { esbuildVisualizerFile } = check;

//       if (esbuildVisualizerFile) {
//         await open(esbuildVisualizerFile);
//       }
//     },

//     name: "@size-limit/esbuild-why",
//     async step81(config, check) {
//       if (config.why && check.esbuildMetafile) {
//         let result = await visualizer(check.esbuildMetafile);
//         let file = join(config.saveBundle ?? "", getReportName(config, check));
//         check.esbuildVisualizerFile = file;
//         writeFileSync(file, result);
//       }
//     }
//   }
// ];

export async function sizeLimitExecutorFn(
  options: SizeLimitExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  if (
    !context?.projectName ||
    !context.projectsConfigurations?.projects ||
    !context.projectsConfigurations.projects[context.projectName]
  ) {
    throw new Error(
      "The Size-Limit process failed because the context is not valid. Please run this command from a workspace."
    );
  }

  writeInfo(`📏 Running Size-Limit on ${context.projectName}`, config);

  sizeLimit([filePlugin, esBuildPlugin, esBuildWhyPlugin], {
    checks:
      options.entry ??
      context.projectsConfigurations.projects[context.projectName]
        ?.sourceRoot ??
      joinPathFragments(
        context.projectsConfigurations.projects[context.projectName]?.root ??
          "./",
        "src"
      )
  }).then(result => {
    writeInfo(
      `📏 ${context.projectName} Size-Limit result: ${JSON.stringify(result)}`,
      config
    );
  });

  return {
    success: true
  };
}

export default withRunExecutor<SizeLimitExecutorSchema>(
  "Size-Limit Performance Test Executor",
  sizeLimitExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (
        options: SizeLimitExecutorSchema
      ): SizeLimitExecutorSchema => {
        // options.entry ??= "{sourceRoot}/index.ts";

        return options;
      }
    }
  }
);
