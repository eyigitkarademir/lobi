#!/usr/bin/env node
/**
 * Homepage Environment Scanner
 *
 * Scans the local machine for:
 * - Browser history (top sites, categories)
 * - Browser bookmarks
 * - Docker containers
 * - Running services (port scan)
 * - Installed dev tools
 *
 * Outputs a machine profile JSON that agents use to generate config.
 */

import { copyFileSync, existsSync, readFileSync, readdirSync, unlinkSync } from "fs";
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

// ─── Scanner Functions ───────────────────────────────────────────

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
        const domain = extractDomain(row.url);
        if (!domain || /^(localhost|127\.|192\.168\.|10\.)/.test(domain)) continue;

        const existing = domainMap.get(domain);
        if (existing) {
          existing.visitCount = Math.max(existing.visitCount, row.visit_count);
        } else {
          const cat = categorize(row.url);
          domainMap.set(domain, {
            domain,
            url: `https://${domain}/`,
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
              name: node.name,
              url: node.url,
              domain,
              folder: folder || "Unsorted",
              category: cat?.category || "Other",
              icon: cat?.icon || "mdi-web",
              browser,
            });
          }
        }
        if (node.children) {
          for (const child of node.children) {
            walk(child, node.name || folder);
          }
        }
      };

      if (data.roots) {
        for (const root of Object.values(data.roots)) {
          if (typeof root === "object") walk(root);
        }
      }
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
      return {
        name: c.Names,
        image: c.Image,
        status: c.Status,
        ports: c.Ports,
        state: c.State,
      };
    });
  } catch {
    return [];
  }
}

function scanListeningPorts() {
  try {
    let output;
    if (OS === "darwin" || OS === "linux") {
      output = execSync("lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null || ss -tlnp 2>/dev/null", {
        encoding: "utf8", timeout: 5000,
      });
    } else {
      output = execSync("netstat -an | findstr LISTENING", { encoding: "utf8", timeout: 5000 });
    }

    const ports = new Map();
    for (const line of output.split("\n")) {
      const portMatch = line.match(/:(\d+)\s/);
      const nameMatch = line.match(/^(\S+)/);
      if (portMatch) {
        const port = parseInt(portMatch[1]);
        if (port > 1024 && port < 65535) {
          ports.set(port, {
            port,
            process: nameMatch?.[1] || "unknown",
            line: line.trim(),
          });
        }
      }
    }
    return [...ports.values()].sort((a, b) => a.port - b.port);
  } catch {
    return [];
  }
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

// ─── Main ────────────────────────────────────────────────────────

console.error("🔍 Scanning your environment...\n");

console.error("  📂 Browser history...");
const history = scanBrowserHistory();
console.error(`     Found ${history.browsers.length} browser(s): ${history.browsers.join(", ") || "none"}`);
console.error(`     ${history.topSites.length} top sites across ${Object.keys(history.categories).length} categories`);

console.error("  🔖 Bookmarks...");
const bookmarks = scanBookmarks();
console.error(`     Found ${bookmarks.length} bookmarks`);

console.error("  🐳 Docker containers...");
const containers = scanDockerContainers();
console.error(`     Found ${containers.length} running container(s)`);

console.error("  🔌 Listening ports...");
const ports = scanListeningPorts();
console.error(`     Found ${ports.length} service(s)`);

console.error("  🛠  Dev tools...");
const devTools = detectDevTools();
console.error(`     Found ${devTools.length} tool(s)`);

const profile = {
  meta: {
    scannedAt: new Date().toISOString(),
    hostname: hostname(),
    username: userInfo().username,
    platform: OS,
  },
  history,
  bookmarks,
  containers,
  ports,
  devTools,
};

console.error("\n✅ Scan complete. Profile ready.\n");

// Output profile as JSON to stdout
console.log(JSON.stringify(profile, null, 2));
