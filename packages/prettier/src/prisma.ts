import { createConfig } from "./create-config";
import prisma from "./prisma.json" with { type: "json" };

export default createConfig(prisma);
