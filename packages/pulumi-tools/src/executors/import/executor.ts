import { withPulumiExecutor } from "../../base/base-executor";
import { ImportExecutorSchema } from "./schema";

export default withPulumiExecutor<ImportExecutorSchema>("import", options => [
  options.target,
  options.name,
  options.id,
  options.parent && `--parent 'parent=${options.parent}'`,
  options.stack && `--stack=${options.stack}`
]);
