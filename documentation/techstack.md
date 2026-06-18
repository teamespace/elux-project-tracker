# Elux Project Tracker — Tech Stack Reference

**Version:** 1.0  
**Last Updated:** 2026-06-17  
**Status:** Pre-development reference  
**Audience:** Senior engineers, contributors, tech leads

---

## Table of Contents

1. [Stack at a Glance](#1-stack-at-a-glance)
2. [Framework: Nuxt 4](#2-framework-nuxt-4)
3. [Hosting and Runtime: Cloudflare Pages + Workers](#3-hosting-and-runtime-cloudflare-pages--workers)
4. [Database: Cloudflare D1](#4-database-cloudflare-d1)
5. [UI Library: Nuxt UI v3](#5-ui-library-nuxt-ui-v3)
6. [Styling: Tailwind CSS v4](#6-styling-tailwind-css-v4)
7. [Icons: Phosphor Icons](#7-icons-phosphor-icons)
8. [Auth: Nuxt Auth Utils](#8-auth-nuxt-auth-utils)
9. [ORM: Drizzle ORM](#9-orm-drizzle-orm)
10. [AI: Anthropic Claude API](#10-ai-anthropic-claude-api)
11. [Development Tooling](#11-development-tooling)
12. [Migration Path from Next.js + PocketBase](#12-migration-path-from-nextjs--pocketbase)

---

## 1. Stack at a Glance

| Layer | Technology | Version |
|---|---|---|
| Framework | Nuxt 4 | 4.x (RC as of 2026) |
| Runtime | Cloudflare Workers (V8 isolates) | — |
| Hosting | Cloudflare Pages | — |
| Database | Cloudflare D1 (SQLite) | — |
| ORM | Drizzle ORM | ^0.36 |
| UI Library | Nuxt UI v3 | ^3.x |
| CSS | Tailwind CSS v4 | ^4.x |
| Icons | Phosphor Icons (vue-phosphor-icons) | ^2.x |
| Auth | Nuxt Auth Utils | ^0.5 |
| Language | TypeScript | ^5.5 |
| Linting | ESLint + @nuxt/eslint | ^9.x flat config |
| Testing | Vitest | ^2.x |
| AI | Anthropic SDK (@anthropic-ai/sdk) | ^0.32 |
| Dev Platform | NuxtHub (local D1 + deploy) | ^0.8 |

---

## 2. Framework: Nuxt 4

**Version:** 4.x (targets compatibility version 4, currently in RC; stable expected mid-2026)  
**Repository:** https://github.com/nuxt/nuxt  
**Docs:** https://nuxt.com

### What It Is

Nuxt 4 is a full-stack Vue framework with a built-in server engine (Nitro). It provides SSR, SSG, and hybrid rendering out of the box. Server routes under `/server/api/` run as Nitro handlers and compile to Cloudflare Workers when using the `cloudflare-pages` preset.

### Why Nuxt 4 Over Alternatives

**Nuxt 4 vs Nuxt 3**

Nuxt 4 introduces a restructured directory layout (the `app/` folder convention), a cleaner module system, improved TypeScript inference across composables, and a compatibility-version flag that makes the migration from 3 to 4 incremental. The `future: { compatibilityVersion: 4 }` flag in `nuxt.config.ts` allows adopting Nuxt 4 behavior in a Nuxt 3 project today, reducing risk.

Key Nuxt 4 changes that matter for this project:
- Unified `app/` directory replaces the flat root structure, reducing import ambiguity
- `useAsyncData` and `useFetch` have improved deduplication and key collision prevention
- Server route auto-imports are more consistent
- Nitro v2 improvements: smaller bundles, faster cold starts on Workers

**Nuxt 4 vs Next.js 15 (current stack)**

| Concern | Next.js 15 (current) | Nuxt 4 |
|---|---|---|
| Language | React (JSX/TSX) | Vue 3 (SFCs) |
| Server routes | Route Handlers (`app/api/`) | Nitro (`/server/api/`) |
| Cloudflare Workers support | Unofficial, fragile | First-class via Nitro preset |
| D1 binding | Manual adapter required | Built into NuxtHub |
| Auth | Various libs, no cookie standard | Nuxt Auth Utils (HttpOnly by default) |
| Data fetching | `fetch` in Server Components | `useFetch` / `useAsyncData` |
| Team familiarity at Elux | Low (pain point) | Vue/Nuxt preferred |

The current Next.js implementation has documented 404 issues on dynamic routes and a 503 antipattern caused by unlimited client-side fetching. These are not fundamental React/Next problems, but the team preference for Vue and the superior Cloudflare integration in Nuxt makes a full rewrite the right call.

### Nuxt 4 Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  ssr: true,

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts'
  ],

  hub: {
    database: true
  },

  typescript: {
    strict: true
  }
})
```

### File Structure (Nuxt 4 layout)

```
/
├── app/
│   ├── components/         Vue components
│   ├── composables/        useX composables
│   ├── layouts/            default.vue, auth.vue
│   ├── middleware/         auth.ts, role.ts
│   ├── pages/              file-system routing
│   │   ├── index.vue       Dashboard
│   │   ├── goals/
│   │   ├── epics/[id].vue
│   │   ├── tasks/[id].vue
│   │   └── ...
│   ├── plugins/            client/server plugins
│   └── app.vue
├── server/
│   ├── api/                Nitro route handlers
│   ├── routes/             non-API server routes
│   ├── middleware/         server middleware
│   ├── utils/              auth helpers, db client
│   └── database/
│       ├── schema.ts       Drizzle schema
│       └── migrations/
├── public/                 static assets
├── nuxt.config.ts
├── drizzle.config.ts
└── package.json
```

---

## 3. Hosting and Runtime: Cloudflare Pages + Workers

**Cloudflare Pages:** https://pages.cloudflare.com  
**Cloudflare Workers:** https://workers.cloudflare.com

### What It Is

Cloudflare Pages builds and hosts the Nuxt application. Static assets (JS bundles, CSS, images) are served from Cloudflare's CDN (~300 PoPs). Server-side rendering and API routes run as Cloudflare Workers — V8 isolate-based edge runtime functions with cold start times under 5ms.

### Why Cloudflare Over Alternatives

**Cloudflare Pages + Workers vs Vercel + Supabase**

| Concern | Vercel + Supabase | Cloudflare Pages + D1 |
|---|---|---|
| Pricing | Vercel Pro ~$20/mo; Supabase Pro $25/mo | Pages free tier covers internal tools |
| Latency | Vercel Edge + Supabase in one region | Workers + D1 co-located at same PoP |
| Cold start | ~100ms (Vercel Edge) | <5ms (Workers V8 isolate) |
| Vendor lock-in | Two vendors, two billing cycles | One platform, one dashboard |
| D1 / SQLite support | Not applicable | Native, no adapter needed |
| Indonesia latency | Supabase nearest region: Singapore | Cloudflare PoP in Jakarta |

For an internal tool used by an Indonesian team, Cloudflare's Jakarta PoP provides measurably lower latency than routing to Singapore and back.

**Cloudflare Pages + Workers vs Keeping PocketBase**

PocketBase is a single Go binary that handles auth, database, and file storage. It worked for the prototype but introduced the core issues being fixed:

- PocketBase's JS SDK fetches directly from the browser, bypassing any server-side RBAC enforcement
- The `perPage=1000` pattern is a consequence of PocketBase's client SDK not having a good server-side pagination story in the original implementation
- PocketBase has no native Cloudflare integration; it requires a VPS, adding ops overhead
- Migrating off PocketBase means full control over the data model and query patterns

The rewrite addresses all of these by moving all database access behind Nuxt server routes.

### Workers Runtime Constraints

Workers run in a V8 isolate, not Node.js. This means:

- No `fs`, `path`, or other Node.js core modules unless using `nodeCompat: true`
- `nodeCompat: true` is set in `nuxt.config.ts` to allow packages that use Node.js primitives (like `bcrypt`)
- CPU time per request: 50ms on the free plan, 30 seconds on the paid plan
- Memory: 128MB per isolate
- No background jobs (use Cloudflare Workers Cron for scheduled tasks if needed)

---

## 4. Database: Cloudflare D1

**Type:** SQLite, edge-distributed  
**Docs:** https://developers.cloudflare.com/d1/

### What It Is

D1 is Cloudflare's serverless SQLite offering. The database is stored on Cloudflare's infrastructure and replicated to serve reads from the Worker closest to the user. Writes go to a single primary region; reads can be served from the nearest replica.

### Why D1 Over Alternatives

**D1 vs Supabase (PostgreSQL)**

| Concern | Supabase | D1 |
|---|---|---|
| SQL dialect | PostgreSQL | SQLite |
| Latency from Worker | ~10–50ms (network hop) | ~1–5ms (same infrastructure) |
| Auth integration | Built-in (Supabase Auth) | Handled by Nuxt Auth Utils |
| Real-time | Built-in (Postgres CDC) | Not native (polling) |
| Migrations | Supabase CLI | Drizzle Kit + wrangler |
| Price | $25/mo for paid tier | Included in Workers paid plan |

For an internal tool without real-time requirements, D1's latency advantage and pricing are the deciding factors.

**D1 vs PlanetScale (MySQL)**

PlanetScale moved to a paid-only model in 2024. D1 has a generous free tier. PlanetScale also adds a network hop from Worker to MySQL, whereas D1 runs on the same network.

**D1 vs Turso (libSQL)**

Turso is a compelling alternative — libSQL (a SQLite fork) with edge replication and a good Drizzle integration. D1 wins here because it's the same platform as Pages and Workers, requiring zero additional vendors.

### D1 Limitations to Plan Around

- **Max database size:** 10GB (more than sufficient for an internal tool)
- **Max row size:** 1MB
- **Concurrent writes:** D1 is not optimized for high write concurrency. For an internal tool with < 50 concurrent users, this is not an issue.
- **No JSON columns:** JSON stored as TEXT, queried via `json_extract()` or Drizzle's `sql` helper. Labels and metadata fields use this pattern.
- **No native arrays:** Arrays stored as JSON TEXT.
- **No full-text search:** Global search uses LIKE queries with indexes. Full-text can be added via SQLite FTS5 extension if needed.

### D1 Binding in Workers

```typescript
// server/utils/db.ts
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

export function useDB() {
  const { cloudflare } = useNitroApp()
  return drizzle(cloudflare.env.DB, { schema })
}
```

The `DB` binding name maps to the D1 database configured in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "elux-tracker-prod"
database_id = "<uuid>"
```

---

## 5. UI Library: Nuxt UI v3

**Version:** ^3.x  
**Repository:** https://github.com/nuxt/ui  
**Docs:** https://ui.nuxt.com

### What It Is

Nuxt UI v3 is the official Nuxt component library. Built on top of Radix Vue (headless primitives), Tailwind CSS v4, and Reka UI, it provides accessible, composable components: Button, Input, Select, Modal, Table, Tabs, Dropdown, Badge, Tooltip, Toast, Command Palette, and more.

### Why Nuxt UI v3 Over Alternatives

**Nuxt UI v3 vs shadcn-vue**

shadcn-vue copies components into your project (no package dependency), which is excellent for full control. The tradeoff: every component update requires manual patching. For a team-internal tool where consistency over customization matters, a maintained package dependency is preferable. Nuxt UI v3 also integrates directly with Nuxt's auto-import system — components are globally available without import statements.

**Nuxt UI v3 vs PrimeVue**

PrimeVue is feature-complete but ships a large bundle and historically required the PrimeFlex or PrimeTailwind package alongside PrimeVue itself. Styling overrides are verbose. Nuxt UI v3's Tailwind-first approach means every component is styled with utility classes that the team already knows.

**Nuxt UI v3 vs Radix Vue (raw)**

Using raw Radix Vue gives maximum control but requires writing all styling from scratch. That's appropriate for a design system project, not a project management tool with a small team. Nuxt UI v3 sits on top of Radix Vue — it inherits the accessibility primitives without requiring the team to implement them.

### Key Components in Use

| Feature | Component |
|---|---|
| Navigation | `UVerticalNavigation`, `UCommandPalette` (global search) |
| Data display | `UTable`, `UCard`, `UBadge` |
| Forms | `UForm`, `UFormGroup`, `UInput`, `UTextarea`, `USelect`, `UDatePicker` |
| Overlays | `UModal`, `USlideover`, `UTooltip` |
| Feedback | `UToast`, `UAlert`, `UProgress` |
| Layout | `UContainer`, `UDivider`, `USkeleton` |

### Theming

Nuxt UI v3 uses a CSS variable token system. The design tokens are defined in `app.config.ts`:

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'violet',
    gray: 'slate',
    // Component-level overrides
    button: {
      rounded: 'rounded-lg'
    }
  }
})
```

---

## 6. Styling: Tailwind CSS v4

**Version:** ^4.x  
**Docs:** https://tailwindcss.com

### What Changed in v4

Tailwind CSS v4 drops the `tailwind.config.js` file in favor of CSS-based configuration using `@theme` directives. Configuration lives directly in CSS:

```css
/* app/assets/css/main.css */
@import "tailwindcss";

@theme {
  --color-brand: #7c3aed;
  --font-sans: "Inter", sans-serif;
  --radius-card: 12px;
}
```

Key v4 changes:
- Zero-config: Tailwind scans files automatically, no `content` array needed
- CSS `@import` replaces `@tailwind base/components/utilities` directives
- Custom properties become first-class: `text-(--color-brand)` works natively
- Faster build: Rust-based engine (Lightning CSS) replaces PostCSS pipeline
- Nuxt UI v3 is built for Tailwind v4 — there is no supported downgrade path

### v4 vs v3 for This Project

Nuxt UI v3 requires Tailwind CSS v4. There is no choice to make; they are a paired dependency. The performance improvement (build times 5–10x faster) and the CSS-native configuration are welcome side effects.

---

## 7. Icons: Phosphor Icons

**Package:** `vue-phosphor-icons` or via Nuxt Icon module  
**Version:** ^2.x  
**Website:** https://phosphoricons.com  
**Repository:** https://github.com/phosphor-icons/vue

### What It Is

Phosphor Icons is a flexible icon family available in six weights: Thin, Light, Regular, Bold, Fill, and Duotone. The Vue package provides each icon as a named Vue component.

### Why Phosphor Over Alternatives

**Phosphor vs Lucide Icons**

Lucide is the default choice for many Tailwind/shadcn setups. It's a solid library, but every icon has exactly one weight. Phosphor's weight system allows semantic use: Fill weight for active/selected states, Regular for default, Thin for decorative. This matters for a dense UI like a project tracker where indicating state through icon weight is a useful affordance.

**Phosphor vs Heroicons**

Heroicons (the Tailwind team's library) has 292 icons. Phosphor has over 1,300. For a tool with entities like tasks, subtasks, epics, goals, docs, time, dependencies, and comments, coverage matters.

**Phosphor vs Simple Icons**

Simple Icons is specifically for brand logos (GitHub, Slack, etc.). Not applicable for UI icons.

### Usage Pattern

With Nuxt Icon module:

```vue
<template>
  <!-- Regular weight -->
  <Icon name="ph:check-circle" class="w-5 h-5" />

  <!-- Fill weight (selected state) -->
  <Icon name="ph:check-circle-fill" class="w-5 h-5 text-green-500" />
</template>
```

Common mappings for this project:

| Entity/Action | Icon |
|---|---|
| Task | `ph:check-square` |
| Epic | `ph:stack` |
| Goal | `ph:flag` |
| Comment | `ph:chat-circle` |
| Time entry | `ph:clock` |
| Dependency | `ph:link` |
| Blocked status | `ph:prohibit` |
| Kanban board | `ph:kanban` |
| Docs | `ph:file-text` |
| Activity | `ph:activity` |
| Team | `ph:users-three` |
| AI assistant | `ph:robot` |

---

## 8. Auth: Nuxt Auth Utils

**Package:** `nuxt-auth-utils`  
**Version:** ^0.5  
**Repository:** https://github.com/Atinux/nuxt-auth-utils  
**Author:** Sébastien Chopin (Nuxt core team)

### What It Is

Nuxt Auth Utils provides a minimal, secure session management layer built on top of `h3`'s cookie handling. It uses the `iron-session` library (AES-256-CBC + HMAC-SHA256) to seal session data into a signed cookie. The cookie is HttpOnly, preventing JavaScript access.

### Why Nuxt Auth Utils

The current implementation stores a JWT in `localStorage`. This is a well-documented XSS risk: any JavaScript running on the page (including injected third-party scripts) can read `localStorage`. HttpOnly cookies cannot be read by JavaScript regardless of XSS.

| Concern | JWT in localStorage (current) | Nuxt Auth Utils (HttpOnly cookie) |
|---|---|---|
| XSS resistance | Vulnerable | Resistant (JS cannot read cookie) |
| CSRF resistance | Resistant (no auto-send) | Needs `SameSite=Lax` (set by default) |
| Server-side invalidation | Requires token blacklist | Clear cookie on server |
| Framework integration | Manual | Built-in composables |
| Setup complexity | Medium | Low |

**Why not NextAuth / Auth.js?**

Auth.js (formerly NextAuth) is excellent but designed for Next.js. Its Nuxt port exists but is not first-class. Nuxt Auth Utils is authored by a Nuxt core team member and designed specifically for Nuxt's `h3` event system.

**Why not Lucia Auth?**

Lucia v3 removed its framework adapters and became a general auth guide rather than a library. Nuxt Auth Utils is actively maintained and production-ready for 2026.

### Core API

```typescript
// Server-side (in /server/api/ handlers)
import { getUserSession, setUserSession, clearUserSession } from '#auth-utils'

// Set session on login
await setUserSession(event, {
  user: { id, email, name, role }
})

// Read session (returns null if not set)
const session = await getUserSession(event)

// Clear on logout
await clearUserSession(event)
```

```typescript
// Client-side (in Vue components)
const { loggedIn, user, session, clear } = useUserSession()
```

### Environment Variable Required

```bash
NUXT_SESSION_PASSWORD="minimum-32-character-random-string-here"
```

This key signs and seals the session cookie. Rotating it invalidates all existing sessions.

---

## 9. ORM: Drizzle ORM

**Package:** `drizzle-orm`, `drizzle-kit`  
**Version:** drizzle-orm ^0.36, drizzle-kit ^0.28  
**Repository:** https://github.com/drizzle-team/drizzle-orm  
**Docs:** https://orm.drizzle.team

### What It Is

Drizzle ORM is a TypeScript-first SQL ORM that generates zero-runtime overhead queries. It provides a query builder API that maps directly to SQL and a schema definition system that serves as the single source of truth for TypeScript types and database migrations.

### Why Drizzle Over Alternatives

**Drizzle vs Native D1 Client**

The native D1 client exposes a raw `prepare().bind().all()` API. There is no query builder, no type inference, and no migration tooling. Every query is a hand-written SQL string. Drizzle adds:
- Full TypeScript type inference from schema to query results
- Type-safe WHERE/JOIN/ORDER clauses
- `drizzle-kit` for migration generation and diffing
- No extra runtime cost — queries compile to the same SQL

**Drizzle vs Prisma**

Prisma is the dominant Node.js ORM, but it requires a Prisma engine binary that cannot run in Cloudflare Workers. The Workers runtime is V8-only and has no subprocess or native addon support. Prisma's Accelerate product adds a proxy layer to work around this, but that introduces latency and another paid service. Drizzle compiles to pure JavaScript and runs natively in Workers with no adapters.

**Drizzle vs Kysely**

Kysely is a strong alternative — type-safe SQL query builder with D1 support. Drizzle wins on migration tooling (`drizzle-kit generate` + `drizzle-kit push` is a complete workflow) and schema-to-type inference that Kysely lacks for table definitions.

### Schema Definition Example

```typescript
// server/database/schema.ts
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  epicId: text('epic_id').notNull().references(() => epics.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  status: text('status', {
    enum: ['todo', 'in_progress', 'review', 'done', 'blocked']
  }).notNull().default('todo'),
  priority: text('priority', {
    enum: ['low', 'medium', 'high', 'critical']
  }).notNull().default('medium'),
  assigneeId: text('assignee_id').references(() => users.id),
  createdBy: text('created_by').notNull().references(() => users.id),
  dueDate: text('due_date'),
  estimatedHours: real('estimated_hours'),
  labels: text('labels').default('[]'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
}, (table) => ({
  epicIdIdx: index('idx_tasks_epic_id').on(table.epicId),
  assigneeIdx: index('idx_tasks_assignee_id').on(table.assigneeId),
  statusIdx: index('idx_tasks_status').on(table.status)
}))
```

### Query Example

```typescript
// Paginated task list with assignee name
const taskList = await db
  .select({
    id: tasks.id,
    title: tasks.title,
    status: tasks.status,
    priority: tasks.priority,
    dueDate: tasks.dueDate,
    assigneeName: users.name
  })
  .from(tasks)
  .leftJoin(users, eq(tasks.assigneeId, users.id))
  .where(and(
    eq(tasks.epicId, epicId),
    status ? eq(tasks.status, status) : undefined
  ))
  .orderBy(desc(tasks.createdAt))
  .limit(limit)
  .offset((page - 1) * limit)
```

### Migration Workflow

```bash
# Generate migration from schema changes
npx drizzle-kit generate --dialect=sqlite

# Apply locally
npx wrangler d1 execute elux-tracker --local --file ./drizzle/migrations/0001_init.sql

# Apply to production
npx wrangler d1 execute elux-tracker --file ./drizzle/migrations/0001_init.sql
```

### Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!
  }
})
```

---

## 10. AI: Anthropic Claude API

**Package:** `@anthropic-ai/sdk`  
**Version:** ^0.32  
**Docs:** https://docs.anthropic.com/en/api  
**Priority:** Last — implemented after core features are stable

### What It Is

The Anthropic SDK is the official Node.js/TypeScript client for the Claude API. It supports streaming, tool use, and all model variants. Used exclusively on the server side in `/server/api/ai/`.

### Model Selection

| Model | Use Case | Context Window |
|---|---|---|
| `claude-opus-4-5` | Deep analysis, changelog generation | 200K tokens |
| `claude-haiku-3-5` | Quick replies, status summaries | 200K tokens |

Default: `claude-haiku-3-5` for the assistant panel (fast, cheap). `claude-opus-4-5` reserved for explicit "deep analyze" actions in the AI panel if implemented.

### Why Claude Over OpenAI GPT-4

Elux is an AI-native agency with existing Anthropic familiarity. Using the tool internally that the team recommends to clients is a coherent choice. Technically, Claude's instruction-following quality and structured output reliability are comparable or better for the summarization and triage use cases in this tool.

### Integration Pattern

The AI assistant is server-side only. The API key never reaches the browser. Streaming is handled via Server-Sent Events:

```typescript
// server/api/ai/chat.post.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()  // reads ANTHROPIC_API_KEY from env

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { message, history = [] } = await readBody(event)
  const context = await buildAIContext(user.id)

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')

  const stream = client.messages.stream({
    model: 'claude-haiku-3-5',
    max_tokens: 1024,
    system: context.systemPrompt,
    messages: [
      ...history.slice(-10),  // last 10 turns, not persisted
      { role: 'user', content: message }
    ]
  })

  return sendStream(event, stream.toReadableStream())
})
```

---

## 11. Development Tooling

### TypeScript

**Version:** ^5.5  
**Config:** Nuxt handles tsconfig generation. Project extends via `tsconfig.json`:

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

`strict: true` + `noUncheckedIndexedAccess` catches the most common runtime errors at compile time, particularly useful for D1 query result handling.

### ESLint

**Package:** `eslint`, `@nuxt/eslint`  
**Version:** ESLint ^9.x (flat config), @nuxt/eslint ^0.7  

ESLint 9 dropped the legacy `.eslintrc` format in favor of `eslint.config.mjs`. Nuxt provides a config factory:

```javascript
// eslint.config.mjs
import nuxtEslint from '@nuxt/eslint'

export default nuxtEslint({
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'error'
  }
})
```

No Prettier. Nuxt ESLint config handles formatting rules via `@stylistic/eslint-plugin`. One tool, no conflicts.

### Vitest

**Package:** `vitest`, `@nuxt/test-utils`  
**Version:** ^2.x  

Testing is unit and integration only in v1. No E2E (no Playwright or Cypress) in the first phase.

Test structure:

```
tests/
├── unit/
│   ├── utils/          Pure utility function tests
│   └── composables/    Composable unit tests with @vue/test-utils
└── integration/
    └── api/            Server route tests using @nuxt/test-utils/runtime
```

Example integration test:

```typescript
// tests/integration/api/tasks.test.ts
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('GET /api/tasks', async () => {
  await setup({ rootDir: fileURLToPath(new URL('../..', import.meta.url)) })

  it('returns 401 without session', async () => {
    const res = await $fetch('/api/tasks', { ignoreResponseError: true })
    expect(res.statusCode).toBe(401)
  })
})
```

### NuxtHub (Local Development)

**Package:** `@nuxthub/core`  
**Version:** ^0.8  
**Docs:** https://hub.nuxt.com

NuxtHub wraps Wrangler's local dev mode to provide a local D1 database, R2 storage emulation, and a studio UI for inspecting data during development. It also handles deployment to Cloudflare Pages via `npx nuxthub deploy`.

```bash
# Full local dev with D1 + Workers emulation
npx nuxthub dev

# Deploy to Cloudflare Pages
npx nuxthub deploy
```

### Package Manager

**pnpm ^9.x** — faster installs, strict hoisting, better monorepo support if the project expands.

```bash
# Install
pnpm install

# Dev server
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test
```

---

## 12. Migration Path from Next.js + PocketBase

This section documents the migration strategy for moving from the current stack to the new one without losing data.

### Phase Overview

```
Phase 1: Data export from PocketBase
Phase 2: Schema creation in D1
Phase 3: Data import to D1
Phase 4: Feature parity (core routes)
Phase 5: Cutover
Phase 6: Decommission PocketBase
```

### Phase 1: Data Export from PocketBase

PocketBase exposes a built-in admin API and a backup endpoint. Export all collections as JSON:

```bash
# PocketBase backup (produces a zip with all collections as JSON)
curl -H "Authorization: <admin_token>" \
  https://[pocketbase-url]/api/backups \
  -X POST

# Download the backup
curl -H "Authorization: <admin_token>" \
  "https://[pocketbase-url]/api/backups/[backup-name]" \
  --output backup.zip
```

Collections to export:
- `users` → map to `users` table
- `goals` (if exists) → `goals`
- `epics` → `epics`
- `tasks` → `tasks`
- `subtasks` (if exists) → `subtasks`
- `comments` → `comments`

### Phase 2: Schema Creation in D1

```bash
# Apply initial migration to D1 prod
npx drizzle-kit generate
npx wrangler d1 execute elux-tracker --file ./server/database/migrations/0001_init.sql
```

### Phase 3: Data Import

Write a one-time migration script (`scripts/migrate-from-pb.ts`) that:

1. Reads the PocketBase JSON exports
2. Maps PocketBase record IDs to UUIDs (PocketBase uses 15-char alphanumeric IDs)
3. Maintains a `pb_id_to_uuid` mapping for foreign key resolution
4. Inserts records in dependency order: users → goals → epics → tasks → subtasks → comments
5. Hashes plain-text passwords if they were exported (PocketBase uses bcrypt already — verify format compatibility)

```typescript
// scripts/migrate-from-pb.ts (outline)
import pbUsers from '../backup/users.json'
import pbTasks from '../backup/tasks.json'
// ...

const idMap = new Map<string, string>()

for (const pbUser of pbUsers) {
  const newId = crypto.randomUUID()
  idMap.set(pbUser.id, newId)
  await db.insert(users).values({
    id: newId,
    email: pbUser.email,
    name: pbUser.name,
    role: mapRole(pbUser.role),  // map PocketBase role names to new enum values
    passwordHash: pbUser.passwordHash,  // already bcrypt
    createdAt: pbUser.created
  })
}
// ... similar for each entity
```

### Phase 4: Field Mapping

| PocketBase Field | D1 Column | Notes |
|---|---|---|
| `id` (15-char string) | `id` (UUID) | Remapped via idMap |
| `created` | `created_at` | ISO format preserved |
| `updated` | `updated_at` | ISO format preserved |
| `collectionId` | — | Dropped, not needed |
| `collectionName` | — | Dropped |
| `expand.*` | — | Replaced by JOIN queries |

### Phase 5: Cutover Plan

1. Set PocketBase to read-only mode (disable write API)
2. Run final incremental sync for any records created since the bulk import
3. Update DNS / Cloudflare routing to point `pt.eluxemang.top` to Cloudflare Pages
4. Monitor error logs for 24 hours
5. If stable: proceed to Phase 6

### Phase 6: Decommission

- Stop PocketBase VPS after 30-day read-only holdover
- Archive VPS snapshot before termination

### Rollback Plan

Cloudflare Pages supports instant rollback to a previous deployment via the dashboard. The PocketBase VPS stays live and read-only during Phase 5, providing a rollback target if critical issues emerge post-cutover.

### Known Migration Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| PocketBase ID collision after remapping | Low | idMap is built first and validated |
| Password hash format incompatibility | Low | PocketBase uses bcrypt; verify cost factor |
| Missing foreign key data (orphaned records) | Medium | Pre-migration audit script |
| PocketBase file attachments (avatars, doc uploads) | Medium | Copy to Cloudflare R2 before cutover |
| User session invalidation at cutover | Certain (expected) | All users must re-login (communicate in advance) |

---

*End of Tech Stack Document — v1.0*
