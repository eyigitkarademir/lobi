import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

import Container from "components/services/widget/container";

function TimeAgo({ timestamp }) {
  const { t } = useTranslation();
  if (!timestamp) return null;

  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return <span>{t("common.relativeDate", { value: new Date(timestamp) })}</span>;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return <span>{minutes}m ago</span>;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return <span>{hours}h ago</span>;

  const days = Math.floor(hours / 24);
  return <span>{days}d ago</span>;
}

export default function Component({ service }) {
  const { widget } = service;
  const {
    browser = "auto",
    topLimit = 8,
    recentLimit = 6,
    display = "top",
    refreshInterval = 300000,
  } = widget;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(
          `/api/browser-history?browser=${browser}&topLimit=${topLimit}&recentLimit=${recentLimit}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (e) {
        setError({ message: e.message });
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, Math.max(60000, refreshInterval));
    return () => clearInterval(interval);
  }, [browser, topLimit, recentLimit, refreshInterval]);

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <div className="flex flex-col w-full">
          <div className="bg-theme-200/50 dark:bg-theme-900/20 rounded-sm m-1 flex-1 flex flex-row items-center justify-between p-1 text-xs animate-pulse">
            <div className="font-thin pl-2">Loading browser history...</div>
          </div>
        </div>
      </Container>
    );
  }

  const sites = display === "recent" ? data.recentSites : data.topSites;

  if (!sites || sites.length === 0) {
    return (
      <Container service={service}>
        <div className="flex flex-col w-full">
          <div className="bg-theme-200/50 dark:bg-theme-900/20 rounded-sm m-1 flex-1 flex flex-row items-center justify-between p-1 text-xs">
            <div className="font-thin pl-2">No history found</div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container service={service}>
      <div className="flex flex-col w-full">
        {sites.map((site) => (
          <a
            key={site.domain}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-theme-200/50 dark:bg-theme-900/20 hover:bg-theme-300/50 dark:hover:bg-theme-800/20 rounded-sm m-1 flex-1 flex flex-row items-center justify-between p-1 text-xs transition-colors"
          >
            <div className="font-thin pl-2 truncate flex-1">{site.title}</div>
            <div className="flex flex-row text-right gap-2 mr-2">
              {display !== "recent" && (
                <div className="font-bold text-theme-500">{site.visitCount.toLocaleString()}</div>
              )}
              <div className="text-theme-400 text-[10px]">
                <TimeAgo timestamp={site.lastVisit} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </Container>
  );
}
