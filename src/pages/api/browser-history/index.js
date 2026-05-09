import { getBrowserHistory } from "utils/browser-history";
import createLogger from "utils/logger";

const logger = createLogger("browserHistoryAPI");

export default async function handler(req, res) {
  try {
    const { browser = "auto", topLimit = "10", recentLimit = "10" } = req.query;

    const data = getBrowserHistory({
      browser,
      topLimit: parseInt(topLimit, 10),
      recentLimit: parseInt(recentLimit, 10),
    });

    return res.status(200).json(data);
  } catch (e) {
    logger.error("Browser history API error: %s", e.message);
    return res.status(500).json({ error: e.message });
  }
}
