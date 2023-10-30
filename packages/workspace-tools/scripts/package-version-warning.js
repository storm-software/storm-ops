if (process.argv.slice(2).some(arg => arg.includes("pnpm-lock.json"))) {
  console.warn(
    [
      "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
      "⚠️ pnpm-lock.yaml changed, please run `pnpm i` to ensure your packages are up to date.       ⚠️",
      "⚠️ ----------------------------------------------------------------------------------------- ⚠️"
    ].join("\n")
  );
}
