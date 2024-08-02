import { withTerraformExecutor } from "../../base/base-executor";
import { DestroyExecutorSchema } from "./schema";

export default withTerraformExecutor<DestroyExecutorSchema>("destroy");
