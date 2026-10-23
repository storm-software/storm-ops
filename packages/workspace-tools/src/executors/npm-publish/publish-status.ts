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
