# Lobi — Vision

## One-liner
A self-hostable, AI-powered personal start page. Replaces your browser's blank new-tab with a widget dashboard you build by *talking to it*, not by editing YAML.

## The opportunity
gethomepage (~30k stars) proved there's appetite for a personal dashboard, but they own the **homelab niche**: 180+ self-hosted service widgets (Plex, Sonarr, Pi-hole, Proxmox), YAML-only config, no AI, no consumer services, no onboarding.

The **blue ocean** they ignored:
- Consumer services (YouTube, Gmail, Calendar, Spotify, news content, social feeds)
- AI-driven onboarding ("Sabah ne yaparsın?" → populated dashboard in 30 seconds)
- Mobile-aware daily-use design
- Content rendering instead of just status counts (read the article, don't just see "5 unread")
- Chat-driven config instead of YAML

## What Lobi is
Open-source, MIT/AGPL. Users `git clone`, run on localhost, set it as their browser homepage. Their own machine, their own data, their own API keys (BYOK for the AI features). Hosted version comes later for non-technical users.

## What Lobi is NOT
- Not a homelab tool — we don't try to compete on Plex/Sonarr widgets.
- Not an iframe-based "internet inside the browser" — embedding sites doesn't work (X-Frame-Options blocks Google/YouTube/banks/most consumer sites). We render data via APIs, deep-link out where APIs don't exist.
- Not a multi-user SaaS at MVP — single user per install. Hosted multi-user comes later.
- Not a content scraper — we use official APIs only. Where there's no API (food delivery, e-commerce), we surface the brand and deep-link out.

## Differentiation vs gethomepage

| | gethomepage | Lobi |
|---|---|---|
| Audience | Homelab/sysadmin | Tech-savvy individual → general consumer |
| Config | YAML files | Chat with AI |
| Onboarding | Empty config | Conversational setup, populated in 30s |
| Widgets | 180+ self-hosted services | 10 consumer-first to start (YouTube, Gmail, Cal, Spotify, RSS, weather, time, search, bookmarks, deep-link bento) |
| AI | None | Onboarding + smart reordering + AI search |
| Data shown | Status counts | Actual content (titles, subjects, summaries) |
| Mobile | Responsive afterthought | Mobile-aware (V2 mobile-first) |
| Personalization | Static config | Usage tracking + time-of-day surfacing |

## V0.1 promise
A user clones the repo, runs `npm run dev`, opens localhost:3010, has a 30-second AI conversation, and ends up with a populated dashboard showing their own Google Calendar today, their unread Gmail, their YouTube subscription feed, Spotify recently-played, weather, and the news/RSS feeds they actually read. They drag widgets to rearrange. They can set this as their browser homepage.

## V1 (post-MVP)
- Widget plugin SDK (community widgets without forking)
- Hosted SaaS for non-technical users
- Multi-user / family
- Mobile-first redesign
- Browser extension (replace new-tab page)
- Smart suggestions ("you opened Gmail 12 times this week — pin it bigger?")
