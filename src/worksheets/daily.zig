const zpdf = @import("zpdf");
const Page = zpdf.Page;
const d = @import("../design.zig");
const c = @import("../components.zig");

/// Generates the Daily Mood Check-in worksheet (RULER Framework).
/// Psychology: Marc Brackett's Mood Meter — affect labeling reduces amygdala reactivity ~50%.
pub fn render(page: *Page) !void {
    // Header
    var y = try c.drawHeader(page, "Daily Mood Check-in");

    // Section: Mood Meter
    y = try c.drawSectionHeader(page, d.content_left, y, "How are you feeling right now?");
    y -= 4.0;

    const grid_size: f32 = 200.0;
    const grid_x = d.content_left + (d.content_w - grid_size) * 0.5;

    // Quadrant emotion words: [top-left, top-right, bottom-left, bottom-right]
    const q_words = [4][]const []const u8{
        // High Energy + Unpleasant (top-left)
        &[_][]const u8{ "Anxious", "Stressed", "Frustrated", "Overwhelmed", "Angry", "Panicked", "Agitated", "Irritated", "Restless" },
        // High Energy + Pleasant (top-right)
        &[_][]const u8{ "Excited", "Thrilled", "Inspired", "Energized", "Optimistic", "Passionate", "Elated", "Enthusiastic", "Confident" },
        // Low Energy + Unpleasant (bottom-left)
        &[_][]const u8{ "Sad", "Drained", "Lonely", "Bored", "Tired", "Numb", "Disconnected", "Melancholy", "Depleted" },
        // Low Energy + Pleasant (bottom-right)
        &[_][]const u8{ "Calm", "Content", "Grateful", "Relaxed", "Peaceful", "Serene", "Hopeful", "Comfortable", "Secure" },
    };

    y = try c.drawMoodGrid(page, grid_x, y, grid_size, q_words);

    // Section: Trigger
    y = try c.drawSectionHeader(page, d.content_left, y, "What triggered this feeling?");
    y = try c.drawLinedBox(page, d.content_left, y, d.content_w, 50.0, "", 3);

    // Body scan (right) + Regulation (left) side by side
    y = try c.drawSectionHeader(page, d.content_left, y, "Where do you feel it?");
    y += 4.0;

    // Body figure on the right
    const body_x = d.content_right - 80.0;
    const body_y = y + 5.0;
    try c.drawBodyFigure(page, body_x, body_y);

    // Regulation options on the left
    y -= d.units(0.5);
    y = try c.drawSectionHeader(page, d.content_left, y - 90.0, "What would help right now?");
    const reg_labels = [_][]const u8{ "Change thinking", "Move body", "Be mindful", "Reach out" };
    y = try c.drawCheckboxRow(page, d.content_left + 12.0, y, &reg_labels);

    // Write-in line
    y = try c.drawPromptLines(page, d.content_left + 12.0, y, d.col_major - 20.0, "Something else:", 1);

    // Footer
    try c.drawFooter(page);
}
