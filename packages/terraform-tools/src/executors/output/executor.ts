import { withTerraformExecutor } from "../../base/base-executor";
import { OutputExecutorSchema } from "./schema";

export default withTerraformExecutor<OutputExecutorSchema>("output");
