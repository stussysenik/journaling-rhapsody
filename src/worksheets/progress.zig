const zpdf = @import("zpdf");
const Page = zpdf.Page;
const d = @import("../design.zig");
const c = @import("../components.zig");

/// Generates the Progress Check-in worksheet.
/// Psychology: Progress principle (Teresa Amabile, Harvard) — small wins are the strongest motivator.
pub fn render(page: *Page) !void {
    var y = try c.drawHeader(page, "Progress Check-in");

    // Goals Status (two columns)
    y = try c.drawSectionHeader(page, d.content_left, y, "Goals vs. Reality");
    y = try c.drawPairedColumns(page, d.content_left, y, d.content_w, "Goals I set:", "Where I am now:", 3);

    // Momentum Meter
    y = try c.drawSectionHeader(page, d.content_left, y, "Momentum");
    const momentum_labels = [_][]const u8{ "Stalled", "Slow", "Steady", "Fast", "Flying" };
    y = try c.drawMomentumMeter(page, d.content_left, y, d.content_w, &momentum_labels);

    // Blockers
    y = try c.drawSectionHeader(page, d.content_left, y, "Blockers");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 50.0, "What's blocking me?", 3);

    // One Action
    y = try c.drawSectionHeader(page, d.content_left, y, "One Move");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 50.0, "One thing I can do TODAY to move forward:", 2);

    // Support
    y = try c.drawPromptLines(page, d.content_left, y, d.content_w, "Who can help?", 3);

    // Progress Venn (3-circle)
    _ = try c.drawSectionHeader(page, d.content_left, y, "Progress Map");
    const venn_cy = d.content_bottom + 65.0;
    try c.drawVenn3(page, d.content_left + d.content_w * 0.5, venn_cy, 45.0, .{ "Planned", "Did", "Learned" });

    try c.drawFooter(page);
}
