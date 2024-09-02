export type ContainerPublishExecutorSchema =
  Partial<ExternalContainerExecutorSchema> & {
    registry?: string;
    packageRoot?: string;
    dryRun?: boolean;
  };

export interface ExternalContainerExecutorSchema {
  engine?: "docker" | "podman" | "kaniko";
  quiet?: boolean;
  /**
   * List of customs host-to-IP mapping (e.g., docker:10.180.0.1)
   */
  "add-hosts"?: string[];
  /**
   * List of extra privileged entitlement (eg. network.host,security.insecure)
   */
  allow?: string[];
  /**
   * List of build-time variables
   */
  "build-args"?: string[];
  /**
   * List of additional build contexts (e.g., name=path)
   */
  "build-contexts"?: string[];
  /**
   * Builder instance (see setup-buildx action)
   */
  builder?: string;
  /**
   * List of external cache sources for buildx (eg. user/app:cache, type=local,src=path/to/dir)
   */
  "cache-from"?: string | string[];
  /**
   * List of cache export destinations for buildx (eg. user/app:cache, type=local,dest=path/to/dir)
   */
  "cache-to"?: string | string[];
  /**
   * Optional parent cgroup for the container used in the build
   */
  "cgroup-parent"?: string;
  /**
   * Build's context is the set of files located in the specified PATH or URL (default .)
   */
  context?: string;
  /**
   * Path to the Dockerfile (default Dockerfile)
   */
  file?: string;
  /**
   * List of metadata for an image
   */
  labels?: string[];
  /**
   * Load is a shorthand for --output=type=docker (default false)
   */
  load?: boolean;
  /**
   * Set the networking mode for the RUN instructions during build
   */
  network?: string;
  /**
   * Do not use cache when building the image (default false)
   */
  "no-cache"?: boolean;
  /**
   * List of output destinations (format: type=local,dest=path)
   */
  outputs?: string[];
  /**
   * List of target platforms for build
   */
  platforms?: string[];
  /**
   * Change or disable provenance attestations for the build result
   */
  provenance?: string;
  /**
   * Always attempt to pull a newer version of the image (default false)
   */
  pull?: boolean;
  /**
   * Push is a shorthand for --output=type=registry (default false)
   */
  push?: boolean;
  /**
   * List of secrets to expose to the build (eg. key=string, GIT_AUTH_TOKEN=mytoken)
   */
  secrets?: string[];
  /**
   * List of secret files to expose to the build (eg. key=filename, MY_SECRET=./secret.txt)
   */
  "secret-files"?: string[];
  /**
   * Size of /dev/shm (e.g., 2g)
   */
  "shm-size"?: string;
  /**
   * List of SSH agent socket or keys to expose to the build
   */
  ssh?: string[];
  /**
   * List of tags
   */
  tags?: string[];
  /**
   * Sets the target stage to build
   */
  target?: string;
  /**
   * Ulimit options (e.g., nofile=1024:1024)
   */
  ulimit?: string[];
  /**
   * Extract metadata from CI context
   */
  metadata?: {
    /**
     * List of Docker images to use as base name for tags. Required.
     */
    images?: string[];
    /**
     * List of tags as key-value pair attributes
     */
    tags?: string[];
    /**
     * Flavors to apply
     */
    flavor?: string[];
    /**
     * List of custom labels
     */
    labels?: string[];
    /**
     * Separator to use for tags output (default '\n')
     */
    "sep-tags"?: string;
    /**
     * Separator to use for labels output (default '\n')
     */
    "sep-labels"?: string;
    /**
     * Bake target name (default container-metadata-action)
     */
    "bake-target"?: string;
  };
}
