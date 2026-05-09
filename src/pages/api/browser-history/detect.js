import { detectBrowsers } from "utils/browser-history/readers";
import createLogger from "utils/logger";

const logger = createLogger("browserHistoryDetect");

export default async function handler(req, res) {
  try {
    const browsers = detectBrowsers();
    return res.status(200).json({
      detected: browsers.map((b) => ({
        browser: b.browser,
        engine: b.engine,
        path: b.path,
      })),
    });
  } catch (e) {
    logger.error("Browser detect error: %s", e.message);
    return res.status(500).json({ error: e.message });
  }
}
