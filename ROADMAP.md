# Roadmap

## Current: v0.1.0 — Foundation

- [x] zpdf library (PDF 1.4 writer)
- [x] 6 worksheet types (daily, weekly, goals, decide, founder, progress)
- [x] CLI with subcommands
- [x] Cross-platform builds (macOS, Linux, Windows)
- [x] Mathematical design system (18pt grid, golden ratio)
- [x] Experimental disclaimer on all outputs

## Next: v0.2.0 — Polish & Print Quality

- [ ] Visual refinement pass on all worksheets (spacing, alignment, hierarchy)
- [ ] Print-test verification on physical paper
- [ ] Custom date injection via CLI (`--date 2026-04-01`)
- [ ] Page numbers for multi-page workbook
- [ ] Tighter typography kerning and line-break handling
- [ ] Multi-line text wrapping in boxes

## v0.3.0 — Extended Worksheets

- [ ] Gratitude journal (standalone, 5-minute morning format)
- [ ] Fear-setting worksheet (Tim Ferriss / Stoic exercise)
- [ ] Pre-mortem analysis (Gary Klein)
- [ ] After-action review (AAR military framework)
- [ ] Energy audit (when am I most productive?)
- [ ] Relationship map (who gives/drains energy?)

## v0.4.0 — Personalization

- [ ] Config file for custom prompts / emotion words
- [ ] User-defined worksheet templates (TOML/JSON spec)
- [ ] Branding: custom header text, logo placeholder
- [ ] A4 page size option (international)

## v0.5.0 — Data Layer

- [ ] Structured data input (fill worksheets from JSON/CSV)
- [ ] Weekly summary generation from daily check-in data
- [ ] Trend visualization (simple bar charts in PDF)

## Long-term Vision

- Extract `zpdf` as standalone Zig PDF library (own repo)
- Community worksheet contributions
- Mobile companion (scan filled worksheets, digitize responses)
- Research collaboration with psychology departments
