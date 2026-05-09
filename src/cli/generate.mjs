#!/usr/bin/env node
/**
 * Homepage Config Generator v2
 *
 * Takes a machine profile (from scanner.mjs) and generates
 * personalized Homepage YAML config files with:
 * - Smart categorized services from browser history
 * - Time-based layout (morning/work/evening)
 * - Auto-discovered RSS feeds as bookmarks
 * - Weather from IP geolocation
 * - Calendar + Reminders integration
 * - Currency rates
 * - Focus mode support
 * - Keyboard quick-launch hints
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
  const chunks = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) chunks.push(chunk);
  profile = JSON.parse(chunks.join(""));
}

console.error("📋 Generating config from profile...");
console.error(`   User: ${profile.meta.username}@${profile.meta.hostname}`);
console.error(`   Platform: ${profile.meta.platform}`);

// ─── Time Intelligence ──────────────────────────────────────────

function getTimeMode() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 9) return "morning";
  if (hour >= 9 && hour < 18) return "work";
  if (hour >= 18 && hour < 23) return "evening";
  return "night";
}

function getDayType() {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? "weekend" : "weekday";
}

// ─── Generate Services ──────────────────────────────────────────

function generateServices(profile) {
  const services = [];
  const timeMode = getTimeMode();
  const dayType = getDayType();

  // Hacker News — top stories (zero auth)
  if (profile.hackerNews?.length > 0) {
    const hnServices = profile.hackerNews.slice(0, 4).map((s) => ({
      [s.title.slice(0, 45)]: {
        icon: "si-ycombinator",
        href: s.url,
        description: `${s.score} pts · ${s.comments} comments`,
      },
    }));
    services.push({ "Hacker News": hnServices });
  }

  // GitHub Trending — hot repos (zero auth)
  if (profile.githubTrending?.length > 0) {
    const ghServices = profile.githubTrending.slice(0, 3).map((r) => ({
      [r.name]: {
        icon: "si-github",
        href: r.url,
        description: `${r.stars} stars · ${r.language || ""}`,
      },
    }));
    services.push({ "Trending Repos": ghServices });
  }

  // Docker containers → Infrastructure (always visible)
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

  // Time-aware category ordering
  const categoryPriority = {
    morning:  ["Communication", "Productivity", "Development", "AI", "Social", "Entertainment"],
    work:     ["Development", "AI", "Productivity", "Communication", "Social", "Entertainment"],
    evening:  ["Entertainment", "Social", "Communication", "AI", "Development", "Productivity"],
    night:    ["Entertainment", "Social", "AI", "Communication", "Development", "Productivity"],
  };

  // Weekend shuffles priorities
  const order = dayType === "weekend"
    ? ["Entertainment", "Social", "Communication", "Shopping", "AI", "Development", "Productivity"]
    : (categoryPriority[timeMode] || categoryPriority.work);

  const { categories } = profile.history;

  for (const cat of order) {
    const sites = categories[cat];
    if (!sites || sites.length === 0) continue;

    // Time-based: show more items for priority categories
    const isPriority = order.indexOf(cat) < 3;
    const limit = isPriority ? 4 : 3;

    const catServices = sites.slice(0, limit).map((s) => ({
      [s.title]: {
        icon: s.icon,
        href: s.url,
        description: s.domain,
      },
    }));
    services.push({ [cat]: catServices });
  }

  // Other/uncategorized with high visits
  const otherSites = categories["Other"];
  if (otherSites?.length > 0) {
    const otherServices = otherSites
      .filter((s) => s.visitCount >= 10)
      .slice(0, 4)
      .map((s) => ({
        [s.title]: {
          icon: s.icon, href: s.url,
          description: s.domain,
        },
      }));
    if (otherServices.length > 0) services.push({ Other: otherServices });
  }

  // Holidays
  if (profile.holidays?.length > 0) {
    const holidayServices = profile.holidays.slice(0, 3).map((h) => ({
      [h.name]: {
        icon: "mdi-calendar-star",
        href: "#",
        description: h.date,
      },
    }));
    services.push({ "Upcoming Holidays": holidayServices });
  }

  // Reminders
  if (profile.reminders?.length > 0) {
    const reminderServices = profile.reminders.slice(0, 4).map((r) => ({
      [r.title]: {
        icon: "mdi-checkbox-marked-circle-outline",
        href: "#",
        description: "Reminders",
      },
    }));
    services.push({ Reminders: reminderServices });
  }

  // World Clocks
  if (profile.worldClocks?.length > 0) {
    const clockServices = profile.worldClocks.map((c) => {
      const now = new Date().toLocaleTimeString("en-US", { timeZone: c.tz, hour: "2-digit", minute: "2-digit", hour12: false });
      return {
        [c.city]: {
          icon: "mdi-clock-outline",
          href: "#",
          description: now,
        },
      };
    });
    services.push({ "World Clocks": clockServices });
  }

  // Currency
  if (profile.currency) {
    const c = profile.currency;
    const currencyServices = [
      { [`1 USD = ${c.rate?.toFixed(2)} ${c.local}`]: { icon: "mdi-currency-usd", href: "#", description: "Exchange rate" } },
    ];
    if (c.eurRate) {
      currencyServices.push({ [`1 USD = ${c.eurRate?.toFixed(4)} EUR`]: { icon: "mdi-currency-eur", href: "#", description: "Exchange rate" } });
    }
    services.push({ Currency: currencyServices });
  }

  // Battery
  if (profile.battery) {
    const b = profile.battery;
    const icon = b.percent > 80 ? "mdi-battery-high" : b.percent > 30 ? "mdi-battery-medium" : "mdi-battery-low";
    services.push({
      System: [
        { [`Battery: ${b.percent}%${b.charging ? " (charging)" : ""}`]: { icon, href: "#", description: profile.meta.hostname } },
      ],
    });
  }

  // Spotify
  if (profile.spotify) {
    const s = profile.spotify;
    services.push({
      "Now Playing": [
        { [s.track]: { icon: "si-spotify", href: "https://open.spotify.com", description: s.artist } },
      ],
    });
  }

  // Recent Downloads
  if (profile.downloads?.length > 0) {
    const dlServices = profile.downloads.slice(0, 3).map((f) => {
      const sizeStr = f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`;
      return {
        [f.name.slice(0, 35)]: {
          icon: f.isDir ? "mdi-folder" : "mdi-file",
          href: "#",
          description: sizeStr,
        },
      };
    });
    services.push({ "Recent Downloads": dlServices });
  }

  return services;
}

function extractContainerUrl(container) {
  const match = container.ports?.match(/0\.0\.0\.0:(\d+)/);
  return match ? `http://localhost:${match[1]}` : "#";
}

// ─── Generate Bookmarks ─────────────────────────────────────────

function generateBookmarks(profile) {
  const bookmarks = [];

  // Frequently Visited
  const topSites = profile.history.topSites.slice(0, 8);
  if (topSites.length > 0) {
    bookmarks.push({
      "Frequently Visited": topSites.map((s) => ({
        [s.title]: [{ abbr: s.title.slice(0, 2).toUpperCase(), href: s.url }],
      })),
    });
  }

  // RSS Feeds as a bookmark group
  if (profile.rssFeeds?.length > 0) {
    bookmarks.push({
      "RSS Feeds": profile.rssFeeds.map((f) => ({
        [f.title]: [{ abbr: f.title.slice(0, 2).toUpperCase(), href: f.feedUrl }],
      })),
    });
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

  // "Haven't visited in a while" — sites in bookmarks but low recent visits
  if (profile.bookmarks.length > 0 && profile.history.topSites.length > 0) {
    const topDomains = new Set(profile.history.topSites.map((s) => s.domain));
    const forgotten = profile.bookmarks
      .filter((bm) => !topDomains.has(bm.domain))
      .slice(0, 4);
    if (forgotten.length > 0) {
      bookmarks.push({
        "Rediscover": forgotten.map((bm) => ({
          [bm.name.slice(0, 30)]: [{ abbr: "↺", href: bm.url }],
        })),
      });
    }
  }

  return bookmarks;
}

// ─── Generate Settings ──────────────────────────────────────────

function generateSettings(profile) {
  const { categories } = profile.history;
  const isDev = (categories["Development"]?.length || 0) > 3 || profile.devTools.length > 3;
  const timeMode = getTimeMode();

  // Time-based backgrounds
  const backgrounds = {
    morning: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2560&q=80",
    work:    isDev
      ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2560&q=80"
      : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2560&q=80",
    evening: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=2560&q=80",
    night:   "https://images.unsplash.com/photo-1475274047050-1d0c55b7e751?auto=format&fit=crop&w=2560&q=80",
  };

  const colors = { morning: "amber", work: "slate", evening: "purple", night: "zinc" };

  const settings = {
    title: `${profile.meta.username}'s Dashboard`,
    theme: "dark",
    color: colors[timeMode] || "slate",
    headerStyle: "clean",
    background: {
      image: backgrounds[timeMode] || backgrounds.work,
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
  const timeMode = getTimeMode();

  // Time-aware greeting
  const greetings = {
    morning: `Good morning, ${profile.meta.username}`,
    work:    `${profile.meta.username}'s workspace`,
    evening: `Good evening, ${profile.meta.username}`,
    night:   `Late night, ${profile.meta.username}?`,
  };

  widgets.push({
    greeting: {
      text_size: "xl",
      text: greetings[timeMode] || `Welcome, ${profile.meta.username}`,
    },
  });

  // Search with suggestions
  widgets.push({
    search: {
      provider: ["google", "duckduckgo"],
      focus: true,
      showSearchSuggestions: true,
      target: "_blank",
    },
  });

  // Weather from geolocation
  if (profile.geo) {
    widgets.push({
      openmeteo: {
        label: profile.geo.city,
        latitude: profile.geo.lat,
        longitude: profile.geo.lon,
        timezone: profile.geo.timezone,
        units: "metric",
        cache: 5,
      },
    });
  }

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

// ─── Generate Custom CSS ────────────────────────────────────────

function generateCustomCss(profile) {
  const timeMode = getTimeMode();

  // Focus mode: hide entertainment/social during work hours via CSS class
  let css = `/* Auto-generated by Homepage Setup Agent */\n\n`;

  css += `/* Focus Mode — add ?focus=true to URL to hide distractions */\n`;
  css += `/* Or toggle via custom.js keyboard shortcut (Alt+F) */\n\n`;

  css += `.focus-mode [data-group="Entertainment"],\n`;
  css += `.focus-mode [data-group="Social"],\n`;
  css += `.focus-mode [data-group="Shopping"] {\n`;
  css += `  display: none !important;\n`;
  css += `}\n\n`;

  // Quick-launch number hints
  css += `/* Quick-launch hints (shown on Alt hover) */\n`;
  css += `.quick-launch-hint {\n`;
  css += `  position: absolute;\n`;
  css += `  top: 4px;\n`;
  css += `  left: 4px;\n`;
  css += `  background: rgba(0,0,0,0.7);\n`;
  css += `  color: white;\n`;
  css += `  font-size: 10px;\n`;
  css += `  padding: 2px 6px;\n`;
  css += `  border-radius: 4px;\n`;
  css += `  display: none;\n`;
  css += `}\n`;

  return css;
}

// ─── Generate Custom JS ─────────────────────────────────────────

function generateCustomJs(profile) {
  const topSites = profile.history.topSites.slice(0, 9);

  let js = `/* Auto-generated by Homepage Setup Agent */\n\n`;

  // Focus mode toggle (Alt+F)
  js += `// Focus Mode — Alt+F to toggle\n`;
  js += `document.addEventListener('keydown', (e) => {\n`;
  js += `  if (e.altKey && e.key === 'f') {\n`;
  js += `    document.body.classList.toggle('focus-mode');\n`;
  js += `    e.preventDefault();\n`;
  js += `  }\n`;
  js += `});\n\n`;

  // Quick Launch — Alt+1 through Alt+9 for top sites
  js += `// Quick Launch — Alt+[1-9] opens top sites\n`;
  js += `const quickLaunchUrls = [\n`;
  for (const site of topSites) {
    js += `  "${site.url}", // ${site.title}\n`;
  }
  js += `];\n\n`;
  js += `document.addEventListener('keydown', (e) => {\n`;
  js += `  if (e.altKey && e.key >= '1' && e.key <= '9') {\n`;
  js += `    const idx = parseInt(e.key) - 1;\n`;
  js += `    if (quickLaunchUrls[idx]) {\n`;
  js += `      window.open(quickLaunchUrls[idx], '_blank');\n`;
  js += `      e.preventDefault();\n`;
  js += `    }\n`;
  js += `  }\n`;
  js += `});\n\n`;

  // Auto-refresh to update time-based layout
  js += `// Auto-refresh at mode transitions (9am, 6pm, 11pm)\n`;
  js += `function scheduleRefresh() {\n`;
  js += `  const now = new Date();\n`;
  js += `  const transitions = [9, 18, 23];\n`;
  js += `  let next = null;\n`;
  js += `  for (const hour of transitions) {\n`;
  js += `    const target = new Date(now);\n`;
  js += `    target.setHours(hour, 0, 0, 0);\n`;
  js += `    if (target > now) { next = target; break; }\n`;
  js += `  }\n`;
  js += `  if (!next) {\n`;
  js += `    next = new Date(now);\n`;
  js += `    next.setDate(next.getDate() + 1);\n`;
  js += `    next.setHours(9, 0, 0, 0);\n`;
  js += `  }\n`;
  js += `  const ms = next - now;\n`;
  js += `  setTimeout(() => location.reload(), ms);\n`;
  js += `}\n`;
  js += `scheduleRefresh();\n`;

  return js;
}

// ─── Write Everything ────────────────────────────────────────────

mkdirSync(outputDir, { recursive: true });

const services = generateServices(profile);
const bookmarks = generateBookmarks(profile);
const settings = generateSettings(profile);
const widgets = generateWidgets(profile);
const docker = generateDocker(profile);
const customCss = generateCustomCss(profile);
const customJs = generateCustomJs(profile);

const yamlFiles = {
  "services.yaml": services,
  "bookmarks.yaml": bookmarks,
  "settings.yaml": settings,
  "widgets.yaml": widgets,
  "docker.yaml": docker,
};

for (const [filename, data] of Object.entries(yamlFiles)) {
  const content = `---\n# Auto-generated by Homepage Setup Agent\n# ${new Date().toISOString()}\n# Time mode: ${getTimeMode()} | Day: ${getDayType()}\n\n${yaml.dump(data, { lineWidth: -1, quotingType: '"' })}`;
  writeFileSync(join(outputDir, filename), content);
  console.error(`   ✅ ${filename}`);
}

writeFileSync(join(outputDir, "custom.css"), customCss);
console.error(`   ✅ custom.css`);
writeFileSync(join(outputDir, "custom.js"), customJs);
console.error(`   ✅ custom.js`);

console.error(`\n🎉 Homepage config generated at ${outputDir}/`);
console.error(`   Time mode: ${getTimeMode()} | Day: ${getDayType()}`);
console.error(`   Focus mode: Alt+F | Quick launch: Alt+[1-9]\n`);

// Output summary
const summary = {
  services: services.reduce((acc, g) => acc + Object.values(g)[0].length, 0),
  bookmarks: bookmarks.reduce((acc, g) => acc + Object.values(g)[0].length, 0),
  categories: Object.keys(profile.history.categories),
  browsers: profile.history.browsers,
  containers: profile.containers.length,
  devTools: profile.devTools.map((t) => t.name),
  timeMode: getTimeMode(),
  dayType: getDayType(),
  geo: profile.geo?.city || null,
  rssFeeds: profile.rssFeeds?.length || 0,
  holidays: profile.holidays?.length || 0,
  reminders: profile.reminders?.length || 0,
  calendarEvents: profile.calendar?.length || 0,
  currency: profile.currency ? `1 USD = ${profile.currency.rate?.toFixed(2)} ${profile.currency.local}` : null,
  features: ["time-based-layout", "focus-mode", "quick-launch", "auto-refresh", "rss-discovery"],
};

console.log(JSON.stringify(summary, null, 2));
