#!/usr/bin/env zx

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gt, valid } from "semver";
import { $, argv, chalk, echo } from "zx";

const PACKAGES_DIR = "packages";
const SCOPE_PREFIX = "@storm-software/";

function getTagPrefix(packageName) {
  return packageName.startsWith(SCOPE_PREFIX)
    ? packageName.slice(SCOPE_PREFIX.length)
    : packageName;
}

function buildTagsByPrefix(tags) {
  const tagsByPrefix = new Map();

  for (const tag of tags) {
    const at = tag.lastIndexOf("@");
    if (at === -1) {
      continue;
    }

    const prefix = tag.slice(0, at);
    const version = tag.slice(at + 1);
    if (!tagsByPrefix.has(prefix)) {
      tagsByPrefix.set(prefix, []);
    }
    tagsByPrefix.get(prefix).push({ tag, version });
  }

  return tagsByPrefix;
}

function findStaleTags(packagesDir, tagsByPrefix) {
  const staleTags = [];
  const seenTags = new Set();

  for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageJsonPath = join(packagesDir, entry.name, "package.json");
    const { name, version } = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    const prefixes = new Set([getTagPrefix(name), entry.name]);

    for (const prefix of prefixes) {
      const packageTags = tagsByPrefix.get(prefix) ?? [];

      for (const { tag, version: tagVersion } of packageTags) {
        if (seenTags.has(tag)) {
          continue;
        }

        if (
          valid(tagVersion) &&
          valid(version) &&
          gt(tagVersion, version, { loose: true })
        ) {
          seenTags.add(tag);
          staleTags.push({
            packageName: name,
            packageVersion: version,
            tag,
            tagVersion
          });
        }
      }
    }
  }

  return staleTags.sort((a, b) => a.tag.localeCompare(b.tag));
}

try {
  const dryRun = argv["dry-run"] ?? argv.dryRun ?? !argv.delete;
  const deleteRemote = argv.remote ?? false;

  echo`${chalk.whiteBright("Finding stale package tags...")}`;

  const allTags = (await $`git tag -l`).stdout.trim().split("\n").filter(Boolean);
  const tagsByPrefix = buildTagsByPrefix(allTags);
  const staleTags = findStaleTags(PACKAGES_DIR, tagsByPrefix);

  if (staleTags.length === 0) {
    echo`${chalk.green("No stale tags found.")}`;
    process.exit(0);
  }

  echo`${chalk.yellow(`Found ${staleTags.length} stale tag(s):`)}`;
  for (const { packageName, packageVersion, tag, tagVersion } of staleTags) {
    echo`  ${tag} (${packageName} is ${packageVersion}, tag is ${tagVersion})`;
  }

  if (dryRun) {
    echo`${chalk.cyan("Dry run only. Re-run with --delete to remove local tags.")}`;
    if (deleteRemote) {
      echo`${chalk.cyan("Add --delete together with --remote to delete remote tags too.")}`;
    }
    process.exit(0);
  }

  echo`${chalk.whiteBright("Deleting stale local tags...")}`;
  for (const { tag } of staleTags) {
    await $`git tag -d ${tag}`;
    echo`${chalk.green(`Deleted local tag ${tag}`)}`;
  }

  if (deleteRemote) {
    echo`${chalk.whiteBright("Deleting stale remote tags...")}`;
    for (const { tag } of staleTags) {
      await $`git push --delete origin ${tag}`;
      echo`${chalk.green(`Deleted remote tag ${tag}`)}`;
    }
  }

  echo`${chalk.green(`Successfully deleted ${staleTags.length} stale tag(s).`)}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "Failed to delete stale tags")}`;
  process.exit(1);
}
