/**
 * Categorizes URLs into meaningful groups and extracts domain info.
 */

// Domain → category mapping (order matters — first match wins)
const CATEGORY_RULES = [
  // Dev tools
  { pattern: /github\.com/, category: "Development", name: "GitHub", icon: "mdi-github" },
  { pattern: /gitlab\.com/, category: "Development", name: "GitLab", icon: "mdi-gitlab" },
  { pattern: /stackoverflow\.com/, category: "Development", name: "Stack Overflow", icon: "mdi-stack-overflow" },
  { pattern: /npmjs\.com/, category: "Development", name: "npm", icon: "mdi-npm" },
  { pattern: /developer\.mozilla\.org/, category: "Development", name: "MDN", icon: "mdi-language-javascript" },
  { pattern: /vercel\.com/, category: "Development", name: "Vercel", icon: "mdi-triangle" },
  { pattern: /netlify\.com/, category: "Development", name: "Netlify", icon: "mdi-web" },
  { pattern: /docker\.com|hub\.docker/, category: "Development", name: "Docker", icon: "mdi-docker" },
  { pattern: /codepen\.io/, category: "Development", name: "CodePen", icon: "mdi-codepen" },
  { pattern: /codesandbox\.io/, category: "Development", name: "CodeSandbox", icon: "mdi-code-tags" },
  { pattern: /jsfiddle\.net/, category: "Development", name: "JSFiddle", icon: "mdi-code-tags" },
  { pattern: /bitbucket\.org/, category: "Development", name: "Bitbucket", icon: "mdi-bitbucket" },
  { pattern: /linear\.app/, category: "Development", name: "Linear", icon: "mdi-clipboard-check-outline" },
  { pattern: /jira\./, category: "Development", name: "Jira", icon: "mdi-jira" },
  { pattern: /notion\.so/, category: "Productivity", name: "Notion", icon: "mdi-note-text" },
  { pattern: /figma\.com/, category: "Development", name: "Figma", icon: "mdi-pencil-ruler" },

  // AI
  { pattern: /claude\.ai/, category: "AI", name: "Claude", icon: "mdi-chat-outline" },
  { pattern: /chat\.openai\.com|chatgpt\.com/, category: "AI", name: "ChatGPT", icon: "mdi-robot" },
  { pattern: /bard\.google|gemini\.google/, category: "AI", name: "Gemini", icon: "mdi-google" },
  { pattern: /perplexity\.ai/, category: "AI", name: "Perplexity", icon: "mdi-magnify" },
  { pattern: /huggingface\.co/, category: "AI", name: "Hugging Face", icon: "mdi-robot-outline" },
  { pattern: /midjourney\.com/, category: "AI", name: "Midjourney", icon: "mdi-image" },

  // Social
  { pattern: /twitter\.com|x\.com/, category: "Social", name: "X / Twitter", icon: "mdi-twitter" },
  { pattern: /reddit\.com/, category: "Social", name: "Reddit", icon: "mdi-reddit" },
  { pattern: /instagram\.com/, category: "Social", name: "Instagram", icon: "mdi-instagram" },
  { pattern: /facebook\.com/, category: "Social", name: "Facebook", icon: "mdi-facebook" },
  { pattern: /linkedin\.com/, category: "Social", name: "LinkedIn", icon: "mdi-linkedin" },
  { pattern: /tiktok\.com/, category: "Social", name: "TikTok", icon: "mdi-music-note" },
  { pattern: /discord\.com|discord\.gg/, category: "Social", name: "Discord", icon: "mdi-chat" },
  { pattern: /slack\.com/, category: "Social", name: "Slack", icon: "mdi-slack" },
  { pattern: /telegram\.org|web\.telegram/, category: "Social", name: "Telegram", icon: "mdi-send" },
  { pattern: /mastodon\./, category: "Social", name: "Mastodon", icon: "mdi-mastodon" },

  // Communication
  { pattern: /mail\.google\.com|gmail\.com/, category: "Communication", name: "Gmail", icon: "mdi-gmail" },
  { pattern: /outlook\.live|outlook\.office/, category: "Communication", name: "Outlook", icon: "mdi-microsoft-outlook" },
  { pattern: /meet\.google\.com/, category: "Communication", name: "Google Meet", icon: "mdi-video" },
  { pattern: /zoom\.us/, category: "Communication", name: "Zoom", icon: "mdi-video-box" },
  { pattern: /teams\.microsoft/, category: "Communication", name: "Teams", icon: "mdi-microsoft-teams" },
  { pattern: /calendar\.google/, category: "Communication", name: "Google Calendar", icon: "mdi-calendar" },

  // Entertainment
  { pattern: /youtube\.com|youtu\.be/, category: "Entertainment", name: "YouTube", icon: "mdi-youtube" },
  { pattern: /netflix\.com/, category: "Entertainment", name: "Netflix", icon: "mdi-netflix" },
  { pattern: /twitch\.tv/, category: "Entertainment", name: "Twitch", icon: "mdi-twitch" },
  { pattern: /spotify\.com/, category: "Entertainment", name: "Spotify", icon: "mdi-spotify" },
  { pattern: /soundcloud\.com/, category: "Entertainment", name: "SoundCloud", icon: "mdi-soundcloud" },

  // Search & Reference
  { pattern: /google\.com\/search|google\.\w+\/search/, category: "Search", name: "Google", icon: "mdi-google" },
  { pattern: /duckduckgo\.com/, category: "Search", name: "DuckDuckGo", icon: "mdi-duck" },
  { pattern: /bing\.com/, category: "Search", name: "Bing", icon: "mdi-microsoft-bing" },
  { pattern: /wikipedia\.org/, category: "Search", name: "Wikipedia", icon: "mdi-wikipedia" },

  // Shopping
  { pattern: /amazon\./, category: "Shopping", name: "Amazon", icon: "mdi-cart" },
  { pattern: /ebay\./, category: "Shopping", name: "eBay", icon: "mdi-cart-outline" },

  // Cloud & Productivity
  { pattern: /docs\.google\.com/, category: "Productivity", name: "Google Docs", icon: "mdi-file-document" },
  { pattern: /drive\.google\.com/, category: "Productivity", name: "Google Drive", icon: "mdi-google-drive" },
  { pattern: /dropbox\.com/, category: "Productivity", name: "Dropbox", icon: "mdi-dropbox" },
  { pattern: /trello\.com/, category: "Productivity", name: "Trello", icon: "mdi-trello" },
];

/**
 * Extract domain from URL.
 */
export function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Categorize a URL using the rules table.
 * Returns { category, name, icon } or null if no match.
 */
export function categorizeUrl(url) {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(url)) {
      return { category: rule.category, name: rule.name, icon: rule.icon };
    }
  }
  return null;
}

/**
 * Generate a human-readable abbreviation for a domain.
 */
export function domainAbbr(domain) {
  // Remove TLD, take first two chars and uppercase
  const parts = domain.split(".");
  const name = parts.length > 1 ? parts[parts.length - 2] : parts[0];
  return name.slice(0, 2).toUpperCase();
}

/**
 * Process raw history entries into deduplicated, categorized sites.
 * Groups by domain, picks best title, sums visit counts.
 */
export function processHistory(entries, { limit = 10, mode = "top" } = {}) {
  const domainMap = new Map();

  for (const entry of entries) {
    const domain = extractDomain(entry.url);
    if (!domain || domain === "localhost" || /^(127\.|192\.168\.|10\.)/.test(domain)) continue;

    const existing = domainMap.get(domain);
    if (existing) {
      existing.visitCount += entry.visitCount;
      if (entry.lastVisit > existing.lastVisit) {
        existing.lastVisit = entry.lastVisit;
        // Prefer shorter, cleaner titles
        if (entry.title.length < existing.title.length && entry.title.length > 0) {
          existing.title = entry.title;
        }
      }
    } else {
      const cat = categorizeUrl(entry.url);
      domainMap.set(domain, {
        domain,
        url: `https://${domain}/`,
        title: cat?.name || entry.title,
        visitCount: entry.visitCount,
        lastVisit: entry.lastVisit,
        category: cat?.category || "Other",
        icon: cat?.icon || "mdi-web",
        abbr: cat ? cat.name.slice(0, 2).toUpperCase() : domainAbbr(domain),
      });
    }
  }

  const sites = Array.from(domainMap.values());

  if (mode === "recent") {
    sites.sort((a, b) => b.lastVisit - a.lastVisit);
  } else {
    sites.sort((a, b) => b.visitCount - a.visitCount);
  }

  return sites.slice(0, limit);
}

/**
 * Group processed sites by category.
 */
export function groupByCategory(sites) {
  const groups = {};
  for (const site of sites) {
    if (!groups[site.category]) groups[site.category] = [];
    groups[site.category].push(site);
  }
  return groups;
}
