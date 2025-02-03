import { withPulumiExecutor } from "../../base/base-executor";
import { PreviewExecutorSchema } from "./schema.d";

export default withPulumiExecutor<PreviewExecutorSchema>(
  "preview",
  (options) => [
    options.stack && `--stack=${options.stack}`,
    options.expectNoChanges && "--expect-no-changes",
  ],
);
