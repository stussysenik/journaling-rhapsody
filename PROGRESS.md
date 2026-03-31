# Progress Log

Append-only. Never delete entries.

---

## 2026-04-01 — v0.2.0: MadLibs Web Platform

### Built
- **SvelteKit web app** (`web/`) — Full MadLibs-style interactive worksheet platform
  - Landing page with hero, how-it-works, psychology framework showcase
  - `/worksheets` — Browse all 6 published templates as card grid
  - `/play/[slug]` — MadLibs fill-in with pill selectors, text inputs, textareas, scales
  - Live preview panel updating reactively as user types (Svelte 5 runes)
  - Progress bar tracking blank completion
  - `/print/[slug]` — PDF generation endpoint (filled + blank modes)
- **PDF rendering engine** (`web/src/lib/pdf/`) — Port of all Zig components to JavaScript
  - 17 component renderers using pdf-lib (header, lined-box, mood-grid, scale, venn, etc.)
  - Bezier curve rounded rectangles ported from zpdf page.zig
  - Template interpolation: `{{blank_id}}` replacement for filled/blank modes
  - Design constants ported from design.zig (18pt grid, colors, typography)
- **Template schema** (`web/src/lib/schema/`) — Universal JSON format
  - TypeScript types with 22 section types + 6 blank types
  - Runtime validation with discriminated unions
  - Template resolution: file-based built-in + DB custom (hybrid storage)
  - All 6 worksheets converted from Zig to JSON (`templates/*.json`)
- **Admin panel** (`/admin`) — Password-protected template management
  - Dashboard with status filters (all, published, draft, hidden)
  - Visual template builder with blank editor + section picker + live preview
  - Access control: publish/unpublish/hide with token-based shareable links
  - Template CRUD with Drizzle ORM persistence
  - Logout support
- **Authentication** — Single-admin password auth
  - bcrypt password verification via env var
  - Session cookies (httpOnly, secure, sameSite strict, 7-day expiry)
  - Auth guard on all `/admin/*` routes
- **Database** — Turso SQLite + Drizzle ORM
  - Templates table (CRUD for custom worksheets)
  - Sessions table (auth)
  - Drizzle migrations generated
  - Local SQLite fallback for development
- **Design system** — Ported to CSS custom properties
  - Same 6-color palette, 18pt grid, golden ratio
  - System font stack, responsive breakpoints
  - Nav + Footer components

### Verified
- TypeScript: zero errors (`tsc --noEmit`)
- Production build: passes (`vite build` + `adapter-vercel`)
- Visual: all pages verified in Chrome (landing, worksheets, play, admin)
- MadLibs: reactive live preview confirmed working with pill selectors + text + choice
- Auth: `/admin` correctly redirects to login, session persists
- Adapter: `@sveltejs/adapter-vercel` configured for deployment

### Metrics
| Metric | Value |
|--------|-------|
| Web source files | 37+ (lib) + 16 (routes) |
| PDF component renderers | 17 |
| Template JSON files | 6 |
| Section types | 22 |
| Blank types | 6 |
| Routes | 8 (public + admin) |
| npm dependencies | pdf-lib, drizzle-orm, @libsql/client, bcryptjs |
| Framework | SvelteKit (Svelte 5 runes) |
| Deploy target | Vercel |

---

## 2026-03-31 — v0.1.0: Initial Release

### Built
- **zpdf library** (`lib/zpdf/`) — Zero-dependency PDF 1.4 writer in Zig
  - Document structure with correct xref byte offsets
  - Text rendering with built-in Helvetica family (regular, bold, oblique)
  - Geometric primitives: lines, rectangles, rounded rectangles, circles (Bezier)
  - Fill/stroke with RGB colors, line width control
  - Multi-page documents, US Letter page size
- **Design system** (`src/design.zig`) — 18pt grid, golden ratio, 6-color palette
- **Component library** (`src/components.zig`) — 15 reusable visual components:
  - drawHeader, drawSectionHeader, drawLinedBox, drawPromptLines
  - drawScale, drawLabeledScale, drawCheckboxRow, drawMoodGrid
  - drawVenn2, drawVenn3, drawEisenhower, drawTimeline
  - drawConnectedBoxes, drawConcentricCircles, drawBodyFigure
  - drawDualBox, drawMomentumMeter, drawPairedColumns, drawFooter
- **6 worksheets**:
  1. Daily Mood Check-in (RULER framework, 36-emotion Mood Meter)
  2. Weekly Reflection (7-day tracker, pattern recognition)
  3. Goal-Setting & Vision (OKRs, milestone timeline, Best Possible Self)
  4. Decision Planning (inversion, 2nd-order thinking, Venn, Eisenhower)
  5. Founder Resilience (imposter check, cognitive reframe, Circle of Control)
  6. Progress Check-in (momentum meter, 3-circle Venn)
- **CLI** with subcommands, `-o` flag, `-h` help

### Verified
- Binary size: 120KB (ReleaseSmall, macOS aarch64)
- Cross-platform: macOS, Linux, Windows all compile
- PDF structural validity: correct header, xref, trailer, %%EOF
- Byte-identical output between Debug and ReleaseSmall builds
- All 6 worksheets render in Preview.app without errors
- Experimental disclaimer on every page

### Metrics
| Metric | Value |
|--------|-------|
| Binary size (ReleaseSmall) | 120KB |
| Full workbook PDF size | 82KB |
| Zig source files | 14 |
| Lines of Zig code | ~1,200 |
| External dependencies | 0 |
| Worksheet types | 6 |
| Reusable components | 15+ |
