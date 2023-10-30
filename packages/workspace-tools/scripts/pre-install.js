if (process.env.CI == "true") {
  console.log("Skipping preinstall...");
  process.exit(1);
}
