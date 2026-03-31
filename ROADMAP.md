# Roadmap

## v0.1.0 — Foundation (done)

- [x] zpdf library (PDF 1.4 writer)
- [x] 6 worksheet types (daily, weekly, goals, decide, founder, progress)
- [x] CLI with subcommands
- [x] Cross-platform builds (macOS, Linux, Windows)
- [x] Mathematical design system (18pt grid, golden ratio)
- [x] Experimental disclaimer on all outputs

## Current: v0.2.0 — MadLibs Web Platform (done)

- [x] SvelteKit web app with Vercel deployment
- [x] MadLibs fill-in-the-blank experience (`/play/[slug]`)
- [x] Live preview updating as you type
- [x] PDF generation via pdf-lib (filled + blank modes)
- [x] Browse worksheets page (`/worksheets`)
- [x] All 6 worksheets converted to JSON template schema
- [x] 17 PDF component renderers ported from Zig to JavaScript
- [x] Admin panel with password auth (`/admin`)
- [x] Template builder (add blanks, pick sections, live preview)
- [x] Access control (publish/draft/hidden with token links)
- [x] Turso SQLite + Drizzle ORM for custom templates
- [x] Design system ported to CSS custom properties

## Next: v0.3.0 — Polish & Print Quality

- [ ] Visual refinement pass on all worksheets (spacing, alignment, hierarchy)
- [ ] Print-test verification on physical paper
- [ ] Custom date injection via CLI (`--date 2026-04-01`)
- [ ] Page numbers for multi-page workbook
- [ ] Tighter typography kerning and line-break handling
- [ ] Zig CLI reads JSON templates (shared format with web)
- [ ] PDF visual diff comparison (Zig vs pdf-lib output)

## v0.4.0 — Extended Worksheets

- [ ] Gratitude journal (standalone, 5-minute morning format)
- [ ] Fear-setting worksheet (Tim Ferriss / Stoic exercise)
- [ ] Pre-mortem analysis (Gary Klein)
- [ ] After-action review (AAR military framework)
- [ ] Energy audit (when am I most productive?)
- [ ] Relationship map (who gives/drains energy?)

## v0.5.0 — Personalization & Community

- [ ] User accounts (save filled worksheets, track history)
- [ ] Public template marketplace (community submissions)
- [ ] A4 page size option (international)
- [ ] Custom branding: header text, logo placeholder
- [ ] Export filled data as JSON/CSV

## v0.6.0 — Data Layer

- [ ] Structured data input (fill worksheets from JSON/CSV)
- [ ] Weekly summary generation from daily check-in data
- [ ] Trend visualization (simple bar charts in PDF)

## Long-term Vision

- Extract `zpdf` as standalone Zig PDF library (own repo)
- Community worksheet contributions
- Mobile companion (scan filled worksheets, digitize responses)
- Research collaboration with psychology departments
