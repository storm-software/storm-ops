import { CargoBaseExecutorSchema } from "../../../declarations";

export type CargoDocExecutorSchema = CargoBaseExecutorSchema & {
  noDeps?: boolean;
};
