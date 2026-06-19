# Elux Project Tracker — CLAUDE.md

## Project Overview
Internal project tracker for Elux (AI-native product design agency, Indonesia).
Live at: https://pt.eluxemang.top
Users: ~8-12 people (CEO, PM, Designer, Marketing, Intern)

## Stack
| Layer | Tech |
|---|---|
| Framework | Nuxt 4 |
| Backend | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Auth | Nuxt Auth Utils (HttpOnly cookies) |
| Hosting | Cloudflare Pages |
| UI | Nuxt UI v3 + Tailwind v4 |
| Icons | Phosphor Icons |
| ORM | Drizzle |

## Roles
- Admin — full access
- Manager (e.g. Lintang) — create epics/goals
- Member (e.g. Ahrasya) — own tasks
- Intern — view + limited

## Visual References
- Overall aesthetic: Linear
- Dashboard: Vercel Dashboard
- My Work: Superlist
- Docs: Craft.do
- Accent color: Blue `#2563EB`
- Font: Geist (Inter fallback)

## Key Design Rules
- Use `/dashboard-ui` skill when building any dashboard page
- UI must NOT look "AI-generated" — avoid generic cards, uniform padding, default Tailwind blue
- Typography aggressive — big size jumps between headings
- Data dense, not spacious — this is an internal tool
- One distinctive signature element per page

## Development Phases
- Phase 0: Documentation ✅ DONE
- Phase 1: Design Foundation (Nuxt 4 setup, Nuxt UI v3, Tailwind v4, design tokens, base layout)
- Phase 2: Frontend with dummy data
- Phase 3: Backend migration (PocketBase → Cloudflare Workers + D1)
- Phase 4: New features
- Phase 5: Polish + Deploy
- Phase 6: AI Assistant (Claude API)

## Features
Core: Dashboard · Goals · Epics (side panel) · Board/Kanban · My Work · My Day · Team Workload · Global Search · Task Detail · Docs Hub

New: Risk indicators (HIGH/MEDIUM/LOW) · Critical issues · Activity feed · Epic side panel · Changelog · Task dependencies · Templates · Time tracking

Deferred: Vendor Portal · Messaging · Gantt chart · AI Assistant

## Coding Rules
- No `perPage=1000` — server-side pagination max 50/page
- All API calls server-side only (no client-side fetching)
- RBAC enforced at both server route + UI level
- No JWT in localStorage

## Documentation
All docs in `/documentation/`:
- `blueprint.md` — full architecture
- `techstack.md` — tech decisions
- `prd.md`, `brd.md`, `frd.md` — product/business/functional requirements
- `user-story.md` — 90 stories (US-001–090)
- `roadmap.md` — phased roadmap
- `security.md` — security spec
- `design.md` — design system
- `wireframe.md` — wireframes
