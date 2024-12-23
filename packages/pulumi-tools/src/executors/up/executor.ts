import { withPulumiExecutor } from "../../base/base-executor";
import { UpExecutorSchema } from "./schema";

export default withPulumiExecutor<UpExecutorSchema>("up", options => [
  "--suppress-progress",
  options.stack && `--stack=${options.stack}`,
  options.skipPreview && "--skip-preview",
  options.yes && "--yes",
  options.suppressOutputs && "--suppress-outputs",
  options.debug && "--debug",
  options.json && "--json"
]);
