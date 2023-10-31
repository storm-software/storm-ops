import { ReleaseContext } from "../types";

export let CurrentContext: ReleaseContext;

export const setReleaseContext = (ctx: ReleaseContext) => {
  CurrentContext = ctx;
};
