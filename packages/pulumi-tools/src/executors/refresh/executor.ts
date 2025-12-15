import { withPulumiExecutor } from "../../base/base-executor";
import { RefreshExecutorSchema } from "./schema";

export default withPulumiExecutor<RefreshExecutorSchema>("refresh", options => [
  "--suppress-progress",
  options.stack && `--stack=${options.stack}`,
  options.skipPreview && "--skip-preview",
  options.yes && "--yes"
]);
