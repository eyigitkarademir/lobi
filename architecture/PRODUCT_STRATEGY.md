# Lobi — Product Strategy

## Target Audience (MVP)

**Primary persona — "AI-friendly tech individual"**
- Developer / designer / productivity nerd / AI enthusiast
- Comfortable with `git clone && npm run dev`
- Already has Google account, Spotify, follows ~5 newsletters/feeds
- Wants control over their start page, but won't edit YAML files for an hour
- Has a Claude / OpenAI API key already (BYOK is fine)

**Secondary (V1) — General consumer**
- Hosted SaaS version
- No git required
- Curated widget defaults

## What we're NOT optimizing for at MVP
- Homelab users (gethomepage owns this)
- Non-technical consumers (hosted comes later)
- Multi-user households
- Mobile-first interactions

## MVP Scope (V0.1)

### IN
1. **10 widgets:** bookmarks, weather, time/greeting, search (with AI mode), RSS reader (with AI 1-line summary), Google Calendar, Gmail unread, YouTube subscriptions, Spotify recent/playing, quick-links bento (deep-link buttons for Yemeksepeti / Trendyol / Uber Eats / banks).
2. **Customization:** drag-drop on a 4-column responsive grid, widget sizes 1x1 / 2x1 / 2x2 / 4x2.
3. **4 default templates:** Minimalist, Productivity, News Junkie, Creator.
4. **Theme:** light/dark + 1 accent color picker.
5. **3 AI integrations:** onboarding chat agent, smart reordering (usage tracking), AI search.

### OUT (deferred)
- Multi-user / family
- Mobile-first redesign (responsive yes, mobile-first no)
- Plugin marketplace (SDK yes, marketplace no)
- Self-hosted service widgets (Plex/Sonarr — gethomepage's territory)
- Hosted SaaS
- Para modeli
- Browser extension
- Freeform layout (grid only at MVP)

### NOT IN SCOPE — explicit no
- Iframe-embedding other sites (X-Frame-Options blocks most consumer sites; doing this isn't possible reliably)
- Scraping data from sites without public APIs (Yemeksepeti / Trendyol "last order" — deep link only)
- Multi-user permissions / sharing

## Distribution / Go-To-Market

### Phase 1 (Months 1-3) — Open-source launch
- GitHub repo public, MIT license
- README with one-command setup
- Show HN / Product Hunt / Twitter launch
- Target: 1k stars, 100 daily-active self-host users

### Phase 2 (Months 4-9) — Community widgets
- Plugin SDK
- Discord for contributors
- 20+ community widgets
- Target: 5k stars, 500 DAU

### Phase 3 (Months 10+) — Hosted SaaS
- Free tier (5 widgets, basic)
- Pro tier (unlimited widgets, AI included, no BYOK required)

## Success Metrics (V0.1)

- 30-second from-zero-to-populated-dashboard (measure with analytics on onboarding completion)
- 70%+ of users keep dashboard active for 7+ days after install
- p50 widget render time < 300ms

## Open Questions (post-MVP)
- Plugin SDK design (sandbox? iframe? web component?)
- Hosted version pricing
- Whether to ship a browser extension that replaces new-tab page
- Mobile-first redesign timing
