import { ProjectGraphProjectNode, Tree } from "@nx/devkit";
import JsVersionActions from "@nx/js/src/release/version-actions.js";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import { ReleaseGroupWithName } from "nx/src/command-line/release/config/filter-release-groups";
import { FinalConfigForProject } from "nx/src/command-line/release/utils/release-graph";
import { NxReleaseVersionConfiguration } from "nx/src/config/nx-json";

/**
 * Custom JavaScript/TypeScript version actions for packages inside a Storm workspace.
 */
export default class StormJsVersionActions extends JsVersionActions {
  /**
   * The Storm workspace configuration object, which is loaded from the `storm-workspace.json` file.
   *
   * @remarks
   * This member variable is populated during the {@link init} method.
   */
  protected workspaceConfig: StormWorkspaceConfig | null = null;

  public constructor(
    releaseGroup: ReleaseGroupWithName,
    projectGraphNode: ProjectGraphProjectNode,
    finalConfigForProject: FinalConfigForProject
  ) {
    super(releaseGroup, projectGraphNode, finalConfigForProject);
  }

  /**
   * Asynchronous initialization of the version actions and resolution of manifest paths.
   *
   * @remarks
   * This does NOT validate that manifest files exist - that happens later in validate().
   *
   * @params tree - The file system tree to read from.
   */
  public override async init(tree: Tree): Promise<void> {
    this.workspaceConfig = await getWorkspaceConfig();

    return super.init(tree);
  }

  /**
   * Reads the current version of a package from the registry.
   *
   * @param tree - The file system tree to read from.
   * @param currentVersionResolverMetadata - Metadata for resolving the current version.
   * @returns The current version and log text.
   */
  public override readCurrentVersionFromRegistry(
    tree: Tree,
    currentVersionResolverMetadata: NxReleaseVersionConfiguration["currentVersionResolverMetadata"]
  ): Promise<{
    currentVersion: string;
    logText: string;
  }> {
    currentVersionResolverMetadata ??= {};
    currentVersionResolverMetadata.registry ??=
      this.workspaceConfig?.registry?.npm;

    return super.readCurrentVersionFromRegistry(
      tree,
      currentVersionResolverMetadata
    );
  }
}
