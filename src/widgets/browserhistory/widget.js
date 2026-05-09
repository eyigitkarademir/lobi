const widget = {
  // No external API — reads from local filesystem via internal API
  api: "/api/browser-history?browser={browser}&topLimit={topLimit}&recentLimit={recentLimit}",
  proxyHandler: null, // Uses internal Next.js API route, not proxy
};

export default widget;
