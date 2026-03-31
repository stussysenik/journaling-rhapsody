# feelcheck web

SvelteKit web layer for **feelcheck** — psychology-backed MadLibs journal worksheets.

Users browse templates, fill in interactive MadLibs-style prompts, and download personalized PDFs. An admin panel lets you create and manage custom templates.

## Quick start

```sh
cd web
npm install
npm run dev
```

Open http://localhost:5173 to see the app.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/worksheets` | Browse all published templates |
| `/play/[slug]` | MadLibs fill-in experience |
| `/print/[slug]` | PDF download endpoint |
| `/admin` | Template dashboard (password protected) |
| `/admin/templates/new` | Create new template |
| `/admin/templates/[id]` | View/edit template |

## Environment variables

Copy `.env.example` to `.env` and fill in:

```sh
# Admin password (bcrypt hash)
# Generate: node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"
ADMIN_PASSWORD_HASH=

# Turso database (optional for local dev — falls back to file:local.db)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Deploy to Vercel

The app uses `@sveltejs/adapter-vercel`. Deploy from the `web/` directory:

```sh
vercel deploy
```

Set the environment variables in the Vercel dashboard under Settings > Environment Variables.

## Tech stack

- **Framework**: SvelteKit (Svelte 5 runes)
- **Hosting**: Vercel (adapter-vercel)
- **Database**: Turso SQLite + Drizzle ORM
- **PDF generation**: pdf-lib
- **Auth**: bcrypt + session cookies
- **Styling**: CSS custom properties (no Tailwind)

## Architecture

```
web/src/
├── routes/           # SvelteKit file-based routing
├── lib/
│   ├── schema/       # Template types, validation, resolution
│   ├── pdf/          # pdf-lib rendering engine (15+ components)
│   ├── db/           # Drizzle ORM + Turso client
│   ├── auth/         # Password + session management
│   └── components/   # Shared Svelte components
templates/            # Built-in worksheet JSON files (6 templates)
```

Built-in templates ship as JSON files. Custom templates are stored in the Turso database. The PDF engine ports all visual components from the original Zig codebase to JavaScript using pdf-lib.
