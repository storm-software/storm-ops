import excludePackagejson from "./exclude-packagejson.json" with { type: "json" };
import { createConfig } from "./create-config";

export default createConfig(excludePackagejson);
