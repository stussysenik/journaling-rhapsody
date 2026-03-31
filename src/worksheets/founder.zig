const zpdf = @import("zpdf");
const Page = zpdf.Page;
const d = @import("../design.zig");
const c = @import("../components.zig");

/// Generates the Founder Resilience worksheet.
/// Psychology: 72% of entrepreneurs face mental health challenges.
/// Cognitive reframing (CBT), Circle of Control (Covey), affect labeling.
pub fn render(page: *Page) !void {
    var y = try c.drawHeader(page, "Founder Resilience Check");

    // Imposter Syndrome Check
    y = try c.drawSectionHeader(page, d.content_left, y, "Imposter Check");
    y = try c.drawDualBox(page, d.content_left, y, d.content_w, 65.0, "The voice in my head says:", "The evidence says:", 3);

    // Vital Signs (5 scales)
    y = try c.drawSectionHeader(page, d.content_left, y, "Vital Signs");
    y = try c.drawScale(page, d.content_left, y, d.content_w, "Sleep", 10);
    y = try c.drawScale(page, d.content_left, y, d.content_w, "Focus", 10);
    y = try c.drawScale(page, d.content_left, y, d.content_w, "Energy", 10);
    y = try c.drawScale(page, d.content_left, y, d.content_w, "Motivation", 10);
    y = try c.drawScale(page, d.content_left, y, d.content_w, "Connection", 10);

    // Cognitive Reframe
    y = try c.drawSectionHeader(page, d.content_left, y, "Cognitive Reframe");
    const reframe_labels = [_][]const u8{ "The setback:", "The lesson:", "The next move:" };
    y = try c.drawConnectedBoxes(page, d.content_left, y, d.content_w, &reframe_labels);

    // Gratitude
    y = try c.drawSectionHeader(page, d.content_left, y, "Gratitude");
    y = try c.drawPromptLines(page, d.content_left, y, d.content_w, "1.", 1);
    y = try c.drawPromptLines(page, d.content_left, y, d.content_w, "2.", 1);
    y = try c.drawPromptLines(page, d.content_left, y, d.content_w, "3.", 1);

    // Circle of Control
    _ = try c.drawSectionHeader(page, d.content_left, y, "Circle of Control");
    const circle_cy = d.content_bottom + 68.0;
    try c.drawConcentricCircles(page, d.content_left + d.content_w * 0.5, circle_cy, 40.0, 62.0, "What I control", "What I can't");

    try c.drawFooter(page);
}
