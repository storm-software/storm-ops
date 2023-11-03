import { RELEASE_TYPES } from "../constants";

export const compareReleaseTypes = (currentReleaseType, releaseType) =>
  !currentReleaseType ||
  RELEASE_TYPES.indexOf(releaseType) <
    RELEASE_TYPES.indexOf(currentReleaseType);
