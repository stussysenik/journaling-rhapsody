const zpdf = @import("zpdf");
const Page = zpdf.Page;
const d = @import("../design.zig");
const c = @import("../components.zig");

/// Generates the Goal-Setting & Vision worksheet.
/// Psychology: Written goals are 42% more likely to be achieved (Dr. Gail Matthews).
/// OKR framework from Intel/Google. "Best Possible Self" is a validated positive psychology intervention.
pub fn render(page: *Page) !void {
    var y = try c.drawHeader(page, "Goal-Setting & Vision");

    // Compelling & Audacious Goal
    y = try c.drawSectionHeader(page, d.content_left, y, "My Compelling & Audacious Goal");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 60.0, "", 3);

    // OKR Breakdown
    y = try c.drawSectionHeader(page, d.content_left, y, "OKR Breakdown");
    y -= 2.0;

    const obj_labels = [_][]const u8{ "Objective 1:", "Objective 2:", "Objective 3:" };
    for (obj_labels) |obj_label| {
        // Objective label
        try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
        page.setFont(.helvetica_bold, d.body_size);
        try page.drawText(d.content_left + 4.0, y, obj_label);

        // Objective line
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setLineWidth(0.3);
        try page.drawLine(d.content_left + 70.0, y - 1.0, d.content_right, y - 1.0);
        y -= d.body_leading * 1.2;

        // 3 Key Results
        for (0..3) |kr| {
            _ = kr;
            // Checkbox
            try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
            try page.setFillColor(d.white.r, d.white.g, d.white.b);
            try page.fillRect(d.content_left + 16.0, y - 1.0, 8.0, 8.0);
            try page.drawRect(d.content_left + 16.0, y - 1.0, 8.0, 8.0);

            // KR label
            try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
            page.setFont(.helvetica, d.body_size);
            try page.drawText(d.content_left + 28.0, y, "KR:");

            // Line
            try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
            try page.drawLine(d.content_left + 46.0, y - 1.0, d.content_right - 10.0, y - 1.0);
            y -= d.body_leading;
        }
        y -= 4.0;
    }

    // Best Possible Self
    y = try c.drawSectionHeader(page, d.content_left, y, "Best Possible Self");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 55.0, "In 90 days, if everything goes right, I will be...", 3);

    // Milestone Timeline
    y = try c.drawSectionHeader(page, d.content_left, y, "Milestone Timeline");
    y -= 6.0;
    y = try c.drawTimeline(page, d.content_left, y, d.content_w, 4);

    // Confidence Scale
    y = try c.drawScale(page, d.content_left, y, d.content_w, "Confidence:", 10);

    try c.drawFooter(page);
}
