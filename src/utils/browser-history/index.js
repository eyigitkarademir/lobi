import cache from "memory-cache";

import createLogger from "utils/logger";

import { groupByCategory, processHistory } from "./categorizer";
import { detectBrowsers, readHistory } from "./readers";

const logger = createLogger("browserHistory");
const CACHE_KEY = "browserHistory";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get browser history data. Caches results for 5 minutes.
 *
 * @param {Object} options
 * @param {string} options.browser - Specific browser to read from, or "auto" for all detected
 * @param {number} options.topLimit - Number of top sites to return
 * @param {number} options.recentLimit - Number of recent sites to return
 * @returns {{ browsers, topSites, recentSites, categorized }}
 */
export function getBrowserHistory({ browser = "auto", topLimit = 10, recentLimit = 10 } = {}) {
  const cacheKey = `${CACHE_KEY}_${browser}_${topLimit}_${recentLimit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const browsers = detectBrowsers();

  if (browsers.length === 0) {
    logger.warn("No browsers detected");
    return { browsers: [], topSites: [], recentSites: [], categorized: {} };
  }

  // Filter to specific browser if requested
  const targets = browser === "auto" ? browsers : browsers.filter((b) => b.browser === browser);

  if (targets.length === 0) {
    logger.warn("Browser '%s' not found. Available: %s", browser, browsers.map((b) => b.browser).join(", "));
    return { browsers: browsers.map((b) => b.browser), topSites: [], recentSites: [], categorized: {} };
  }

  // Merge history from all target browsers
  let allTopEntries = [];
  let allRecentEntries = [];

  for (const target of targets) {
    const topEntries = readHistory(target, { limit: topLimit, mode: "top" });
    const recentEntries = readHistory(target, { limit: recentLimit, mode: "recent" });
    allTopEntries = allTopEntries.concat(topEntries);
    allRecentEntries = allRecentEntries.concat(recentEntries);
  }

  const topSites = processHistory(allTopEntries, { limit: topLimit, mode: "top" });
  const recentSites = processHistory(allRecentEntries, { limit: recentLimit, mode: "recent" });
  const categorized = groupByCategory(topSites);

  const result = {
    browsers: browsers.map((b) => b.browser),
    topSites,
    recentSites,
    categorized,
  };

  cache.put(cacheKey, result, CACHE_TTL);
  return result;
}
