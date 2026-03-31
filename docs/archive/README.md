# Worksheet Archive

**Append-only. Never delete items.**

This archive documents every worksheet version ever shipped. Entries are immutable — new versions are added, old versions are never removed. This is the blackbox record.

---

## v0.1.0 — 2026-03-31

### Daily Mood Check-in
- **File**: `src/worksheets/daily.zig`
- **Framework**: RULER (Marc Brackett, Yale Center for Emotional Intelligence)
- **Components**: 2x2 Mood Meter (36 emotions across 4 quadrants), trigger prompt (3 lines), geometric body scan figure with 5 annotation points, 4 regulation options (Change thinking / Move body / Be mindful / Reach out)
- **Quadrant words**:
  - High Energy + Unpleasant: Anxious, Stressed, Frustrated, Overwhelmed, Angry, Panicked, Agitated, Irritated, Restless
  - High Energy + Pleasant: Excited, Thrilled, Inspired, Energized, Optimistic, Passionate, Elated, Enthusiastic, Confident
  - Low Energy + Unpleasant: Sad, Drained, Lonely, Bored, Tired, Numb, Disconnected, Melancholy, Depleted
  - Low Energy + Pleasant: Calm, Content, Grateful, Relaxed, Peaceful, Serene, Hopeful, Comfortable, Secure
- **PDF size**: 8,239 bytes

### Weekly Reflection
- **File**: `src/worksheets/weekly.zig`
- **Framework**: CBT self-monitoring, RULER emotional skills
- **Components**: 7-day mini mood grid tracker (Mon-Sun), dominant feeling line, dual golden-ratio boxes (win/challenge), pattern recognition (3 lines), RULER growth checkboxes (Recognize, Understand, Label, Express, Regulate), next-week intention
- **PDF size**: 11,516 bytes

### Goal-Setting & Vision
- **File**: `src/worksheets/goals.zig`
- **Framework**: OKRs (Intel/Google), Best Possible Self (positive psychology intervention), Dr. Gail Matthews goal research
- **Components**: Compelling & Audacious Goal box, 3-objective OKR breakdown with 3 key results each (9 KRs total), 90-day visualization prompt, horizontal milestone timeline (4 checkpoints), confidence scale 1-10
- **PDF size**: 14,284 bytes

### Decision Planning
- **File**: `src/worksheets/decide.zig`
- **Framework**: Inversion (Charlie Munger via Shane Parrish), second-order thinking, Eisenhower Matrix, Venn comparison (untools.co)
- **Components**: Decision statement box, inversion prompt (4 lines), 3-column second-order thinking (Now / 1 month / 1 year), 2-circle Venn diagram (Option A / Option B / Both), decision conclusion box
- **PDF size**: 8,653 bytes
- **Note**: Eisenhower Matrix removed from v0.1.0 to fit page — planned for v0.2.0 as separate Decision Matrix worksheet

### Founder Resilience Check
- **File**: `src/worksheets/founder.zig`
- **Framework**: CBT cognitive reframing, Circle of Control (Stephen Covey), founder psychology research (72% of entrepreneurs face mental health challenges)
- **Components**: Imposter syndrome dual box (voice vs evidence), 5 vital sign scales 1-10 (Sleep, Focus, Energy, Motivation, Connection), cognitive reframe chain (setback -> lesson -> next move), gratitude (3 lines), concentric Circle of Control
- **PDF size**: 33,552 bytes

### Progress Check-in
- **File**: `src/worksheets/progress.zig`
- **Framework**: Progress Principle (Teresa Amabile, Harvard), accountability structures
- **Components**: Paired columns (goals set vs current state, 3 rows), 5-point momentum meter (Stalled, Slow, Steady, Fast, Flying), blockers box (3 lines), one-action box, support lines (3), 3-circle Venn diagram (Planned / Did / Learned)
- **PDF size**: 8,670 bytes

---

## Archive Rules

1. **Never delete** — entries are permanent
2. **Never modify** — add corrections as new entries below the original
3. **Version tag** — every entry belongs to a release version
4. **Include byte sizes** — PDF output sizes are part of the record
5. **Include frameworks** — psychology references are part of the record
6. **Include component lists** — exact visual elements shipped
