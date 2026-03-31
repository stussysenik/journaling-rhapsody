const zpdf = @import("zpdf");
const Page = zpdf.Page;
const d = @import("../design.zig");
const c = @import("../components.zig");

/// Generates the Weekly Reflection worksheet.
/// Psychology: Self-monitoring is the first step in behavioral change (CBT foundation).
pub fn render(page: *Page) !void {
    var y = try c.drawHeader(page, "Weekly Reflection");

    // 7-Day mini mood tracker
    y = try c.drawSectionHeader(page, d.content_left, y, "This week at a glance");
    y -= 2.0;
    const days = [_][]const u8{ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
    const box_size: f32 = 52.0;
    const gap: f32 = (d.content_w - box_size * 7.0) / 6.0;

    for (0..7) |i| {
        const bx = d.content_left + @as(f32, @floatFromInt(i)) * (box_size + gap);
        const by = y - box_size;

        // Mini 2x2 grid
        try page.setFillColor(d.bg_fill_color.r, d.bg_fill_color.g, d.bg_fill_color.b);
        try page.fillRoundedRect(bx, by, box_size, box_size, 4.0);
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setLineWidth(0.3);
        try page.drawRoundedRect(bx, by, box_size, box_size, 4.0);
        // Cross lines
        try page.drawLine(bx, by + box_size * 0.5, bx + box_size, by + box_size * 0.5);
        try page.drawLine(bx + box_size * 0.5, by, bx + box_size * 0.5, by + box_size);

        // Day label below
        try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
        page.setFont(.helvetica_bold, d.caption_size);
        const lw = zpdf.Font.helvetica_bold.textWidth(days[i], d.caption_size);
        try page.drawText(bx + (box_size - lw) * 0.5, by - 10.0, days[i]);
    }
    y -= box_size + 18.0;

    // Dominant feeling
    y = try c.drawPromptLines(page, d.content_left, y, d.content_w, "This week I felt mostly...", 1);

    // Win / Challenge dual box
    y = try c.drawSectionHeader(page, d.content_left, y, "Wins & Challenges");
    y = try c.drawDualBox(page, d.content_left, y, d.content_w, 72.0, "Biggest win:", "Biggest challenge:", 3);

    // Pattern recognition
    y = try c.drawSectionHeader(page, d.content_left, y, "Pattern Recognition");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 50.0, "What pattern do I notice in my moods this week?", 3);

    // RULER Growth
    y = try c.drawSectionHeader(page, d.content_left, y, "RULER Growth");
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica, d.body_size);
    try page.drawText(d.content_left + 12.0, y, "Which emotional skill did I practice this week?");
    y -= d.body_leading;
    const ruler = [_][]const u8{ "Recognize", "Understand", "Label", "Express", "Regulate" };
    y = try c.drawCheckboxRow(page, d.content_left + 12.0, y, &ruler);

    // Next week
    y = try c.drawPromptLines(page, d.content_left, y, d.content_w, "Next week, I want to...", 2);

    try c.drawFooter(page);
}
