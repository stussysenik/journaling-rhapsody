# feelcheck Web + MadLibs Platform Design

## Context

feelcheck v0.1.0 is a Zig CLI that generates static printable PDF journal worksheets grounded in psychology frameworks (RULER, CBT, OKRs, etc.). The core user experience is "kindergarten pre-fill" — every prompt has a visible container inviting the pen.

**The missing piece is MadLibs.** The original vision was always interactive fill-in-the-blank templates — not just static worksheets. This spec adds:

1. A **web layer** (SvelteKit on Vercel) where users fill in MadLibs-style prompts and get personalized PDFs
2. An **admin panel** (`/admin`) for creating, managing, and controlling worksheet templates
3. A **universal template schema** (JSON) that drives both web rendering and the existing Zig PDF engine

**Why SvelteKit:** 10-year longevity, expressive code as a competitive moat ("Common Lisp" philosophy), "one tree" architecture where file-based routing IS the product structure, native Vercel deployment, and full-stack capabilities without framework overhead.

## Architecture

```
feelcheck/
├── web/                          # SvelteKit app (NEW)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── +page.svelte              # Landing page
│   │   │   ├── +layout.svelte            # Root layout
│   │   │   ├── worksheets/
│   │   │   │   └── +page.svelte          # Browse all templates
│   │   │   ├── play/
│   │   │   │   └── [slug]/
│   │   │   │       ├── +page.svelte      # MadLibs fill-in experience
│   │   │   │       └── +page.server.ts   # Load template data
│   │   │   ├── print/
│   │   │   │   └── [slug]/
│   │   │   │       └── +server.ts        # PDF generation endpoint
│   │   │   └── admin/
│   │   │       ├── +layout.server.ts     # Auth guard
│   │   │       ├── +layout.svelte        # Admin layout
│   │   │       ├── +page.svelte          # Template dashboard
│   │   │       ├── login/
│   │   │       │   └── +page.svelte      # Password login
│   │   │       └── templates/
│   │   │           ├── new/
│   │   │           │   └── +page.svelte  # Template builder
│   │   │           └── [id]/
│   │   │               └── +page.svelte  # Edit template
│   │   ├── lib/
│   │   │   ├── pdf/                      # pdf-lib rendering engine
│   │   │   ├── schema/                   # Template schema types + validation
│   │   │   ├── db/                       # Drizzle ORM + schema
│   │   │   └── components/               # Shared Svelte components
│   │   └── app.html
│   ├── drizzle/                          # DB migrations
│   ├── svelte.config.js
│   ├── vite.config.ts
│   └── package.json
├── src/                           # Zig CLI (EXISTING, unchanged)
├── lib/zpdf/                      # Zig PDF engine (EXISTING, unchanged)
└── templates/                     # Shared template JSON (NEW, git-tracked)
    ├── daily-mood.json
    ├── weekly-reflection.json
    ├── goal-setting.json
    ├── decision-planning.json
    ├── founder-resilience.json
    └── progress-checkin.json
```

## Template Schema

The universal JSON format that drives both web and Zig PDF rendering:

```json
{
  "slug": "daily-mood",
  "title": "Daily Mood Check-in",
  "description": "RULER-based emotional awareness worksheet",
  "psychology": "RULER (Marc Brackett, Yale)",
  "category": "daily",
  "version": 1,
  "status": "published",
  "estimatedMinutes": 2,

  "blanks": [
    {
      "id": "name",
      "prompt": "Your name",
      "type": "text",
      "placeholder": "e.g. Alex",
      "required": true
    },
    {
      "id": "feeling_word",
      "prompt": "Right now I feel ___",
      "type": "text",
      "placeholder": "e.g. anxious, hopeful, scattered"
    },
    {
      "id": "energy_level",
      "prompt": "My energy is",
      "type": "choice",
      "options": ["Low", "Medium", "High"]
    },
    {
      "id": "pleasantness",
      "prompt": "That feeling is",
      "type": "scale",
      "min": 1,
      "max": 10,
      "lowLabel": "Unpleasant",
      "highLabel": "Pleasant"
    },
    {
      "id": "trigger",
      "prompt": "This feeling was triggered by ___",
      "type": "textarea",
      "placeholder": "What happened? Who was involved?"
    },
    {
      "id": "body_location",
      "prompt": "I feel it most in my ___",
      "type": "choice",
      "options": ["Head", "Chest", "Stomach", "Shoulders", "Hands", "Everywhere"]
    },
    {
      "id": "strategy",
      "prompt": "To manage this feeling, I'll try ___",
      "type": "choice",
      "options": ["Breathing", "Movement", "Talking to someone", "Writing more"]
    }
  ],

  "sections": [
    {
      "type": "header",
      "title": "Daily Mood Check-in",
      "subtitle": "for {{name}} — {{date}}"
    },
    {
      "type": "mood_grid",
      "xBlank": "energy_level",
      "yBlank": "pleasantness"
    },
    {
      "type": "lined_box",
      "prompt": "Right now I feel {{feeling_word}} because:",
      "blank": "trigger",
      "lines": 4
    },
    {
      "type": "body_figure",
      "highlight": "body_location"
    },
    {
      "type": "checkbox_row",
      "prompt": "My regulation strategy:",
      "blank": "strategy"
    }
  ]
}
```

### Blank Types

| Type | Web Rendering | PDF Rendering (blank) | PDF Rendering (filled) |
|------|--------------|----------------------|----------------------|
| `text` | Input field | Underlined space | Printed text |
| `textarea` | Multi-line input | Ruled lines in rounded box | Printed text in box |
| `choice` | Pill selector buttons | Checkbox row | Checked box |
| `multi` | Multi-select pills | Checkbox row | Multiple checked |
| `scale` | Slider with labels | Numbered dot row | Circled dot |
| `date` | Date picker (defaults today) | Date box | Printed date |

### Section Types

Map directly to existing `components.zig` visual components:

| Section Type | Component | Description |
|-------------|-----------|-------------|
| `header` | `drawHeader()` | Title + date box |
| `section_header` | `drawSectionHeader()` | Section title with accent dot |
| `lined_box` | `drawLinedBox()` | Rounded gray box with prompt + ruled lines |
| `prompt_lines` | `drawPromptLines()` | Prompt with ruled lines (no box) |
| `scale` | `drawScale()` / `drawLabeledScale()` | Numbered dots 1-10 |
| `checkbox_row` | `drawCheckboxRow()` | Horizontal checkboxes with labels |
| `mood_grid` | `drawMoodGrid()` | 2x2 mood meter (36 emotions) |
| `venn2` | `drawVenn2()` | Two overlapping circles |
| `venn3` | `drawVenn3()` | Three overlapping circles |
| `eisenhower` | `drawEisenhower()` | 2x2 urgent/important matrix |
| `timeline` | `drawTimeline()` | Horizontal line with checkpoints |
| `body_figure` | `drawBodyFigure()` | Stick figure for body scan |
| `concentric_circles` | `drawConcentricCircles()` | Nested circles (Circle of Control) |

### Template Interpolation

`{{blank_id}}` in section fields gets replaced:
- **Web filled mode**: with the user's typed answer, live-updating as they type
- **PDF filled mode**: with the answer rendered in the appropriate font
- **PDF blank mode**: with an empty underline/box of appropriate size

## Public Site

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page — what is feelcheck, browse worksheets CTA |
| `/worksheets` | Browse all published templates — cards with category, framework, prompt count, time estimate |
| `/play/[slug]` | MadLibs fill-in experience — form on left, live PDF preview on right |
| `/print/[slug]` | Server endpoint — generates PDF (blank or filled via query params) |

### MadLibs Fill-in Flow (`/play/[slug]`)

1. **Load template** from files (built-in) or DB (custom), checking access control
2. **Render blanks as interactive form** — text inputs, pill selectors, sliders, date pickers
3. **Live preview panel** — right side shows a miniature PDF representation updating as the user types. Uses the same template sections to render an HTML approximation of the PDF layout.
4. **Download options** at the bottom:
   - **Download Filled** — pdf-lib generates PDF with answers baked in
   - **Download Blank** — pdf-lib generates empty worksheet for pen-and-paper
   - **Print Directly** — opens browser print dialog

### Design Language

Extends the existing feelcheck design system to web:
- **Grid**: 18pt base unit → 1.125rem base on web
- **Palette**: Same 6-color palette from `design.zig` adapted for light/dark modes
- **Typography**: System font stack (no web fonts for speed), sizes proportional to PDF spec
- **Components**: Web equivalents of the 15+ PDF components, rendered as Svelte components

## Admin Panel (`/admin`)

### Authentication

- Single-admin password auth
- `ADMIN_PASSWORD_HASH` environment variable (bcrypt)
- Session cookie: `httpOnly`, `secure`, `sameSite: strict`, 7-day expiry
- SvelteKit layout server hook checks session on all `/admin/*` routes

### Dashboard (`/admin`)

- Lists all templates (built-in + custom) with status badges
- Filter tabs: All, Published, Drafts, Hidden
- Per-template actions: Preview, Edit, Hide/Publish, Copy Link, Delete (custom only)
- Stats: fill count per template (future)

### Template Builder (`/admin/templates/new` and `/admin/templates/[id]`)

- **Left panel**: Template metadata (name, description, psychology framework, category)
- **Blanks editor**: Add/remove/reorder blanks with drag-and-drop. Each blank has type, prompt, placeholder, options (for choice/multi), scale config
- **Sections editor**: Add layout sections from a component picker. Each section references blanks by ID and configures component-specific options
- **Right panel**: Live PDF preview — renders the template with sample data as you build it

### Access Control

Three states for each template:

| State | Behavior |
|-------|----------|
| **Published** | Listed on `/worksheets`, accessible at `/play/[slug]` |
| **Draft** | Only visible in `/admin`, previewable via admin |
| **Hidden** | Not listed on `/worksheets`, accessible via `/play/[slug]?token=[token]` — token generated and copyable from admin |

## Data Layer

### Hybrid Storage

**Built-in templates** (file-based):
- JSON files in `templates/` directory, git-tracked
- Read at build time and bundled into the app
- The 6 existing v0.1.0 worksheets converted to template schema format
- Editable in admin (saves override to DB) but original file always available as reset

**Custom templates** (database):
- Stored in Turso SQLite (edge-compatible, Vercel-friendly)
- Full CRUD via admin panel
- Drizzle ORM for type-safe queries

### Database Schema (Drizzle)

```
templates
  id          TEXT PRIMARY KEY (ULID)
  slug        TEXT UNIQUE NOT NULL
  title       TEXT NOT NULL
  description TEXT
  psychology  TEXT
  category    TEXT
  version     INTEGER DEFAULT 1
  status      TEXT DEFAULT 'draft' (published | draft | hidden)
  schema      TEXT NOT NULL (JSON — blanks + sections)
  accessToken TEXT (for hidden templates)
  isBuiltinOverride BOOLEAN DEFAULT FALSE
  createdAt   INTEGER NOT NULL
  updatedAt   INTEGER NOT NULL
```

### Template Resolution

When resolving a template by slug:

1. Check DB for a row with matching slug
2. If DB row exists AND `isBuiltinOverride = true` → use DB version (admin edited a built-in)
3. If DB row exists AND `isBuiltinOverride = false` → it's a custom template, use it
4. If no DB row → look up built-in JSON file from `templates/[slug].json`
5. If neither exists → 404

## PDF Generation (Web)

### pdf-lib Integration

- **Server-side**: `/print/[slug]` endpoint generates PDF using pdf-lib
- **Client-side option**: Generate in-browser for instant preview (no server round-trip)
- Implements the same visual components as `components.zig` but in JavaScript:
  - `renderHeader()`, `renderLinedBox()`, `renderMoodGrid()`, etc.
  - Same 18pt grid, same colors, same font sizes (Helvetica built into PDF spec)
  - Output should be visually identical to Zig-generated PDFs

### Zig CLI Compatibility

- The Zig CLI remains standalone and unchanged
- Future: Zig CLI could read the same template JSON files to generate PDFs
- Template schema is the bridge between both rendering engines

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit (Svelte 5 runes) |
| Hosting | Vercel (adapter-vercel) |
| Database | Turso SQLite + Drizzle ORM |
| PDF (web) | pdf-lib |
| PDF (CLI) | zpdf (Zig, existing) |
| Auth | Bcrypt + session cookies |
| Styling | CSS (design system, no Tailwind) |
| Template format | JSON schema (shared) |

## Verification Plan

### Functional Testing
1. **Template schema**: Validate all 6 existing worksheets convert cleanly to JSON schema
2. **MadLibs flow**: Fill in a template on `/play/daily-mood`, verify live preview updates
3. **PDF generation**: Download filled + blank PDFs, compare visually to Zig-generated originals
4. **Admin CRUD**: Create a new template, add blanks + sections, preview, publish, verify on public site
5. **Access control**: Verify draft templates are invisible, hidden templates require token, published are public
6. **Auth**: Verify `/admin/*` redirects to login, session persists, cookie expires correctly

### Visual Testing
1. **Design fidelity**: Web components match the PDF design system (colors, spacing, typography)
2. **Print quality**: Downloaded PDFs print cleanly at 100% scale on US Letter
3. **Responsive**: Public site works on mobile (admin is desktop-only acceptable)

### Deployment Testing
1. **Vercel deploy**: `vercel deploy` works from `web/` directory
2. **Turso connection**: DB accessible from Vercel edge functions
3. **Environment vars**: `ADMIN_PASSWORD_HASH`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` configured
