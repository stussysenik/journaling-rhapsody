const zpdf = @import("zpdf");
const Page = zpdf.Page;
const d = @import("../design.zig");
const c = @import("../components.zig");

/// Generates the Decision Planning worksheet.
/// Psychology: Inversion (Charlie Munger via Shane Parrish), second-order thinking,
/// Eisenhower Matrix, Venn diagrams for option comparison (untools.co).
pub fn render(page: *Page) !void {
    var y = try c.drawHeader(page, "Decision Planning");

    // The Decision
    y = try c.drawSectionHeader(page, d.content_left, y, "The decision I'm facing");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 40.0, "", 2);

    // Inversion (Shane Parrish)
    y = try c.drawSectionHeader(page, d.content_left, y, "Inversion: What would make this FAIL?");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 58.0, "Think backwards \xe2\x80\x94 avoid what guarantees failure.", 4);

    // Second-Order Thinking (3 columns)
    y = try c.drawSectionHeader(page, d.content_left, y, "Second-Order Thinking");
    y -= 2.0;
    {
        const col_w = (d.content_w - d.unit) / 3.0;
        const col_h: f32 = 65.0;
        const labels = [_][]const u8{ "Now", "In 1 month", "In 1 year" };

        for (0..3) |i| {
            const cx = d.content_left + @as(f32, @floatFromInt(i)) * (col_w + d.unit * 0.5);
            // Box
            try page.setFillColor(d.bg_fill_color.r, d.bg_fill_color.g, d.bg_fill_color.b);
            try page.fillRoundedRect(cx, y - col_h, col_w, col_h, d.corner_r);
            try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
            try page.setLineWidth(0.5);
            try page.drawRoundedRect(cx, y - col_h, col_w, col_h, d.corner_r);
            // Label
            try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
            page.setFont(.helvetica_bold, d.label_size);
            try page.drawText(cx + 8.0, y - 12.0, labels[i]);
            // Lines
            try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
            try page.setLineWidth(0.3);
            try page.drawLine(cx + 8.0, y - 24.0, cx + col_w - 8.0, y - 24.0);
            try page.drawLine(cx + 8.0, y - 37.0, cx + col_w - 8.0, y - 37.0);
            try page.drawLine(cx + 8.0, y - 50.0, cx + col_w - 8.0, y - 50.0);
        }
        y -= col_h + d.units(0.5);
    }

    // Venn Diagram
    y = try c.drawSectionHeader(page, d.content_left, y, "Compare Options");
    y -= 2.0;
    const venn_cy = y - 55.0;
    try c.drawVenn2(page, d.content_left + d.content_w * 0.5, venn_cy, 55.0, "Option A", "Option B");
    y = venn_cy - 55.0 - d.units(1.0);

    // My Decision
    y = try c.drawSectionHeader(page, d.content_left, y, "After reflection, I will:");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 40.0, "", 2);

    try c.drawFooter(page);
}
