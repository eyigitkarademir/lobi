#!/usr/bin/env node
/**
 * homepage-setup — One-command personalized dashboard generator
 *
 * Usage:
 *   npx homepage-setup                    # Scan + generate + apply
 *   npx homepage-setup --scan-only        # Just scan, output profile JSON
 *   npx homepage-setup --output ./config  # Custom output directory
 *   npx homepage-setup --dry-run          # Preview without writing
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { createInterface } from "readline";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

const scanOnly = args.includes("--scan-only");
const dryRun = args.includes("--dry-run");
let outputDir = "./config";
const outputIdx = args.indexOf("--output") !== -1 ? args.indexOf("--output") : args.indexOf("-o");
if (outputIdx !== -1) outputDir = args[outputIdx + 1];

// ─── Banner ──────────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🏠  Homepage Setup Agent                       ║
║                                                  ║
║   Scans your machine. Builds your dashboard.     ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);

// ─── Step 1: Scan ────────────────────────────────────────────────

console.log("Step 1/3: Scanning your environment...\n");

let profile;
try {
  const scannerPath = join(__dirname, "scanner.mjs");
  const output = execSync(`node "${scannerPath}"`, {
    encoding: "utf8",
    timeout: 30000,
    stdio: ["pipe", "pipe", "inherit"],
  });
  profile = JSON.parse(output);
} catch (e) {
  console.error("❌ Scanner failed:", e.message);
  process.exit(1);
}

if (scanOnly) {
  console.log(JSON.stringify(profile, null, 2));
  process.exit(0);
}

// ─── Step 2: Preview ─────────────────────────────────────────────

console.log("\nStep 2/3: Here's what I found:\n");

const { history, bookmarks, containers, devTools } = profile;

console.log(`  🌐 Browsers: ${history.browsers.join(", ") || "none"}`);
console.log(`  📊 Top sites: ${history.topSites.length}`);

if (history.topSites.length > 0) {
  console.log("\n  Your most visited sites:");
  for (const site of history.topSites.slice(0, 10)) {
    const bar = "█".repeat(Math.min(20, Math.round(site.visitCount / history.topSites[0].visitCount * 20)));
    console.log(`    ${bar} ${site.title} (${site.visitCount})`);
  }
}

console.log(`\n  🔖 Bookmarks: ${bookmarks.length}`);
console.log(`  🐳 Docker containers: ${containers.length}`);
if (containers.length > 0) {
  for (const c of containers) {
    console.log(`    • ${c.name} (${c.image})`);
  }
}
console.log(`  🛠  Dev tools: ${devTools.map((t) => t.name).join(", ") || "none"}`);

const catSummary = Object.entries(history.categories)
  .map(([cat, sites]) => `${cat}: ${sites.length}`)
  .join(", ");
console.log(`\n  📁 Categories: ${catSummary}`);

// ─── Step 3: Generate ────────────────────────────────────────────

if (dryRun) {
  console.log("\n  🔍 Dry run — no files written.");
  process.exit(0);
}

console.log(`\nStep 3/3: Generating config to ${outputDir}/...\n`);

try {
  const profilePath = join("/tmp", `homepage_profile_${Date.now()}.json`);
  writeFileSync(profilePath, JSON.stringify(profile));

  const generatorPath = join(__dirname, "generate.mjs");
  const output = execSync(
    `node "${generatorPath}" --profile "${profilePath}" --output "${outputDir}"`,
    { encoding: "utf8", timeout: 15000, stdio: ["pipe", "pipe", "inherit"] },
  );

  const summary = JSON.parse(output);

  console.log(`
╔══════════════════════════════════════════════════╗
║  ✅ Dashboard generated!                         ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Services: ${String(summary.services).padEnd(38)}║
║  Bookmarks: ${String(summary.bookmarks).padEnd(37)}║
║  Categories: ${summary.categories.slice(0, 4).join(", ").padEnd(35)}║
║  Containers: ${String(summary.containers).padEnd(36)}║
║                                                  ║
║  Config written to: ${outputDir.padEnd(29)}║
║                                                  ║
║  Start Homepage:                                 ║
║  docker compose up -d                            ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);
} catch (e) {
  console.error("❌ Generator failed:", e.message);
  process.exit(1);
}
