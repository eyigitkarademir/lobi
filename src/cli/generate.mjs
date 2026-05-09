#!/usr/bin/env node
/**
 * Homepage Config Generator
 *
 * Takes a machine profile (from scanner.mjs) and generates
 * personalized Homepage YAML config files.
 *
 * Usage:
 *   node scanner.mjs | node generate.mjs [--output ./config]
 *   node generate.mjs --profile profile.json [--output ./config]
 */

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

// ─── Parse Args ──────────────────────────────────────────────────

const args = process.argv.slice(2);
let outputDir = "./config";
let profilePath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--output" || args[i] === "-o") outputDir = args[++i];
  if (args[i] === "--profile" || args[i] === "-p") profilePath = args[++i];
}

// ─── Load Profile ────────────────────────────────────────────────

let profile;

if (profilePath) {
  profile = JSON.parse(readFileSync(profilePath, "utf8"));
} else {
  // Read from stdin
  let input = "";
  const chunks = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  input = chunks.join("");
  profile = JSON.parse(input);
}

console.error("📋 Generating config from profile...");
console.error(`   User: ${profile.meta.username}@${profile.meta.hostname}`);
console.error(`   Platform: ${profile.meta.platform}`);

// ─── Generate Services ──────────────────────────────────────────

function generateServices(profile) {
  const services = [];

  // Docker containers → Infrastructure group
  if (profile.containers.length > 0) {
    const infraServices = profile.containers.map((c) => ({
      [c.name]: {
        icon: "si-docker",
        href: extractContainerUrl(c),
        description: `${c.image} — ${c.status}`,
        server: "my-docker",
        container: c.name,
      },
    }));
    services.push({ Infrastructure: infraServices });
  }

  // Top sites by category → Service groups
  const { categories } = profile.history;
  const priorityOrder = ["Development", "AI", "Productivity", "Communication", "Social", "Entertainment"];

  for (const cat of priorityOrder) {
    const sites = categories[cat];
    if (!sites || sites.length === 0) continue;

    const catServices = sites.slice(0, 4).map((s) => ({
      [s.title]: {
        icon: s.icon,
        href: s.url,
        description: `${s.visitCount} visits`,
      },
    }));

    services.push({ [cat]: catServices });
  }

  // Other/uncategorized sites with high visit counts
  const otherSites = categories["Other"];
  if (otherSites && otherSites.length > 0) {
    const otherServices = otherSites
      .filter((s) => s.visitCount >= 10)
      .slice(0, 4)
      .map((s) => ({
        [s.title]: {
          icon: s.icon,
          href: s.url,
          description: `${s.visitCount} visits`,
        },
      }));
    if (otherServices.length > 0) {
      services.push({ Other: otherServices });
    }
  }

  return services;
}

function extractContainerUrl(container) {
  // Parse port mapping like "0.0.0.0:3001->3000/tcp"
  const match = container.ports?.match(/0\.0\.0\.0:(\d+)/);
  if (match) return `http://localhost:${match[1]}`;
  return "#";
}

// ─── Generate Bookmarks ─────────────────────────────────────────

function generateBookmarks(profile) {
  const bookmarks = [];

  // Top sites as "Frequently Visited" bookmark group
  const topSites = profile.history.topSites.slice(0, 8);
  if (topSites.length > 0) {
    const topGroup = {
      "Frequently Visited": topSites.map((s) => ({
        [s.title]: [{ abbr: s.title.slice(0, 2).toUpperCase(), href: s.url }],
      })),
    };
    bookmarks.push(topGroup);
  }

  // Browser bookmarks grouped by folder
  if (profile.bookmarks.length > 0) {
    const folderMap = new Map();
    const seen = new Set();

    for (const bm of profile.bookmarks) {
      if (seen.has(bm.domain)) continue;
      seen.add(bm.domain);

      const folder = bm.folder || "Bookmarks";
      if (!folderMap.has(folder)) folderMap.set(folder, []);
      folderMap.get(folder).push(bm);
    }

    // Take top 3 folders with most bookmarks
    const sortedFolders = [...folderMap.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);

    for (const [folder, bms] of sortedFolders) {
      bookmarks.push({
        [folder]: bms.slice(0, 6).map((bm) => ({
          [bm.name.slice(0, 30)]: [{ abbr: bm.name.slice(0, 2).toUpperCase(), href: bm.url }],
        })),
      });
    }
  }

  return bookmarks;
}

// ─── Generate Settings ──────────────────────────────────────────

function generateSettings(profile) {
  const { categories } = profile.history;
  const isDev =
    (categories["Development"]?.length || 0) > 3 || profile.devTools.length > 3;
  const isCreative =
    (categories["Entertainment"]?.length || 0) > 3;

  // Pick theme based on usage pattern
  const color = isDev ? "slate" : isCreative ? "purple" : "blue";

  const settings = {
    title: `${profile.meta.username}'s Dashboard`,
    theme: "dark",
    color,
    headerStyle: "clean",
    background: {
      image: isDev
        ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2560&q=80"
        : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80",
      blur: "sm",
      opacity: 25,
    },
    cardBlur: "sm",
    layout: {},
  };

  // Auto-generate layout from service groups
  const serviceGroups = generateServices(profile);
  for (const group of serviceGroups) {
    const name = Object.keys(group)[0];
    const items = group[name];
    settings.layout[name] = {
      style: "row",
      columns: Math.min(items.length, 4),
    };
  }

  return settings;
}

// ─── Generate Widgets ────────────────────────────────────────────

function generateWidgets(profile) {
  const widgets = [];

  // Greeting
  widgets.push({
    greeting: {
      text_size: "xl",
      text: `Welcome, ${profile.meta.username}`,
    },
  });

  // Search
  widgets.push({
    search: {
      provider: ["google", "duckduckgo"],
      focus: true,
      showSearchSuggestions: true,
      target: "_blank",
    },
  });

  // Resources
  widgets.push({
    resources: {
      cpu: true,
      memory: true,
      disk: "/",
    },
  });

  // DateTime
  widgets.push({
    datetime: {
      text_size: "l",
      format: {
        dateStyle: "long",
        timeStyle: "short",
        hour12: false,
      },
    },
  });

  return widgets;
}

// ─── Generate Docker Config ──────────────────────────────────────

function generateDocker(profile) {
  if (profile.containers.length > 0) {
    return { "my-docker": { socket: "/var/run/docker.sock" } };
  }
  return {};
}

// ─── Write Everything ────────────────────────────────────────────

mkdirSync(outputDir, { recursive: true });

const services = generateServices(profile);
const bookmarks = generateBookmarks(profile);
const settings = generateSettings(profile);
const widgets = generateWidgets(profile);
const docker = generateDocker(profile);

const files = {
  "services.yaml": services,
  "bookmarks.yaml": bookmarks,
  "settings.yaml": settings,
  "widgets.yaml": widgets,
  "docker.yaml": docker,
};

for (const [filename, data] of Object.entries(files)) {
  const content = `---\n# Auto-generated by Homepage Setup Agent\n# ${new Date().toISOString()}\n\n${yaml.dump(data, { lineWidth: -1, quotingType: '"' })}`;
  const filepath = join(outputDir, filename);
  writeFileSync(filepath, content);
  console.error(`   ✅ ${filename}`);
}

console.error(`\n🎉 Homepage config generated at ${outputDir}/`);
console.error("   Restart Homepage to see changes.\n");

// Output summary
const summary = {
  services: services.reduce((acc, g) => acc + Object.values(g)[0].length, 0),
  bookmarks: bookmarks.reduce((acc, g) => acc + Object.values(g)[0].length, 0),
  categories: Object.keys(profile.history.categories),
  browsers: profile.history.browsers,
  containers: profile.containers.length,
  devTools: profile.devTools.map((t) => t.name),
};

console.log(JSON.stringify(summary, null, 2));
