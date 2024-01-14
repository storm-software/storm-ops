if (process.env.CI) {
  console.log("Skipping preinstall...");
  process.exit(1);
}
