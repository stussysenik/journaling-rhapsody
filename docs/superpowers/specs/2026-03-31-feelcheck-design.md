# FeelCheck — Psychology-Backed Printable Journal Generator

## Overview

A ~200KB Zig binary that generates printable PDF worksheets for mental health journaling, goal-setting, decision-making, and founder resilience. Inspired by the **How We Feel** app (Yale Center for Emotional Intelligence / Marc Brackett's RULER framework), enriched with **Shane Parrish mental models**, **untools.co thinking tools**, and **startup psychology** research.

**FOR EXPERIMENTAL PURPOSES ONLY — NOT A SUBSTITUTE FOR PROFESSIONAL MENTAL HEALTH CARE**

---

## Architecture: Two-Layer SRP Design

Solve the general problem first (PDF generation), then the specific problem (worksheet content).

### Layer 1: `zpdf` — General-Purpose Minimal PDF Library

A zero-dependency Zig PDF writer. Completely decoupled from worksheet content. Could be extracted to its own repo.

**Responsibilities:**
- PDF document structure (catalog, pages, xref, trailer)
- Text rendering with built-in PDF fonts (Helvetica, Helvetica-Bold, Helvetica-Oblique)
- Geometric primitives: lines, rectangles, rounded rectangles, circles, ellipses, Bezier curves
- Fill and stroke with RGB colors
- Page management (add pages, set size to US Letter 612x792pt)
- Content stream building (PDF operators: m, l, c, re, S, f, BT/ET, Tf, Td, Tj, rg/RG, w)

**Public API surface:**
```zig
const doc = zpdf.Document.init(allocator);
defer doc.deinit();

var page = try doc.addPage(.letter);

// Text
page.setFont(.helvetica_bold, 24);
page.drawText(72, 720, "Title");

// Shapes
page.setStrokeColor(0.9, 0.9, 0.9);
page.setFillColor(1, 1, 1);
page.drawRect(72, 600, 468, 100);
page.drawCircle(306, 400, 50);
page.drawLine(72, 595, 540, 595);

// Venn diagram (two overlapping circles)
page.drawCircle(250, 400, 80);
page.drawCircle(360, 400, 80);

try doc.writeTo("output.pdf");
```

### Layer 2: `feelcheck` — Worksheet Generator

Uses `zpdf` to compose psychology-backed printable worksheets.

**Module structure:**
```
src/
├── main.zig              # CLI: parse args, dispatch to worksheet
├── design.zig            # Design system constants (grid, colors, fonts, spacing)
├── components.zig        # Reusable visual components (mood_grid, lined_box, scale, venn, etc.)
└── worksheets/
    ├── daily.zig         # Daily Mood Check-in (RULER)
    ├── weekly.zig        # Weekly Reflection
    ├── goals.zig         # Goal-Setting & Vision
    ├── decide.zig        # Decision Planning (Mental Models)
    ├── founder.zig       # Founder Resilience
    └── progress.zig      # Progress Check-in

lib/
└── zpdf/
    ├── document.zig      # PDF document structure
    ├── page.zig          # Page + content stream
    ├── font.zig          # Built-in font metrics
    └── writer.zig        # Binary PDF output
```

---

## Design System — Mathematical Simplicity (John Maeda)

### Grid
- **Base unit**: 18pt (0.25 inch)
- **Page**: US Letter (612 x 792 pt)
- **Margins**: 4 units = 72pt (1 inch) all sides
- **Content area**: 468pt wide x 648pt tall
- **Golden ratio** (φ = 1.618): drives column splits (289pt : 179pt) and section height proportions
- **Columns**: Single-column default. Two-column sections use golden split.

### Typography (built-in PDF fonts — zero embedding)
| Role | Font | Size | Leading |
|------|------|------|---------|
| Page title | Helvetica-Bold | 24pt | 30pt |
| Section header | Helvetica-Bold | 14pt | 18pt |
| Body/prompts | Helvetica | 10pt | 14pt |
| Captions/footnotes | Helvetica-Oblique | 8pt | 10pt |
| Fill-in placeholder | Helvetica-Oblique | 9pt | — |

### Colors (minimal palette)
| Role | Hex | RGB (0-1) |
|------|-----|-----------|
| Text | #1A1A1A | 0.10, 0.10, 0.10 |
| Grid lines / boxes | #E0E0E0 | 0.88, 0.88, 0.88 |
| Section dividers | #CCCCCC | 0.80, 0.80, 0.80 |
| Captions | #808080 | 0.50, 0.50, 0.50 |
| Accent dots | #D4A017 | 0.83, 0.63, 0.09 |
| Background fills | #F7F7F7 | 0.97, 0.97, 0.97 |

### Kindergarten Pre-Fill Principle
Every prompt has a **visible container** — a rectangle, circle, or ruled line — that invites the pen. No blank areas. Light gray boxes with rounded corners for write-in sections. Circles to mark/select. Scales with numbered dots to circle.

---

## Worksheet Specifications

### 1. Daily Mood Check-in (RULER Framework)

**Psychology**: Marc Brackett's Mood Meter. Affect labeling reduces amygdala reactivity ~50%. Granular emotion vocabulary builds regulation capacity.

| Section | Layout | Content |
|---------|--------|---------|
| Header | Full width | "Daily Mood Check-in" + date field (right-aligned box) |
| Mood Meter | Center, 260x260pt | 2x2 grid. X-axis: Pleasantness (low→high). Y-axis: Energy (low→high). 9 emotion words per quadrant (36 total). User circles current state. |
| Trigger | Full width, 3 ruled lines | "What triggered this feeling?" |
| Body Scan | Right column, geometric figure (oval head + rect torso + line limbs) | "Where do you feel it?" — 5 annotation lines pointing to head/chest/stomach/hands/feet |
| Regulation | 4 rounded-rect options | ○ Change thinking ○ Move body ○ Be mindful ○ Reach out + blank write-in |
| Footer | Full width | ⚠ FOR EXPERIMENTAL PURPOSES ONLY |

**Emotion words by quadrant:**
- **High Energy + Pleasant** (top-right): Excited, Thrilled, Inspired, Energized, Optimistic, Passionate, Elated, Enthusiastic, Confident
- **High Energy + Unpleasant** (top-left): Anxious, Stressed, Frustrated, Overwhelmed, Angry, Panicked, Agitated, Irritated, Restless
- **Low Energy + Pleasant** (bottom-right): Calm, Content, Grateful, Relaxed, Peaceful, Serene, Hopeful, Comfortable, Secure
- **Low Energy + Unpleasant** (bottom-left): Sad, Drained, Lonely, Bored, Tired, Numb, Disconnected, Melancholy, Depleted

### 2. Weekly Reflection (Pattern Recognition)

**Psychology**: Longitudinal pattern awareness. Self-monitoring is the first step in behavioral change (CBT foundation).

| Section | Layout | Content |
|---------|--------|---------|
| Header | Full width | "Weekly Reflection" + week-of date field |
| 7-Day Tracker | Full width, 7 mini squares (60x60pt) | Mon-Sun mini mood grids (simplified 2x2 with dot to place) |
| Dominant feeling | Full width, 1 line | "This week I felt mostly..." |
| Win / Challenge | Two golden-ratio columns | "Biggest win:" (box) / "Biggest challenge:" (box) |
| Pattern | Full width, 3 lines | "What pattern do I notice in my moods this week?" |
| RULER Growth | 5 checkboxes | "Which skill did I practice? ☐ Recognize ☐ Understand ☐ Label ☐ Express ☐ Regulate" |
| Next week intention | Full width, 2 lines | "Next week, I want to..." |
| Footer | Full width | ⚠ FOR EXPERIMENTAL PURPOSES ONLY |

### 3. Goal-Setting & Vision (Startup Psychology)

**Psychology**: Written goals are 42% more likely to be achieved (Dr. Gail Matthews). OKR framework from Intel/Google. "Best Possible Self" is a validated positive psychology intervention.

| Section | Layout | Content |
|---------|--------|---------|
| Header | Full width | "Goal-Setting & Vision" + date field |
| CAG | Full width, large box (120pt tall) | "My Compelling & Audacious Goal:" |
| OKR Breakdown | 3 rows | Each: "Objective N:" line → 3 "KR:" sub-lines with checkbox |
| Best Possible Self | Golden-ratio box | "In 90 days, if everything goes right, I will be..." |
| Milestone Timeline | Full width, horizontal line | 4 circle checkpoints with date + milestone write-in below each |
| Confidence | Scale 1-10 dots | "How confident am I? (circle)" |
| Footer | Full width | ⚠ FOR EXPERIMENTAL PURPOSES ONLY |

### 4. Decision Planning (Shane Parrish Mental Models + untools.co)

**Psychology**: Inversion thinking (Charlie Munger via Parrish). Second-order thinking prevents short-term bias. Eisenhower Matrix for prioritization clarity. Venn diagrams for option comparison.

| Section | Layout | Content |
|---------|--------|---------|
| Header | Full width | "Decision Planning" + date field |
| The Decision | Full width, box | "The decision I'm facing:" |
| Inversion | Half page, box | "What would make this FAIL?" — 4 lined rows (thinking by inversion) |
| Second-Order Thinking | 3 equal columns | "Now" / "In 1 month" / "In 1 year" — lined boxes |
| Venn Diagram | Center, pre-drawn | Two overlapping circles: "Option A" / "Option B" / "Both" zones with write-in space |
| Eisenhower Matrix | 2x2 grid (200x200pt) | Urgent/Not x Important/Not — 4 quadrant boxes |
| My Decision | Full width, box | "After reflection, I will:" |
| Footer | Full width | ⚠ FOR EXPERIMENTAL PURPOSES ONLY |

### 5. Founder Resilience (Evidence-Based Founder Psychology)

**Psychology**: 72% of entrepreneurs face mental health challenges. Imposter syndrome affects 58% of founders. Cognitive reframing is a core CBT technique. Circle of Control from Stephen Covey.

| Section | Layout | Content |
|---------|--------|---------|
| Header | Full width | "Founder Resilience Check" + date field |
| Imposter Check | Two equal boxes | "The voice says:" / "The evidence says:" |
| Vital Signs | 5 horizontal scales (1-10) | Sleep / Focus / Energy / Motivation / Connection |
| Cognitive Reframe | 3 connected boxes (arrows) | "The setback:" → "The lesson:" → "The next move:" |
| Gratitude | 3 numbered lines | "What I'm grateful for today:" |
| Circle of Control | Two concentric circles | Inner: "What I control" / Outer: "What I can't" — write-in zones |
| Footer | Full width | ⚠ FOR EXPERIMENTAL PURPOSES ONLY |

### 6. Progress Check-in (Momentum Tracking)

**Psychology**: Progress principle (Teresa Amabile, Harvard) — small wins are the strongest motivator. Accountability through structured review.

| Section | Layout | Content |
|---------|--------|---------|
| Header | Full width | "Progress Check-in" + date field |
| Goals Status | Two columns | "Goals I set:" / "Where I am now:" — paired lines (3 rows) |
| Momentum Meter | Horizontal 5-point scale | ○ Stalled ○ Slow ○ Steady ○ Accelerating ○ Flying |
| Blockers | Box, 3 lines | "What's blocking me?" |
| One Action | Large single box | "One thing I can do TODAY to move forward:" |
| Support | 3 lines | "Who can help?" |
| Progress Venn | Pre-drawn 3-circle Venn | "Planned" / "Did" / "Learned" — write-in zones |
| Footer | Full width | ⚠ FOR EXPERIMENTAL PURPOSES ONLY |

---

## CLI Interface

```
feelcheck — Psychology-backed printable journal worksheets

USAGE:
    feelcheck <command> [options]

COMMANDS:
    daily       Generate Daily Mood Check-in worksheet
    weekly      Generate Weekly Reflection worksheet
    goals       Generate Goal-Setting & Vision worksheet
    decide      Generate Decision Planning worksheet
    founder     Generate Founder Resilience worksheet
    progress    Generate Progress Check-in worksheet
    all         Generate complete workbook (all 6 pages)

OPTIONS:
    -o <path>   Output file path (default: feelcheck-{type}-{date}.pdf)
    -h          Show this help

EXAMPLES:
    feelcheck daily
    feelcheck all -o my-journal.pdf

⚠ FOR EXPERIMENTAL PURPOSES ONLY — NOT A SUBSTITUTE FOR PROFESSIONAL MENTAL HEALTH CARE
```

---

## Build & Distribution

```bash
zig build -Doptimize=ReleaseSmall   # ~200KB binary
```

Cross-compile targets:
```bash
zig build -Dtarget=x86_64-macos
zig build -Dtarget=x86_64-linux
zig build -Dtarget=x86_64-windows
zig build -Dtarget=aarch64-macos     # Apple Silicon
zig build -Dtarget=aarch64-linux     # ARM Linux
```

Zero dependencies. Single static binary. No runtime requirements.

---

## Verification Plan — Pixel-Engineered Rigor

Every PDF output must be byte-verified and visually confirmed before delivery.

### Build Verification
1. `zig build` compiles with zero warnings, zero errors
2. `zig build -Doptimize=ReleaseSmall` — confirm binary <500KB via `ls -la`
3. `zig build test` — all unit tests pass (PDF structure, coordinate math, text encoding)

### PDF Structural Verification
4. **PDF spec compliance**: Validate PDF header (`%PDF-1.4`), xref table integrity, trailer `startxref` offset matches actual byte position
5. **Object graph**: Verify catalog → pages → page → content stream → font references form valid tree
6. **Content stream operators**: Each stream produces valid PDF operator sequences (no malformed tokens)

### Visual Verification (per worksheet, all 6)
7. **Open in Preview.app**: Every page renders without errors or missing glyphs
8. **Text legibility**: All text is readable, correctly positioned, no overlapping
9. **Shape accuracy**: Mood meter grid is square, Venn circles overlap correctly, Eisenhower matrix is symmetric
10. **Spacing consistency**: Verify base-unit grid alignment — elements snap to 18pt increments
11. **Golden ratio**: Two-column splits measure 289pt : 179pt (±1pt tolerance)
12. **Color accuracy**: Sample pixel colors match spec values

### Print Verification
13. **Cmd+P test**: Print to PDF from Preview — confirm US Letter (8.5"x11") fit, 1" margins
14. **Content completeness**: Every prompt text present, every fill-in container drawn
15. **Disclaimer**: "FOR EXPERIMENTAL PURPOSES ONLY" footer on every single page

### Cross-Platform
16. Build for `aarch64-macos`, `x86_64-linux`, `x86_64-windows` — all compile successfully
