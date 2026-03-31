<p align="center">
  <h1 align="center">feelcheck</h1>
  <p align="center">Psychology-backed printable journal worksheets.<br>120KB. Zero dependencies. Cross-platform.</p>
  <p align="center">
    <a href="#worksheets"><strong>Worksheets</strong></a> ·
    <a href="#install">Install</a> ·
    <a href="ROADMAP.md">Roadmap</a> ·
    <a href="PROGRESS.md">Progress</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/lang-zig-f7a41d?style=flat" alt="Zig">
    <img src="https://img.shields.io/badge/binary-120KB-black?style=flat" alt="120KB">
    <img src="https://img.shields.io/badge/deps-0-brightgreen?style=flat" alt="Zero deps">
    <img src="https://img.shields.io/badge/status-experimental-orange?style=flat" alt="Experimental">
  </p>
</p>

---

> **FOR EXPERIMENTAL PURPOSES ONLY**
> Not a substitute for professional mental health care.

---

## What

A tiny Zig binary that generates printable PDF worksheets for mood journaling,
goal-setting, decision-making, and founder resilience.

Inspired by [How We Feel](https://howwefeel.org/) (Yale), Shane Parrish's mental
models, and startup psychology research. Print them. Fill them in with a pen.
That's it.

## Install

```bash
zig build -Doptimize=ReleaseSmall
cp zig-out/bin/feelcheck /usr/local/bin/
```

## Usage

```bash
feelcheck daily                    # mood check-in
feelcheck weekly                   # weekly reflection
feelcheck goals                    # goal-setting & vision
feelcheck decide                   # decision planning
feelcheck founder                  # founder resilience
feelcheck progress                 # progress check-in
feelcheck all                      # full 6-page workbook
feelcheck all -o my-journal.pdf    # custom output path
```

## Worksheets

| | Worksheet | What it does | Psychology |
|-|-----------|-------------|------------|
| 1 | **Daily Mood Check-in** | 36-emotion Mood Meter, triggers, body scan, regulation | RULER / Marc Brackett (Yale) |
| 2 | **Weekly Reflection** | 7-day tracker, patterns, wins & challenges | CBT self-monitoring |
| 3 | **Goal-Setting & Vision** | OKRs, milestone timeline, 90-day visualization | Matthews / Intel / Google |
| 4 | **Decision Planning** | Inversion, 2nd-order thinking, Venn, comparison | Shane Parrish / untools.co |
| 5 | **Founder Resilience** | Imposter check, vital signs, reframe, Circle of Control | CBT / Covey |
| 6 | **Progress Check-in** | Goals vs reality, momentum, Planned/Did/Learned Venn | Amabile (Harvard) |

## Cross-Platform

```bash
zig build -Doptimize=ReleaseSmall -Dtarget=x86_64-linux
zig build -Doptimize=ReleaseSmall -Dtarget=x86_64-windows
zig build -Doptimize=ReleaseSmall -Dtarget=aarch64-macos
zig build -Doptimize=ReleaseSmall -Dtarget=aarch64-linux
```

## Architecture

```
lib/zpdf/           zero-dep PDF 1.4 writer (extractable to own repo)
src/design.zig      18pt grid · golden ratio · Helvetica · 6-color palette
src/components.zig   mood grid · venn · eisenhower · timeline · body scan · ...
src/worksheets/      one file per worksheet type
src/main.zig         CLI
```

## Design Principles

- **John Maeda simplicity** — mathematical grid, minimal palette, maximum whitespace
- **Kindergarten pre-fill** — every prompt has a visible box, circle, or line inviting the pen
- **SRP modularity** — general problem (PDF library) separated from specific problem (worksheets)
- **Blackbox archive** — every worksheet version is permanently documented, never deleted

## Table of Contents

```
README.md                   you are here
PROGRESS.md                 development log (append-only)
ROADMAP.md                  future direction
docs/archive/               worksheet archive (blackbox, never delete)
docs/superpowers/specs/     design specifications
lib/zpdf/                   PDF generation library
src/                        application source
build.zig                   build configuration
```

## Psychology References

- Marc Brackett — *Permission to Feel*, RULER framework, Mood Meter
- Shane Parrish — *The Great Mental Models*, inversion, second-order thinking
- Teresa Amabile — *The Progress Principle*, small wins
- Stephen Covey — *The 7 Habits*, Circle of Control
- Dr. Gail Matthews — Written goals research
- [untools.co](https://untools.co) — Thinking tools and frameworks

---

<p align="center">
  <sub>Built with Zig. Experimental.</sub>
</p>
