const PUBLISH_VISIBILITY_ATTEMPTS = 60;
const PUBLISH_VISIBILITY_INTERVAL_MS = 5000;

export interface NpmPublishedVersionMetadata {
  version?: string;
  "dist-tags"?: Record<string, string>;
  gitHead?: string;
}

interface WaitForPublishedVersionOptions {
  version: string;
  tag: string;
  gitHead: string;
  attempts?: number;
  intervalMs?: number;
  getMetadata: () =>
    NpmPublishedVersionMetadata | Promise<NpmPublishedVersionMetadata>;
  wait?: (milliseconds: number) => Promise<void>;
}

function commandOutputToString(output: unknown): string {
  if (Buffer.isBuffer(output)) {
    return output.toString();
  }

  return typeof output === "string" ? output : "";
}

export function isPreviouslyStagedVersionError(
  error: unknown,
  version: string
): boolean {
  const commandError = error as {
    stdout?: unknown;
    stderr?: unknown;
  };
  const stdout = commandOutputToString(commandError?.stdout);
  const stderr = commandOutputToString(commandError?.stderr);

  let code = "";
  let summary = "";
  try {
    const parsed = JSON.parse(stdout);
    code = parsed?.error?.code || "";
    summary = parsed?.error?.summary || "";
  } catch {
    // npm can emit either JSON on stdout or plain text on stderr.
  }

  const output = `${code}\n${summary}\n${stdout}\n${stderr}`;
  return (
    output.includes("E409") &&
    output.includes(`previously staged version "${version}"`)
  );
}

export async function waitForPublishedVersion({
  version,
  tag,
  gitHead,
  attempts = PUBLISH_VISIBILITY_ATTEMPTS,
  intervalMs = PUBLISH_VISIBILITY_INTERVAL_MS,
  getMetadata,
  wait = milliseconds =>
    new Promise(resolve => setTimeout(resolve, milliseconds))
}: WaitForPublishedVersionOptions): Promise<boolean> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const metadata = await getMetadata();
      if (
        metadata.version === version &&
        metadata["dist-tags"]?.[tag] === version &&
        metadata.gitHead === gitHead
      ) {
        return true;
      }
    } catch {
      // The version can return E404 while npm is still processing it.
    }

    if (attempt < attempts - 1) {
      await wait(intervalMs);
    }
  }

  return false;
}
