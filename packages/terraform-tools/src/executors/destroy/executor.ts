import { withTerraformExecutor } from "../../base/terraform-executor";
import { DestroyExecutorSchema } from "./schema.d";

export default withTerraformExecutor<DestroyExecutorSchema>("destroy");
