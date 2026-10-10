import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const sha =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  (() => {
    try {
      return execSync("git rev-parse --short HEAD").toString().trim();
    } catch {
      return "local";
    }
  })();

writeFileSync(
  new URL("../public/app-version.json", import.meta.url),
  JSON.stringify({ sha, builtAt: new Date().toISOString() }),
);
console.log(`app-version: ${sha}`);
