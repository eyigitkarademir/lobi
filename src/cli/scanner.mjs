#!/usr/bin/env node
/**
 * Homepage Environment Scanner v2
 *
 * Scans the local machine for:
 * - Browser history (top sites, categories)
 * - Browser bookmarks
 * - Docker containers
 * - Running services (port scan)
 * - Installed dev tools
 * - Geolocation (IP-based)
 * - macOS Calendar events
 * - macOS Reminders
 * - Spotify now playing
 * - Battery status
 * - Recent downloads
 * - RSS feed discovery
 * - Screen time (macOS)
 *
 * Outputs a machine profile JSON that agents use to generate config.
 */

import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, unlinkSync } from "fs";
import { execSync } from "child_process";
import { homedir, platform, hostname, userInfo } from "os";
import { join } from "path";
import Database from "better-sqlite3";

const HOME = homedir();
const OS = platform();

// ─── Browser Paths ───────────────────────────────────────────────
const BROWSER_PATHS = {
  darwin: {
    chrome:     { history: "Library/Application Support/Google/Chrome/Default/History",           bookmarks: "Library/Application Support/Google/Chrome/Default/Bookmarks" },
    opera:      { history: "Library/Application Support/com.operasoftware.Opera/Default/History", bookmarks: "Library/Application Support/com.operasoftware.Opera/Default/Bookmarks" },
    "opera-gx": { history: "Library/Application Support/com.operasoftware.OperaGX/Default/History", bookmarks: "Library/Application Support/com.operasoftware.OperaGX/Default/Bookmarks" },
    brave:      { history: "Library/Application Support/BraveSoftware/Brave-Browser/Default/History", bookmarks: "Library/Application Support/BraveSoftware/Brave-Browser/Default/Bookmarks" },
    edge:       { history: "Library/Application Support/Microsoft Edge/Default/History",         bookmarks: "Library/Application Support/Microsoft Edge/Default/Bookmarks" },
    arc:        { history: "Library/Application Support/Arc/User Data/Default/History",           bookmarks: "Library/Application Support/Arc/User Data/Default/Bookmarks" },
    vivaldi:    { history: "Library/Application Support/Vivaldi/Default/History",                 bookmarks: "Library/Application Support/Vivaldi/Default/Bookmarks" },
  },
  linux: {
    chrome:  { history: ".config/google-chrome/Default/History",               bookmarks: ".config/google-chrome/Default/Bookmarks" },
    opera:   { history: ".config/opera/Default/History",                        bookmarks: ".config/opera/Default/Bookmarks" },
    brave:   { history: ".config/BraveSoftware/Brave-Browser/Default/History",  bookmarks: ".config/BraveSoftware/Brave-Browser/Default/Bookmarks" },
    edge:    { history: ".config/microsoft-edge/Default/History",               bookmarks: ".config/microsoft-edge/Default/Bookmarks" },
    vivaldi: { history: ".config/vivaldi/Default/History",                      bookmarks: ".config/vivaldi/Default/Bookmarks" },
  },
  win32: {
    chrome:  { history: "AppData/Local/Google/Chrome/User Data/Default/History",                bookmarks: "AppData/Local/Google/Chrome/User Data/Default/Bookmarks" },
    opera:   { history: "AppData/Roaming/Opera Software/Opera Stable/Default/History",          bookmarks: "AppData/Roaming/Opera Software/Opera Stable/Default/Bookmarks" },
    brave:   { history: "AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History",  bookmarks: "AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/Bookmarks" },
    edge:    { history: "AppData/Local/Microsoft/Edge/User Data/Default/History",                bookmarks: "AppData/Local/Microsoft/Edge/User Data/Default/Bookmarks" },
    vivaldi: { history: "AppData/Local/Vivaldi/User Data/Default/History",                       bookmarks: "AppData/Local/Vivaldi/User Data/Default/Bookmarks" },
  },
};

// ─── Category Rules ──────────────────────────────────────────────
const CATEGORIES = [
  { p: /github\.com/, cat: "Development", name: "GitHub", icon: "si-github" },
  { p: /gitlab\.com/, cat: "Development", name: "GitLab", icon: "si-gitlab" },
  { p: /stackoverflow\.com/, cat: "Development", name: "Stack Overflow", icon: "si-stackoverflow" },
  { p: /linear\.app/, cat: "Development", name: "Linear", icon: "si-linear" },
  { p: /figma\.com/, cat: "Development", name: "Figma", icon: "si-figma" },
  { p: /vercel\.com/, cat: "Development", name: "Vercel", icon: "si-vercel" },
  { p: /netlify\.com/, cat: "Development", name: "Netlify", icon: "si-netlify" },
  { p: /notion\.so/, cat: "Productivity", name: "Notion", icon: "si-notion" },
  { p: /docker\.com|hub\.docker/, cat: "Development", name: "Docker Hub", icon: "si-docker" },
  { p: /npmjs\.com/, cat: "Development", name: "npm", icon: "si-npm" },
  { p: /claude\.ai/, cat: "AI", name: "Claude", icon: "si-anthropic" },
  { p: /chat\.openai\.com|chatgpt\.com/, cat: "AI", name: "ChatGPT", icon: "si-openai" },
  { p: /gemini\.google/, cat: "AI", name: "Gemini", icon: "si-google" },
  { p: /perplexity\.ai/, cat: "AI", name: "Perplexity", icon: "si-perplexity" },
  { p: /huggingface\.co/, cat: "AI", name: "Hugging Face", icon: "si-huggingface" },
  { p: /twitter\.com|x\.com/, cat: "Social", name: "X", icon: "si-x" },
  { p: /reddit\.com/, cat: "Social", name: "Reddit", icon: "si-reddit" },
  { p: /instagram\.com/, cat: "Social", name: "Instagram", icon: "si-instagram" },
  { p: /linkedin\.com/, cat: "Social", name: "LinkedIn", icon: "si-linkedin" },
  { p: /facebook\.com/, cat: "Social", name: "Facebook", icon: "si-facebook" },
  { p: /discord\.com/, cat: "Social", name: "Discord", icon: "si-discord" },
  { p: /slack\.com/, cat: "Social", name: "Slack", icon: "si-slack" },
  { p: /telegram\.org|web\.telegram/, cat: "Social", name: "Telegram", icon: "si-telegram" },
  { p: /mastodon\./, cat: "Social", name: "Mastodon", icon: "si-mastodon" },
  { p: /mail\.google|gmail\.com/, cat: "Communication", name: "Gmail", icon: "si-gmail" },
  { p: /outlook\./, cat: "Communication", name: "Outlook", icon: "si-microsoftoutlook" },
  { p: /meet\.google/, cat: "Communication", name: "Google Meet", icon: "si-googlemeet" },
  { p: /zoom\.us/, cat: "Communication", name: "Zoom", icon: "si-zoom" },
  { p: /calendar\.google/, cat: "Communication", name: "Google Calendar", icon: "si-googlecalendar" },
  { p: /youtube\.com|youtu\.be/, cat: "Entertainment", name: "YouTube", icon: "si-youtube" },
  { p: /netflix\.com/, cat: "Entertainment", name: "Netflix", icon: "si-netflix" },
  { p: /twitch\.tv/, cat: "Entertainment", name: "Twitch", icon: "si-twitch" },
  { p: /spotify\.com/, cat: "Entertainment", name: "Spotify", icon: "si-spotify" },
  { p: /docs\.google/, cat: "Productivity", name: "Google Docs", icon: "si-googledocs" },
  { p: /drive\.google/, cat: "Productivity", name: "Google Drive", icon: "si-googledrive" },
  { p: /trello\.com/, cat: "Productivity", name: "Trello", icon: "si-trello" },
  { p: /amazon\./, cat: "Shopping", name: "Amazon", icon: "si-amazon" },
  { p: /wikipedia\.org/, cat: "Reference", name: "Wikipedia", icon: "si-wikipedia" },
];

function categorize(url) {
  for (const r of CATEGORIES) {
    if (r.p.test(url)) return { category: r.cat, name: r.name, icon: r.icon };
  }
  return null;
}

function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

// Canonical domain mapping — merge duplicates
const CANONICAL_DOMAINS = {
  "gmail.com": "mail.google.com",
  "google.com": "google.com",
  "m.youtube.com": "youtube.com",
  "mobile.twitter.com": "x.com",
  "twitter.com": "x.com",
  "old.reddit.com": "reddit.com",
  "m.facebook.com": "facebook.com",
  "m.linkedin.com": "linkedin.com",
};

function canonicalDomain(domain) {
  return CANONICAL_DOMAINS[domain] || domain;
}

// ─── Existing Scanners ───────────────────────────────────────────

function withDbCopy(dbPath, fn) {
  const tmp = join("/tmp", `hp_scan_${Date.now()}.db`);
  try {
    copyFileSync(dbPath, tmp);
    const db = new Database(tmp, { readonly: true });
    try { return fn(db); } finally { db.close(); }
  } finally { try { unlinkSync(tmp); } catch {} }
}

function scanBrowserHistory() {
  const paths = BROWSER_PATHS[OS];
  if (!paths) return { browsers: [], topSites: [], categories: {} };

  const browsers = [];
  const domainMap = new Map();
  const EPOCH = 11644473600000000n;

  for (const [browser, { history }] of Object.entries(paths)) {
    const dbPath = join(HOME, history);
    if (!existsSync(dbPath)) continue;
    browsers.push(browser);

    try {
      const rows = withDbCopy(dbPath, (db) =>
        db.prepare(`
          SELECT url, title, visit_count, last_visit_time
          FROM urls
          WHERE url NOT LIKE 'chrome://%' AND url NOT LIKE 'opera://%'
            AND url NOT LIKE 'brave://%' AND url NOT LIKE 'edge://%'
            AND url NOT LIKE 'chrome-extension://%'
            AND title != '' AND visit_count > 1
          ORDER BY visit_count DESC LIMIT 100
        `).all()
      );

      for (const row of rows) {
        let domain = extractDomain(row.url);
        if (!domain || /^(localhost|127\.|192\.168\.|10\.)/.test(domain)) continue;
        domain = canonicalDomain(domain);
        const existing = domainMap.get(domain);
        if (existing) {
          existing.visitCount = Math.max(existing.visitCount, row.visit_count);
        } else {
          const cat = categorize(row.url);
          domainMap.set(domain, {
            domain, url: `https://${domain}/`,
            title: cat?.name || row.title.replace(/\s*[-–|].*$/, "").trim().slice(0, 40),
            visitCount: row.visit_count,
            lastVisit: Number(BigInt(row.last_visit_time) - EPOCH) / 1000,
            category: cat?.category || "Other",
            icon: cat?.icon || "mdi-web",
            source: browser,
          });
        }
      }
    } catch (e) {
      console.error(`  ⚠ Could not read ${browser} history: ${e.message}`);
    }
  }

  const sites = [...domainMap.values()].sort((a, b) => b.visitCount - a.visitCount);
  const categories = {};
  for (const s of sites) {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  }
  return { browsers, topSites: sites.slice(0, 20), categories };
}

function scanBookmarks() {
  const paths = BROWSER_PATHS[OS];
  if (!paths) return [];
  const allBookmarks = [];

  for (const [browser, { bookmarks: bPath }] of Object.entries(paths)) {
    if (!bPath) continue;
    const fullPath = join(HOME, bPath);
    if (!existsSync(fullPath)) continue;
    try {
      const data = JSON.parse(readFileSync(fullPath, "utf8"));
      const walk = (node, folder = "") => {
        if (!node) return;
        if (node.type === "url" && node.url) {
          const domain = extractDomain(node.url);
          if (domain && !/^(localhost|127\.|192\.168\.)/.test(domain)) {
            const cat = categorize(node.url);
            allBookmarks.push({
              name: node.name, url: node.url, domain,
              folder: folder || "Unsorted",
              category: cat?.category || "Other",
              icon: cat?.icon || "mdi-web", browser,
            });
          }
        }
        if (node.children) for (const child of node.children) walk(child, node.name || folder);
      };
      if (data.roots) for (const root of Object.values(data.roots)) if (typeof root === "object") walk(root);
    } catch (e) {
      console.error(`  ⚠ Could not read ${browser} bookmarks: ${e.message}`);
    }
  }
  return allBookmarks;
}

function scanDockerContainers() {
  try {
    const output = execSync("docker ps --format '{{json .}}'", { encoding: "utf8", timeout: 5000 });
    return output.trim().split("\n").filter(Boolean).map((line) => {
      const c = JSON.parse(line);
      return { name: c.Names, image: c.Image, status: c.Status, ports: c.Ports, state: c.State };
    });
  } catch { return []; }
}

function scanListeningPorts() {
  try {
    let output;
    if (OS === "darwin" || OS === "linux") {
      output = execSync("lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null || ss -tlnp 2>/dev/null", { encoding: "utf8", timeout: 5000 });
    } else {
      output = execSync("netstat -an | findstr LISTENING", { encoding: "utf8", timeout: 5000 });
    }
    const ports = new Map();
    for (const line of output.split("\n")) {
      const portMatch = line.match(/:(\d+)\s/);
      const nameMatch = line.match(/^(\S+)/);
      if (portMatch) {
        const port = parseInt(portMatch[1]);
        if (port > 1024 && port < 65535) ports.set(port, { port, process: nameMatch?.[1] || "unknown" });
      }
    }
    return [...ports.values()].sort((a, b) => a.port - b.port);
  } catch { return []; }
}

function detectDevTools() {
  const tools = [];
  const check = (cmd, name, icon) => {
    try {
      const version = execSync(`${cmd} --version 2>/dev/null`, { encoding: "utf8", timeout: 3000 }).trim();
      tools.push({ name, version: version.split("\n")[0], icon });
    } catch {}
  };
  check("node", "Node.js", "si-nodedotjs");
  check("python3", "Python", "si-python");
  check("go", "Go", "si-go");
  check("rustc", "Rust", "si-rust");
  check("java", "Java", "si-openjdk");
  check("ruby", "Ruby", "si-ruby");
  check("docker", "Docker", "si-docker");
  check("kubectl", "Kubernetes", "si-kubernetes");
  check("git", "Git", "si-git");
  check("code", "VS Code", "si-visualstudiocode");
  return tools;
}

// ─── NEW: Geolocation (IP-based) ────────────────────────────────

async function scanGeolocation() {
  try {
    const res = await fetch("http://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon,timezone,query", { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (data.status === "success") {
      return { city: data.city, country: data.country, countryCode: data.countryCode, lat: data.lat, lon: data.lon, timezone: data.timezone, ip: data.query };
    }
  } catch {}
  return null;
}

// ─── NEW: macOS Calendar Events ─────────────────────────────────

function scanCalendarEvents() {
  if (OS !== "darwin") return [];
  try {
    // Use icalBuddy if available, otherwise osascript
    try {
      const output = execSync("icalBuddy -n -nc -li 10 -ea -df '%Y-%m-%d' -tf '%H:%M' eventsToday+3", { encoding: "utf8", timeout: 5000 });
      return output.trim().split("\n").filter(Boolean).map((line) => {
        const match = line.match(/^(.+?)(\d{4}-\d{2}-\d{2})?\s*(?:at\s*)?(\d{2}:\d{2})?\s*-\s*(\d{2}:\d{2})?/);
        return { raw: line.trim(), title: match?.[1]?.trim() || line.trim() };
      }).slice(0, 10);
    } catch {
      // Fallback: osascript
      const script = `
        tell application "Calendar"
          set today to current date
          set endDate to today + 3 * days
          set output to ""
          repeat with cal in calendars
            set evts to (every event of cal whose start date >= today and start date <= endDate)
            repeat with e in evts
              set output to output & summary of e & " | " & start date of e & linefeed
            end repeat
          end repeat
          return output
        end tell
      `;
      const output = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { encoding: "utf8", timeout: 10000 });
      return output.trim().split("\n").filter(Boolean).map((line) => {
        const parts = line.split(" | ");
        return { title: parts[0]?.trim(), date: parts[1]?.trim() };
      }).slice(0, 10);
    }
  } catch { return []; }
}

// ─── NEW: macOS Reminders ───────────────────────────────────────

function scanReminders() {
  if (OS !== "darwin") return [];
  try {
    const script = `
      tell application "Reminders"
        set output to ""
        repeat with r in (every reminder whose completed is false)
          set output to output & name of r & linefeed
        end repeat
        return output
      end tell
    `;
    const output = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { encoding: "utf8", timeout: 10000 });
    return output.trim().split("\n").filter(Boolean).map((line) => ({ title: line.trim() })).slice(0, 15);
  } catch { return []; }
}

// ─── NEW: Spotify Now Playing ───────────────────────────────────

function scanSpotify() {
  if (OS !== "darwin") return null;
  try {
    const script = `
      if application "Spotify" is running then
        tell application "Spotify"
          set trackName to name of current track
          set artistName to artist of current track
          set albumName to album of current track
          set trackState to player state as string
          return trackName & " | " & artistName & " | " & albumName & " | " & trackState
        end tell
      else
        return "not_running"
      end if
    `;
    const output = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { encoding: "utf8", timeout: 5000 }).trim();
    if (output === "not_running") return null;
    const [track, artist, album, state] = output.split(" | ");
    return { track, artist, album, state };
  } catch { return null; }
}

// ─── NEW: Battery Status ────────────────────────────────────────

function scanBattery() {
  try {
    if (OS === "darwin") {
      const output = execSync("pmset -g batt", { encoding: "utf8", timeout: 3000 });
      const pctMatch = output.match(/(\d+)%/);
      const charging = output.includes("AC Power") || output.includes("charging");
      return { percent: pctMatch ? parseInt(pctMatch[1]) : null, charging };
    }
    if (OS === "linux") {
      const cap = readFileSync("/sys/class/power_supply/BAT0/capacity", "utf8").trim();
      const status = readFileSync("/sys/class/power_supply/BAT0/status", "utf8").trim();
      return { percent: parseInt(cap), charging: status === "Charging" };
    }
  } catch {}
  return null;
}

// ─── NEW: Recent Downloads ──────────────────────────────────────

function scanRecentDownloads() {
  const downloadsDir = join(HOME, "Downloads");
  try {
    const files = readdirSync(downloadsDir)
      .filter((f) => !f.startsWith("."))
      .map((f) => {
        const fullPath = join(downloadsDir, f);
        const stat = statSync(fullPath);
        return { name: f, size: stat.size, modified: stat.mtime.toISOString(), isDir: stat.isDirectory() };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified))
      .slice(0, 10);
    return files;
  } catch { return []; }
}

// ─── NEW: RSS Feed Discovery ────────────────────────────────────

async function discoverRssFeeds(topSites) {
  const feedPaths = ["/rss", "/feed", "/atom.xml", "/rss.xml", "/feed.xml", "/index.xml", "/feeds/posts/default"];
  const discovered = [];

  // Only check news/blog-like sites, skip social/apps
  const skipDomains = /youtube|google|facebook|instagram|twitter|x\.com|linkedin|reddit|amazon|spotify|netflix|telegram|discord|slack|zoom|meet\./;

  const candidates = topSites
    .filter((s) => !skipDomains.test(s.domain))
    .slice(0, 8);

  for (const site of candidates) {
    for (const path of feedPaths) {
      try {
        const url = `https://${site.domain}${path}`;
        const res = await fetch(url, {
          signal: AbortSignal.timeout(3000),
          headers: { "User-Agent": "Homepage-Setup/1.0" },
          redirect: "follow",
        });
        if (res.ok) {
          const text = await res.text();
          // Quick check if it looks like RSS/Atom
          if (text.includes("<rss") || text.includes("<feed") || text.includes("<channel")) {
            // Extract feed title
            const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/);
            discovered.push({
              domain: site.domain,
              feedUrl: url,
              title: titleMatch?.[1] || site.title,
              siteTitle: site.title,
            });
            break; // Found feed for this domain, move on
          }
        }
      } catch { continue; }
    }
  }
  return discovered;
}

// ─── NEW: Public Holidays ───────────────────────────────────────

async function scanHolidays(countryCode) {
  if (!countryCode) return [];
  try {
    const year = new Date().getFullYear();
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const holidays = await res.json();
    const today = new Date().toISOString().split("T")[0];
    return holidays
      .filter((h) => h.date >= today)
      .slice(0, 5)
      .map((h) => ({ date: h.date, name: h.localName, intlName: h.name }));
  } catch { return []; }
}

// ─── NEW: Currency Rates ────────────────────────────────────────

async function scanCurrencyRates(countryCode) {
  const currencyByCountry = { TR: "TRY", US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", JP: "JPY", BR: "BRL", IN: "INR", KR: "KRW", MX: "MXN", CA: "CAD", AU: "AUD" };
  const localCurrency = currencyByCountry[countryCode] || null;
  if (!localCurrency || localCurrency === "USD") return null;

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/USD`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      base: "USD",
      local: localCurrency,
      rate: data.rates?.[localCurrency],
      eurRate: data.rates?.EUR,
      updated: data.time_last_update_utc,
    };
  } catch { return null; }
}

// ─── NEW: Hacker News Top Stories (zero auth) ──────────────────

async function scanHackerNews() {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", { signal: AbortSignal.timeout(5000) });
    const ids = await res.json();
    const stories = [];
    for (const id of ids.slice(0, 5)) {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { signal: AbortSignal.timeout(3000) });
      const story = await storyRes.json();
      stories.push({ title: story.title, url: story.url || `https://news.ycombinator.com/item?id=${id}`, score: story.score, comments: story.descendants || 0 });
    }
    return stories;
  } catch { return []; }
}

// ─── NEW: GitHub Trending (zero auth, scrape) ───────────────────

async function scanGithubTrending() {
  try {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const res = await fetch(`https://api.github.com/search/repositories?q=created:>${weekAgo}&sort=stars&order=desc&per_page=5`, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "Homepage-Setup/1.0" } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((r) => ({
      name: r.full_name,
      description: r.description?.slice(0, 80) || "",
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
    }));
  } catch { return []; }
}

// ─── NEW: World Clock (from geo) ────────────────────────────────

function generateWorldClocks(geo) {
  if (!geo) return [];
  // Suggest useful timezones based on user's location
  const allZones = [
    { city: "New York", tz: "America/New_York", region: "US" },
    { city: "San Francisco", tz: "America/Los_Angeles", region: "US" },
    { city: "London", tz: "Europe/London", region: "EU" },
    { city: "Berlin", tz: "Europe/Berlin", region: "EU" },
    { city: "Istanbul", tz: "Europe/Istanbul", region: "EU" },
    { city: "Dubai", tz: "Asia/Dubai", region: "ME" },
    { city: "Tokyo", tz: "Asia/Tokyo", region: "APAC" },
    { city: "Singapore", tz: "Asia/Singapore", region: "APAC" },
    { city: "Sydney", tz: "Australia/Sydney", region: "APAC" },
    { city: "São Paulo", tz: "America/Sao_Paulo", region: "LATAM" },
  ];
  // Exclude user's own timezone, pick 4 useful ones
  return allZones.filter((z) => z.tz !== geo.timezone).slice(0, 4);
}

// ─── Main ────────────────────────────────────────────────────────

console.error("🔍 Scanning your environment...\n");

console.error("  📂 Browser history...");
const history = scanBrowserHistory();
console.error(`     ${history.browsers.length} browser(s): ${history.browsers.join(", ") || "none"}`);
console.error(`     ${history.topSites.length} top sites across ${Object.keys(history.categories).length} categories`);

console.error("  🔖 Bookmarks...");
const bookmarks = scanBookmarks();
console.error(`     ${bookmarks.length} bookmarks`);

console.error("  🐳 Docker containers...");
const containers = scanDockerContainers();
console.error(`     ${containers.length} running container(s)`);

console.error("  🔌 Listening ports...");
const ports = scanListeningPorts();
console.error(`     ${ports.length} service(s)`);

console.error("  🛠  Dev tools...");
const devTools = detectDevTools();
console.error(`     ${devTools.length} tool(s)`);

console.error("  🌍 Geolocation...");
const geo = await scanGeolocation();
console.error(`     ${geo ? `${geo.city}, ${geo.country} (${geo.timezone})` : "unavailable"}`);

console.error("  📅 Calendar events...");
const calendar = scanCalendarEvents();
console.error(`     ${calendar.length} upcoming event(s)`);

console.error("  ✅ Reminders...");
const reminders = scanReminders();
console.error(`     ${reminders.length} active reminder(s)`);

console.error("  🎵 Spotify...");
const spotify = scanSpotify();
console.error(`     ${spotify ? `${spotify.track} — ${spotify.artist}` : "not playing"}`);

console.error("  🔋 Battery...");
const battery = scanBattery();
console.error(`     ${battery ? `${battery.percent}%${battery.charging ? " (charging)" : ""}` : "no battery"}`);

console.error("  📥 Recent downloads...");
const downloads = scanRecentDownloads();
console.error(`     ${downloads.length} file(s)`);

console.error("  📡 RSS feeds...");
const rssFeeds = await discoverRssFeeds(history.topSites);
console.error(`     ${rssFeeds.length} feed(s) discovered`);

console.error("  🎉 Public holidays...");
const holidays = await scanHolidays(geo?.countryCode);
console.error(`     ${holidays.length} upcoming holiday(s)`);

console.error("  💱 Currency rates...");
const currency = await scanCurrencyRates(geo?.countryCode);
console.error(`     ${currency ? `1 USD = ${currency.rate?.toFixed(2)} ${currency.local}` : "N/A"}`);

console.error("  🔥 Hacker News...");
const hackerNews = await scanHackerNews();
console.error(`     ${hackerNews.length} top stories`);

console.error("  ⭐ GitHub Trending...");
const githubTrending = await scanGithubTrending();
console.error(`     ${githubTrending.length} trending repos`);

console.error("  🕐 World clocks...");
const worldClocks = generateWorldClocks(geo);
console.error(`     ${worldClocks.length} timezone(s)`);

const profile = {
  meta: {
    scannedAt: new Date().toISOString(),
    hostname: hostname(),
    username: userInfo().username,
    platform: OS,
  },
  geo,
  history,
  bookmarks,
  containers,
  ports,
  devTools,
  calendar,
  reminders,
  spotify,
  battery,
  downloads,
  rssFeeds,
  holidays,
  currency,
  hackerNews,
  githubTrending,
  worldClocks,
};

console.error("\n✅ Scan complete. Profile ready.\n");
console.log(JSON.stringify(profile, null, 2));
