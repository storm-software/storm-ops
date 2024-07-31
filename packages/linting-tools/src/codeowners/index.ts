import { loadStormConfig, writeWarning } from "@storm-software/config-tools";
import { sync } from "fast-glob";
import fs from "fs-extra";
import { Octokit } from "octokit";
import { join } from "path";

export async function runCodeowners() {
  const config = await loadStormConfig();
  if (!config) {
    throw new Error("Failed to load storm config.");
  }

  const codeowners = fs.readFileSync(
    fs.existsSync(join(config.workspaceRoot, ".github", "CODEOWNERS"))
      ? join(config.workspaceRoot, ".github", "CODEOWNERS")
      : join(config.workspaceRoot, "CODEOWNERS"),
    "utf8"
  );
  const codeownersLines = codeowners
    .split("\n")
    .filter(line => line.trim().length > 0 && !line.startsWith("#"));

  const mismatchedPatterns: string[] = [];
  const mismatchedOwners: string[] = [];

  const gh = new Octokit({
    auth: process.env.GITHUB_TOKEN
  }).rest;
  const cache: Map<string, boolean> = new Map();

  for (const line of codeownersLines) {
    // This is perhaps a bit naive, but it should
    // work for all paths and patterns that do not
    // contain spaces.
    const [specifiedPattern, ...owners] = line.split(" ");
    let foundMatchingFiles = false;

    const patternsToCheck = specifiedPattern.startsWith("/")
      ? [`.${specifiedPattern}`]
      : [`./${specifiedPattern}`, `**/${specifiedPattern}`];

    for (const pattern of patternsToCheck) {
      foundMatchingFiles ||=
        sync(pattern, {
          ignore: ["node_modules", "dist", "tmp", ".git"],
          cwd: join(config.workspaceRoot),
          onlyFiles: false
        }).length > 0;
    }
    if (!foundMatchingFiles) {
      mismatchedPatterns.push(specifiedPattern);
    }

    if (process.env.GITHUB_TOKEN) {
      for (let owner of owners) {
        owner = owner.substring(1); // Remove the @
        if (owner.includes("/")) {
          // Its a team.
          const [org, team] = owner.split("/");
          let res = cache.get(owner);
          if (res === undefined) {
            res = await validateTeam(gh, org, team);
            cache.set(owner, res);
          }
          if (res === false) {
            mismatchedOwners.push(`${specifiedPattern}: ${owner}`);
          }
        } else {
          let res = cache.get(owner);
          if (res === undefined) {
            res = await validateUser(gh, owner);
            cache.set(owner, res);
          }
          if (res === false) {
            mismatchedOwners.push(`${specifiedPattern}: ${owner}`);
          }
        }
      }
    } else {
      writeWarning(
        `Skipping owner validation because GITHUB_TOKEN is not set.`
      );
    }
  }

  if (mismatchedPatterns.length > 0) {
    throw new Error(
      `The following patterns in CODEOWNERS do not match any files: \n${mismatchedPatterns.map(e => `- ${e} `).join("\n")}`
    );
  }

  if (mismatchedOwners.length > 0) {
    throw new Error(
      `The following owners in CODEOWNERS do not exist: \n${mismatchedOwners.map(e => `- ${e} `).join("\n")}`
    );
  }
}

async function validateTeam(
  gh: Octokit["rest"],
  org: string,
  team: string
): Promise<boolean> {
  try {
    await gh.teams.getByName({
      org,
      team_slug: team
    });
    return true;
  } catch {
    return false;
  }
}

async function validateUser(
  gh: Octokit["rest"],
  username: string
): Promise<boolean> {
  try {
    await gh.users.getByUsername({
      username
    });
    return true;
  } catch {
    return false;
  }
}
