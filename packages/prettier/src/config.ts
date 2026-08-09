import config from "./config.json" with { type: "json" };
import { createConfig } from "./create-config";

export default createConfig(config);
