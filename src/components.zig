const zpdf = @import("zpdf");
const Page = zpdf.Page;
const Font = zpdf.Font;
const d = @import("design.zig");

// =============================================================
// Page header: title left, date box right
// =============================================================
pub fn drawHeader(page: *Page, title: []const u8) !f32 {
    const y = d.content_top - d.title_size;

    // Title
    try page.setStrokeColor(d.text_color.r, d.text_color.g, d.text_color.b);
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.title_size);
    try page.drawText(d.content_left, y, title);

    // Date box (right-aligned)
    const box_w: f32 = 120.0;
    const box_h: f32 = 22.0;
    const box_x = d.content_right - box_w;
    const box_y = y - 4.0;
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setFillColor(d.bg_fill_color.r, d.bg_fill_color.g, d.bg_fill_color.b);
    try page.fillRoundedRect(box_x, box_y, box_w, box_h, 4.0);
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.drawRoundedRect(box_x, box_y, box_w, box_h, 4.0);
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_oblique, d.caption_size);
    try page.drawText(box_x + 8.0, box_y + 7.0, "Date: ___/___/______");

    // Divider line below header
    const div_y = y - d.unit;
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.5);
    try page.drawLine(d.content_left, div_y, d.content_right, div_y);

    return div_y - d.units(0.5);
}

// =============================================================
// Section header with accent dot
// =============================================================
pub fn drawSectionHeader(page: *Page, x: f32, y: f32, title: []const u8) !f32 {
    // Accent dot
    try page.setFillColor(d.accent_color.r, d.accent_color.g, d.accent_color.b);
    try page.fillCircle(x + 4.0, y + d.section_size * 0.35, 3.0);

    // Title text
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.section_size);
    try page.drawText(x + 12.0, y, title);

    return y - d.section_leading;
}

// =============================================================
// Lined box: gray rounded rect with prompt text and ruled lines
// =============================================================
pub fn drawLinedBox(page: *Page, x: f32, y: f32, w: f32, h: f32, prompt: []const u8, num_lines: u32) !f32 {
    // Background
    try page.setFillColor(d.bg_fill_color.r, d.bg_fill_color.g, d.bg_fill_color.b);
    try page.fillRoundedRect(x, y - h, w, h, d.corner_r);
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.5);
    try page.drawRoundedRect(x, y - h, w, h, d.corner_r);

    // Prompt text
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    try page.drawText(x + 10.0, y - 14.0, prompt);

    // Ruled lines
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.3);
    const line_start_y = y - 28.0;
    const usable_h = h - 36.0;
    const line_spacing = if (num_lines > 0) usable_h / @as(f32, @floatFromInt(num_lines)) else d.body_leading;

    for (0..num_lines) |i| {
        const ly = line_start_y - @as(f32, @floatFromInt(i)) * line_spacing;
        try page.drawLine(x + 10.0, ly, x + w - 10.0, ly);
    }

    return y - h - d.units(0.4);
}

// =============================================================
// Simple prompt with ruled lines (no box)
// =============================================================
pub fn drawPromptLines(page: *Page, x: f32, y: f32, w: f32, prompt: []const u8, num_lines: u32) !f32 {
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    try page.drawText(x, y, prompt);

    var ly = y - d.body_leading - 2.0;
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.3);
    for (0..num_lines) |_| {
        try page.drawLine(x, ly, x + w, ly);
        ly -= d.body_leading;
    }

    return ly - d.units(0.3);
}

// =============================================================
// Scale: numbered dots to circle (1 to max)
// =============================================================
pub fn drawScale(page: *Page, x: f32, y: f32, w: f32, label: []const u8, max: u32) !f32 {
    // Label
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    try page.drawText(x, y, label);

    // Dots
    const dot_area_x = x + 160.0;
    const dot_area_w = w - 160.0;
    const spacing = dot_area_w / @as(f32, @floatFromInt(max));

    for (0..max) |i| {
        const cx = dot_area_x + @as(f32, @floatFromInt(i)) * spacing + spacing * 0.5;
        const cy = y + d.body_size * 0.3;

        // Circle
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setFillColor(d.white.r, d.white.g, d.white.b);
        try page.setLineWidth(0.5);
        try page.fillCircle(cx, cy, 7.0);
        try page.drawCircle(cx, cy, 7.0);

        // Number
        try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
        page.setFont(.helvetica, d.label_size);
        var buf: [4]u8 = undefined;
        const num_str = std.fmt.bufPrint(&buf, "{d}", .{i + 1}) catch "?";
        const num_w = Font.helvetica.textWidth(num_str, d.label_size);
        try page.drawText(cx - num_w * 0.5, cy - d.label_size * 0.35, num_str);
    }

    return y - d.units(1.2);
}

// =============================================================
// Labeled scale with text endpoints
// =============================================================
pub fn drawLabeledScale(page: *Page, x: f32, y: f32, w: f32, label: []const u8, max: u32, low_label: []const u8, high_label: []const u8) !f32 {
    const result = try drawScale(page, x, y, w, label, max);

    // Low/high labels
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_oblique, d.caption_size);
    try page.drawText(x + 160.0, y - d.body_leading, low_label);
    const hw = Font.helvetica_oblique.textWidth(high_label, d.caption_size);
    try page.drawText(x + w - hw, y - d.body_leading, high_label);

    return result;
}

// =============================================================
// Checkbox row
// =============================================================
pub fn drawCheckboxRow(page: *Page, x: f32, y: f32, labels: []const []const u8) !f32 {
    var cx = x;
    for (labels) |label| {
        // Checkbox square
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setFillColor(d.white.r, d.white.g, d.white.b);
        try page.setLineWidth(0.5);
        try page.fillRect(cx, y - 1.0, 10.0, 10.0);
        try page.drawRect(cx, y - 1.0, 10.0, 10.0);

        // Label
        try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
        page.setFont(.helvetica, d.body_size);
        try page.drawText(cx + 13.0, y, label);

        const lw = Font.helvetica.textWidth(label, d.body_size);
        cx += 13.0 + lw + 14.0;
    }
    return y - d.units(1.0);
}

// =============================================================
// Mood grid: 2x2 with emotion words
// =============================================================
pub fn drawMoodGrid(page: *Page, x: f32, y: f32, size: f32, quadrant_words: [4][]const []const u8) !f32 {
    const half = size * 0.5;

    // Background fills per quadrant (subtle tints)
    const q_colors = [4]d.Color{
        .{ .r = 0.98, .g = 0.93, .b = 0.93 }, // top-left: high energy unpleasant (warm red tint)
        .{ .r = 0.93, .g = 0.98, .b = 0.93 }, // top-right: high energy pleasant (green tint)
        .{ .r = 0.93, .g = 0.93, .b = 0.98 }, // bottom-left: low energy unpleasant (blue tint)
        .{ .r = 0.98, .g = 0.97, .b = 0.93 }, // bottom-right: low energy pleasant (warm yellow tint)
    };

    // Fill quadrants
    // Top-left
    try page.setFillColor(q_colors[0].r, q_colors[0].g, q_colors[0].b);
    try page.fillRect(x, y - half, half, half);
    // Top-right
    try page.setFillColor(q_colors[1].r, q_colors[1].g, q_colors[1].b);
    try page.fillRect(x + half, y - half, half, half);
    // Bottom-left
    try page.setFillColor(q_colors[2].r, q_colors[2].g, q_colors[2].b);
    try page.fillRect(x, y - size, half, half);
    // Bottom-right
    try page.setFillColor(q_colors[3].r, q_colors[3].g, q_colors[3].b);
    try page.fillRect(x + half, y - size, half, half);

    // Grid lines
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.8);
    try page.drawRect(x, y - size, size, size);
    try page.drawLine(x, y - half, x + size, y - half); // horizontal midline
    try page.drawLine(x + half, y, x + half, y - size); // vertical midline

    // Axis labels
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_oblique, d.caption_size);
    // Y-axis
    try page.drawText(x - 16.0, y - half * 0.5, "HIGH");
    try page.drawText(x - 14.0, y - half * 1.5, "LOW");
    // X-axis
    try page.drawText(x + half * 0.35, y - size - 10.0, "UNPLEASANT");
    try page.drawText(x + half * 1.35, y - size - 10.0, "PLEASANT");
    // Top label
    page.setFont(.helvetica_bold, d.caption_size);
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    try page.drawText(x + half * 0.5 - 15.0, y + 4.0, "ENERGY");

    // Words in each quadrant
    const positions = [4][2]f32{
        .{ x + 8.0, y - 10.0 }, // top-left
        .{ x + half + 8.0, y - 10.0 }, // top-right
        .{ x + 8.0, y - half - 10.0 }, // bottom-left
        .{ x + half + 8.0, y - half - 10.0 }, // bottom-right
    };

    page.setFont(.helvetica, 7.5);
    for (0..4) |q| {
        const words = quadrant_words[q];
        const bx = positions[q][0];
        var wy = positions[q][1];
        try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
        for (words) |word| {
            try page.drawText(bx, wy, word);
            wy -= 11.0;
        }
    }

    return y - size - d.units(1.0);
}

// =============================================================
// Two-circle Venn diagram
// =============================================================
pub fn drawVenn2(page: *Page, cx: f32, cy: f32, r: f32, label_a: []const u8, label_b: []const u8) !void {
    const offset = r * 0.6;

    // Circle A (left)
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.8);
    try page.drawCircle(cx - offset, cy, r);

    // Circle B (right)
    try page.drawCircle(cx + offset, cy, r);

    // Labels
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    const wa = Font.helvetica_bold.textWidth(label_a, d.body_size);
    try page.drawText(cx - offset - wa * 0.5, cy + r + 8.0, label_a);
    const wb = Font.helvetica_bold.textWidth(label_b, d.body_size);
    try page.drawText(cx + offset - wb * 0.5, cy + r + 8.0, label_b);

    // "Both" label in overlap
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_oblique, d.caption_size);
    try page.drawText(cx - 10.0, cy, "Both");

    // Write-in lines in each zone
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.3);
    // Left zone
    for (0..3) |i| {
        const ly = cy - 10.0 - @as(f32, @floatFromInt(i)) * 12.0;
        try page.drawLine(cx - offset - r * 0.55, ly, cx - offset + r * 0.3, ly);
    }
    // Right zone
    for (0..3) |i| {
        const ly = cy - 10.0 - @as(f32, @floatFromInt(i)) * 12.0;
        try page.drawLine(cx + offset - r * 0.3, ly, cx + offset + r * 0.55, ly);
    }
}

// =============================================================
// Three-circle Venn diagram
// =============================================================
pub fn drawVenn3(page: *Page, cx: f32, cy: f32, r: f32, labels: [3][]const u8) !void {
    const offset = r * 0.55;

    // Three circles in triangular arrangement
    const centers = [3][2]f32{
        .{ cx, cy + offset * 0.6 }, // top
        .{ cx - offset, cy - offset * 0.4 }, // bottom-left
        .{ cx + offset, cy - offset * 0.4 }, // bottom-right
    };

    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.8);
    for (centers) |c| {
        try page.drawCircle(c[0], c[1], r);
    }

    // Labels outside each circle
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    for (labels, 0..) |label, i| {
        const lw = Font.helvetica_bold.textWidth(label, d.body_size);
        const lx = centers[i][0] - lw * 0.5;
        const ly = if (i == 0) centers[i][1] + r + 8.0 else centers[i][1] - r - 8.0;
        try page.drawText(lx, ly, label);
    }
}

// =============================================================
// Eisenhower Matrix (2x2)
// =============================================================
pub fn drawEisenhower(page: *Page, x: f32, y: f32, size: f32) !f32 {
    const half = size * 0.5;

    // Grid
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.8);
    try page.drawRect(x, y - size, size, size);
    try page.drawLine(x, y - half, x + size, y - half);
    try page.drawLine(x + half, y, x + half, y - size);

    // Quadrant labels
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_bold, d.caption_size);
    try page.drawText(x + 6.0, y - 10.0, "URGENT + IMPORTANT");
    try page.drawText(x + half + 6.0, y - 10.0, "NOT URGENT + IMPORTANT");
    try page.drawText(x + 6.0, y - half - 10.0, "URGENT + NOT IMPORTANT");
    try page.drawText(x + half + 6.0, y - half - 10.0, "NEITHER");

    // Axis labels
    page.setFont(.helvetica_oblique, d.caption_size);
    try page.drawText(x + half * 0.5 - 15.0, y + 5.0, "URGENT");
    try page.drawText(x + half * 1.5 - 20.0, y + 5.0, "NOT URGENT");
    try page.drawText(x - 8.0, y - half * 0.5 + 3.0, "I");
    try page.drawText(x - 8.0, y - half * 1.5 + 3.0, "N");

    // Write-in lines per quadrant
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.3);
    const offsets_x = [2]f32{ x + 8.0, x + half + 8.0 };
    const offsets_y = [2]f32{ y - 22.0, y - half - 22.0 };
    for (offsets_y) |oy| {
        for (offsets_x) |ox| {
            for (0..3) |i| {
                const ly = oy - @as(f32, @floatFromInt(i)) * 14.0;
                try page.drawLine(ox, ly, ox + half - 16.0, ly);
            }
        }
    }

    return y - size - d.units(0.5);
}

// =============================================================
// Timeline with circle checkpoints
// =============================================================
pub fn drawTimeline(page: *Page, x: f32, y: f32, w: f32, num_points: u32) !f32 {
    const r: f32 = 8.0;

    // Main line
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(1.0);
    try page.drawLine(x, y, x + w, y);

    // Checkpoint circles
    const spacing = w / @as(f32, @floatFromInt(num_points + 1));
    for (0..num_points) |i| {
        const cx = x + spacing * @as(f32, @floatFromInt(i + 1));
        try page.setFillColor(d.white.r, d.white.g, d.white.b);
        try page.fillCircle(cx, y, r);
        try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
        try page.drawCircle(cx, y, r);

        // Write-in line below each
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setLineWidth(0.3);
        try page.drawLine(cx - 30.0, y - 22.0, cx + 30.0, y - 22.0);

        // Date label
        try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
        page.setFont(.helvetica_oblique, d.caption_size);
        try page.drawText(cx - 12.0, y - 32.0, "date:");
    }

    return y - d.units(2.5);
}

// =============================================================
// Connected boxes with arrows (e.g., setback → lesson → next move)
// =============================================================
pub fn drawConnectedBoxes(page: *Page, x: f32, y: f32, w: f32, labels: []const []const u8) !f32 {
    const n = labels.len;
    if (n == 0) return y;
    const box_h: f32 = 55.0;
    const arrow_gap: f32 = 20.0;
    const box_w = (w - arrow_gap * @as(f32, @floatFromInt(n - 1))) / @as(f32, @floatFromInt(n));

    for (0..n) |i| {
        const bx = x + @as(f32, @floatFromInt(i)) * (box_w + arrow_gap);

        // Box
        try page.setFillColor(d.bg_fill_color.r, d.bg_fill_color.g, d.bg_fill_color.b);
        try page.fillRoundedRect(bx, y - box_h, box_w, box_h, d.corner_r);
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setLineWidth(0.5);
        try page.drawRoundedRect(bx, y - box_h, box_w, box_h, d.corner_r);

        // Label
        try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
        page.setFont(.helvetica_bold, d.label_size);
        try page.drawText(bx + 8.0, y - 12.0, labels[i]);

        // Lines inside box
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setLineWidth(0.3);
        try page.drawLine(bx + 8.0, y - 24.0, bx + box_w - 8.0, y - 24.0);
        try page.drawLine(bx + 8.0, y - 37.0, bx + box_w - 8.0, y - 37.0);

        // Arrow to next box
        if (i < n - 1) {
            const arrow_x = bx + box_w + 2.0;
            const arrow_y = y - box_h * 0.5;
            try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
            try page.setLineWidth(1.0);
            try page.drawLine(arrow_x, arrow_y, arrow_x + arrow_gap - 6.0, arrow_y);
            // Arrowhead
            try page.drawLine(arrow_x + arrow_gap - 10.0, arrow_y + 3.0, arrow_x + arrow_gap - 6.0, arrow_y);
            try page.drawLine(arrow_x + arrow_gap - 10.0, arrow_y - 3.0, arrow_x + arrow_gap - 6.0, arrow_y);
        }
    }

    return y - box_h - d.units(0.5);
}

// =============================================================
// Concentric circles (Circle of Control)
// =============================================================
pub fn drawConcentricCircles(page: *Page, cx: f32, cy: f32, r_inner: f32, r_outer: f32, label_inner: []const u8, label_outer: []const u8) !void {
    // Outer circle
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.8);
    try page.drawCircle(cx, cy, r_outer);

    // Inner circle
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(1.0);
    try page.drawCircle(cx, cy, r_inner);

    // Labels
    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_bold, d.caption_size);
    const iw = Font.helvetica_bold.textWidth(label_inner, d.caption_size);
    try page.drawText(cx - iw * 0.5, cy + r_inner - 14.0, label_inner);
    const ow = Font.helvetica_bold.textWidth(label_outer, d.caption_size);
    try page.drawText(cx - ow * 0.5, cy + r_outer - 10.0, label_outer);
}

// =============================================================
// Geometric body figure (body scan)
// =============================================================
pub fn drawBodyFigure(page: *Page, x: f32, y: f32) !void {
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.8);

    // Head (circle)
    try page.drawCircle(x, y, 12.0);
    // Neck
    try page.drawLine(x, y - 12.0, x, y - 18.0);
    // Torso (rectangle)
    try page.drawRect(x - 18.0, y - 60.0, 36.0, 42.0);
    // Arms
    try page.drawLine(x - 18.0, y - 22.0, x - 38.0, y - 48.0);
    try page.drawLine(x + 18.0, y - 22.0, x + 38.0, y - 48.0);
    // Legs
    try page.drawLine(x - 10.0, y - 60.0, x - 20.0, y - 90.0);
    try page.drawLine(x + 10.0, y - 60.0, x + 20.0, y - 90.0);

    // Annotation lines (5 points: head, chest, stomach, hands, feet)
    const points = [5][2]f32{
        .{ x + 14.0, y }, // head
        .{ x + 20.0, y - 30.0 }, // chest
        .{ x + 20.0, y - 50.0 }, // stomach
        .{ x - 40.0, y - 48.0 }, // left hand
        .{ x + 22.0, y - 90.0 }, // feet
    };
    const line_labels = [5][]const u8{ "Head", "Chest", "Stomach", "Hands", "Feet" };

    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.3);

    for (0..5) |i| {
        const px = points[i][0];
        const py = points[i][1];
        const lx = if (i == 3) px - 60.0 else px + 20.0;
        try page.drawLine(px, py, lx, py);
        try page.drawLine(lx, py, lx + 40.0, py);

        // Label
        try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
        page.setFont(.helvetica_oblique, d.caption_size);
        try page.drawText(lx + 2.0, py + 3.0, line_labels[i]);
    }
}

// =============================================================
// Footer: experimental disclaimer
// =============================================================
pub fn drawFooter(page: *Page) !void {
    const footer_y = d.content_bottom - d.units(0.5);
    try page.setStrokeColor(d.divider_color.r, d.divider_color.g, d.divider_color.b);
    try page.setLineWidth(0.3);
    try page.drawLine(d.content_left, footer_y + 10.0, d.content_right, footer_y + 10.0);

    try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
    page.setFont(.helvetica_oblique, 6.5);
    const disclaimer = "FOR EXPERIMENTAL PURPOSES ONLY \xe2\x80\x94 NOT A SUBSTITUTE FOR PROFESSIONAL MENTAL HEALTH CARE";
    const tw = Font.helvetica_oblique.textWidth(disclaimer, 6.5);
    try page.drawText(d.content_left + (d.content_w - tw) * 0.5, footer_y, disclaimer);
}

// =============================================================
// Two equal columns with labels and boxes
// =============================================================
pub fn drawDualBox(page: *Page, x: f32, y: f32, w: f32, h: f32, label_a: []const u8, label_b: []const u8, lines_per: u32) !f32 {
    const gap: f32 = d.unit * 0.5;
    const box_w = (w - gap) * 0.5;

    // Box A
    _ = try drawLinedBox(page, x, y, box_w, h, label_a, lines_per);

    // Box B
    _ = try drawLinedBox(page, x + box_w + gap, y, box_w, h, label_b, lines_per);

    return y - h - d.units(0.4);
}

// =============================================================
// Momentum meter (labeled points)
// =============================================================
pub fn drawMomentumMeter(page: *Page, x: f32, y: f32, w: f32, labels: []const []const u8) !f32 {
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    try page.drawText(x, y, "Momentum:");

    const n = labels.len;
    const meter_x = x + 75.0;
    const meter_w = w - 75.0;
    const spacing = meter_w / @as(f32, @floatFromInt(n));

    for (0..n) |i| {
        const cx = meter_x + @as(f32, @floatFromInt(i)) * spacing + spacing * 0.5;
        const cy = y + d.body_size * 0.3;

        // Circle
        try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
        try page.setFillColor(d.white.r, d.white.g, d.white.b);
        try page.setLineWidth(0.5);
        try page.fillCircle(cx, cy, 8.0);
        try page.drawCircle(cx, cy, 8.0);

        // Label below
        try page.setFillColor(d.caption_color.r, d.caption_color.g, d.caption_color.b);
        page.setFont(.helvetica, d.caption_size);
        const lw = Font.helvetica.textWidth(labels[i], d.caption_size);
        try page.drawText(cx - lw * 0.5, cy - 18.0, labels[i]);
    }

    return y - d.units(2.0);
}

// =============================================================
// Two-column paired rows
// =============================================================
pub fn drawPairedColumns(page: *Page, x: f32, y: f32, w: f32, label_a: []const u8, label_b: []const u8, num_rows: u32) !f32 {
    const half_w = (w - d.unit) * 0.5;

    // Column headers
    try page.setFillColor(d.text_color.r, d.text_color.g, d.text_color.b);
    page.setFont(.helvetica_bold, d.body_size);
    try page.drawText(x, y, label_a);
    try page.drawText(x + half_w + d.unit, y, label_b);

    // Rows
    var row_y = y - d.body_leading - 2.0;
    try page.setStrokeColor(d.grid_color.r, d.grid_color.g, d.grid_color.b);
    try page.setLineWidth(0.3);

    for (0..num_rows) |_| {
        try page.drawLine(x, row_y, x + half_w, row_y);
        try page.drawLine(x + half_w + d.unit, row_y, x + w, row_y);
        row_y -= d.body_leading * 1.5;
    }

    return row_y - d.units(0.3);
}

const std = @import("std");
