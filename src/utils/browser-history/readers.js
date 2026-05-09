import { copyFileSync, existsSync, unlinkSync } from "fs";
import { homedir, platform } from "os";
import { join } from "path";

import Database from "better-sqlite3";

import createLogger from "utils/logger";

const logger = createLogger("browserHistory");

// Browser profile paths per platform
const BROWSER_PATHS = {
  darwin: {
    chrome: "Library/Application Support/Google/Chrome/Default/History",
    "chrome-beta": "Library/Application Support/Google/Chrome Beta/Default/History",
    opera: "Library/Application Support/com.operasoftware.Opera/Default/History",
    "opera-air": "Library/Application Support/com.operasoftware.OperaAir/Default/History",
    "opera-gx": "Library/Application Support/com.operasoftware.OperaGX/Default/History",
    brave: "Library/Application Support/BraveSoftware/Brave-Browser/Default/History",
    edge: "Library/Application Support/Microsoft Edge/Default/History",
    arc: "Library/Application Support/Arc/User Data/Default/History",
    vivaldi: "Library/Application Support/Vivaldi/Default/History",
    firefox: "Library/Application Support/Firefox/Profiles",
    safari: "Library/Safari/History.db",
  },
  linux: {
    chrome: ".config/google-chrome/Default/History",
    opera: ".config/opera/Default/History",
    brave: ".config/BraveSoftware/Brave-Browser/Default/History",
    edge: ".config/microsoft-edge/Default/History",
    vivaldi: ".config/vivaldi/Default/History",
    firefox: ".mozilla/firefox",
  },
  win32: {
    chrome: "AppData/Local/Google/Chrome/User Data/Default/History",
    opera: "AppData/Roaming/Opera Software/Opera Stable/Default/History",
    brave: "AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History",
    edge: "AppData/Local/Microsoft/Edge/User Data/Default/History",
    vivaldi: "AppData/Local/Vivaldi/User Data/Default/History",
    firefox: "AppData/Roaming/Mozilla/Firefox/Profiles",
  },
};

// Chromium epoch offset: microseconds from 1601-01-01 to 1970-01-01
const CHROMIUM_EPOCH_OFFSET = 11644473600000000n;

// Docker mount path — when running in Docker, history DBs can be mounted here
const DOCKER_HISTORY_DIR = "/app/browser-history";

/**
 * Detect all installed browsers by checking if their history DB exists.
 * Supports both native paths and Docker-mounted paths.
 *
 * Docker usage: mount history DBs to /app/browser-history/<browser-name>
 *   e.g. -v "/path/to/History:/app/browser-history/opera:ro"
 */
export function detectBrowsers() {
  const detected = [];

  // Check Docker-mounted history DBs first
  if (existsSync(DOCKER_HISTORY_DIR)) {
    try {
      const { readdirSync } = require("fs");
      const entries = readdirSync(DOCKER_HISTORY_DIR);
      for (const entry of entries) {
        const fullPath = join(DOCKER_HISTORY_DIR, entry);
        // Determine engine from browser name
        const engine = entry === "firefox" ? "firefox" : entry === "safari" ? "safari" : "chromium";
        detected.push({ browser: entry, path: fullPath, engine });
        logger.info("Found Docker-mounted browser history: %s at %s", entry, fullPath);
      }
    } catch (e) {
      logger.debug("Could not read Docker history dir: %s", e.message);
    }
  }

  // Then check native paths
  const os = platform();
  const home = homedir();
  const paths = BROWSER_PATHS[os];

  if (!paths && detected.length === 0) {
    logger.warn("Unsupported platform for browser history: %s", os);
    return [];
  }

  if (!paths) return detected;
  for (const [browser, relPath] of Object.entries(paths)) {
    if (browser === "firefox" || browser === "safari") continue; // handled separately
    const fullPath = join(home, relPath);
    if (existsSync(fullPath)) {
      detected.push({ browser, path: fullPath, engine: "chromium" });
    }
  }

  // Firefox — find default profile
  if (paths.firefox) {
    const firefoxDir = join(home, paths.firefox);
    if (existsSync(firefoxDir)) {
      const profilePath = findFirefoxProfile(firefoxDir);
      if (profilePath) {
        detected.push({ browser: "firefox", path: profilePath, engine: "firefox" });
      }
    }
  }

  // Safari (macOS only)
  if (os === "darwin" && paths.safari) {
    const safariPath = join(home, paths.safari);
    if (existsSync(safariPath)) {
      detected.push({ browser: "safari", path: safariPath, engine: "safari" });
    }
  }

  logger.info("Detected browsers: %s", detected.map((b) => b.browser).join(", "));
  return detected;
}

/**
 * Find Firefox default profile directory.
 */
function findFirefoxProfile(profilesDir) {
  try {
    const { readdirSync } = require("fs");
    const dirs = readdirSync(profilesDir);
    // Look for default-release profile first, then any .default profile
    const defaultRelease = dirs.find((d) => d.endsWith(".default-release"));
    const defaultProfile = dirs.find((d) => d.endsWith(".default"));
    const profile = defaultRelease || defaultProfile;
    if (profile) {
      const dbPath = join(profilesDir, profile, "places.sqlite");
      if (existsSync(dbPath)) return dbPath;
    }
  } catch (e) {
    logger.debug("Failed to find Firefox profile: %s", e.message);
  }
  return null;
}

/**
 * Safely copy DB to temp file to avoid lock issues, then read it.
 * Returns a function that cleans up the temp file.
 */
function withDbCopy(dbPath, callback) {
  const tmpPath = join("/tmp", `homepage_history_${Date.now()}_${Math.random().toString(36).slice(2)}.db`);
  try {
    copyFileSync(dbPath, tmpPath);
    const db = new Database(tmpPath, { readonly: true, fileMustExist: true });
    try {
      return callback(db);
    } finally {
      db.close();
    }
  } finally {
    try {
      unlinkSync(tmpPath);
    } catch {
      // ignore cleanup errors
    }
  }
}

/**
 * Read history from a Chromium-based browser.
 */
function readChromiumHistory(dbPath, { limit = 10, mode = "top" } = {}) {
  return withDbCopy(dbPath, (db) => {
    const orderBy = mode === "recent" ? "last_visit_time DESC" : "visit_count DESC";

    const rows = db
      .prepare(
        `
      SELECT url, title, visit_count, last_visit_time
      FROM urls
      WHERE url NOT LIKE 'chrome://%'
        AND url NOT LIKE 'chrome-extension://%'
        AND url NOT LIKE 'opera://%'
        AND url NOT LIKE 'brave://%'
        AND url NOT LIKE 'edge://%'
        AND url NOT LIKE 'vivaldi://%'
        AND url NOT LIKE 'arc://%'
        AND title != ''
      ORDER BY ${orderBy}
      LIMIT ?
    `,
      )
      .all(limit * 3); // over-fetch for dedup

    return rows.map((row) => ({
      url: row.url,
      title: row.title,
      visitCount: row.visit_count,
      lastVisit: Number(BigInt(row.last_visit_time) - CHROMIUM_EPOCH_OFFSET) / 1000,
    }));
  });
}

/**
 * Read history from Firefox.
 */
function readFirefoxHistory(dbPath, { limit = 10, mode = "top" } = {}) {
  return withDbCopy(dbPath, (db) => {
    const orderBy = mode === "recent" ? "last_visit_date DESC" : "visit_count DESC";

    const rows = db
      .prepare(
        `
      SELECT p.url, p.title, p.visit_count, p.last_visit_date
      FROM moz_places p
      WHERE p.url NOT LIKE 'about:%'
        AND p.url NOT LIKE 'moz-extension://%'
        AND p.title IS NOT NULL
        AND p.title != ''
      ORDER BY ${orderBy}
      LIMIT ?
    `,
      )
      .all(limit * 3);

    return rows.map((row) => ({
      url: row.url,
      title: row.title,
      visitCount: row.visit_count,
      lastVisit: row.last_visit_date ? row.last_visit_date / 1000 : 0,
    }));
  });
}

/**
 * Read history from Safari.
 */
function readSafariHistory(dbPath, { limit = 10, mode = "top" } = {}) {
  return withDbCopy(dbPath, (db) => {
    const orderBy = mode === "recent" ? "v.visit_time DESC" : "COUNT(v.id) DESC";

    const rows = db
      .prepare(
        `
      SELECT i.url, v.title, COUNT(v.id) as visit_count,
             MAX(v.visit_time) as last_visit
      FROM history_items i
      JOIN history_visits v ON i.id = v.history_item
      WHERE i.url NOT LIKE 'about:%'
        AND v.title IS NOT NULL
        AND v.title != ''
      GROUP BY i.url
      ORDER BY ${orderBy}
      LIMIT ?
    `,
      )
      .all(limit * 3);

    // Safari epoch: seconds from 2001-01-01
    const SAFARI_EPOCH = 978307200;
    return rows.map((row) => ({
      url: row.url,
      title: row.title,
      visitCount: row.visit_count,
      lastVisit: (row.last_visit + SAFARI_EPOCH) * 1000,
    }));
  });
}

/**
 * Read history from any detected browser.
 */
export function readHistory(browserInfo, options = {}) {
  try {
    switch (browserInfo.engine) {
      case "chromium":
        return readChromiumHistory(browserInfo.path, options);
      case "firefox":
        return readFirefoxHistory(browserInfo.path, options);
      case "safari":
        return readSafariHistory(browserInfo.path, options);
      default:
        logger.warn("Unknown browser engine: %s", browserInfo.engine);
        return [];
    }
  } catch (e) {
    logger.error("Failed to read history for %s: %s", browserInfo.browser, e.message);
    return [];
  }
}
