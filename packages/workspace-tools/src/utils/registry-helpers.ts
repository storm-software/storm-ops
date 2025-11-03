import https from "node:https";

/**
 * Get the version of a crate from the registry.
 *
 * @param name - The name of the crate
 * @param tag - The tag of the crate
 * @param registry - The registry URL
 * @returns The version of the crate from the registry
 */
export const getCrateRegistryVersion = (
  name: string,
  tag = "latest",
  registry = "https://crates.io"
): Promise<string> => {
  return new Promise((resolve: (value: string) => void) =>
    https
      .get(
        `${registry}/api/v1/crates/${encodeURIComponent(name)}/${encodeURIComponent(
          tag
        )}`,
        res => {
          res.on("data", d => {
            resolve(d);
          });
        }
      )
      .on("error", e => {
        throw e;
      })
  );
};
