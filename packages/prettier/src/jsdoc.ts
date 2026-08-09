import jsdoc from "./jsdoc.json" with { type: "json" };
import { createConfig } from "./create-config";

export default createConfig(jsdoc);
