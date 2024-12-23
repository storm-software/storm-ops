import { withPulumiExecutor } from "../../base/base-executor";
import { ConfigExecutorSchema } from "./schema";

export default withPulumiExecutor<ConfigExecutorSchema>("config", options => [
  options.action,
  options.showSecrets && `--show-secrets`,
  options.secret && `--secret`,
  options.path && `--path`,
  options.name && options.value && `"${options.name}" "${options.value}"`,
  options.stack && `--stack=${options.stack}`
]);
