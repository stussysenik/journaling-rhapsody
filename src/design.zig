/// Design system constants — John Maeda "Laws of Simplicity"
/// All spacing derives from an 18pt base unit. Golden ratio drives proportions.

/// Base unit: 18pt (0.25 inch)
pub const unit: f32 = 18.0;

/// Page dimensions (US Letter)
pub const page_w: f32 = 612.0;
pub const page_h: f32 = 792.0;

/// Margins: 4 units = 72pt = 1 inch
pub const margin: f32 = 72.0;

/// Content area
pub const content_w: f32 = page_w - 2 * margin; // 468pt
pub const content_h: f32 = page_h - 2 * margin; // 648pt

/// Golden ratio
pub const phi: f32 = 1.618;
pub const col_major: f32 = content_w * (phi / (1.0 + phi)); // ~289pt
pub const col_minor: f32 = content_w - col_major; // ~179pt
pub const col_gap: f32 = unit; // 18pt gap between columns

/// Typography sizes
pub const title_size: f32 = 22.0;
pub const section_size: f32 = 12.0;
pub const body_size: f32 = 9.5;
pub const caption_size: f32 = 7.5;
pub const label_size: f32 = 8.0;

/// Leading (line spacing)
pub const title_leading: f32 = 28.0;
pub const section_leading: f32 = 16.0;
pub const body_leading: f32 = 13.0;
pub const caption_leading: f32 = 10.0;

/// Colors (RGB 0-1)
pub const Color = struct { r: f32, g: f32, b: f32 };

pub const text_color = Color{ .r = 0.10, .g = 0.10, .b = 0.10 };
pub const grid_color = Color{ .r = 0.88, .g = 0.88, .b = 0.88 };
pub const divider_color = Color{ .r = 0.80, .g = 0.80, .b = 0.80 };
pub const caption_color = Color{ .r = 0.50, .g = 0.50, .b = 0.50 };
pub const accent_color = Color{ .r = 0.83, .g = 0.63, .b = 0.09 };
pub const bg_fill_color = Color{ .r = 0.96, .g = 0.96, .b = 0.96 };
pub const white = Color{ .r = 1.0, .g = 1.0, .b = 1.0 };

/// Rounded corner radius
pub const corner_r: f32 = 6.0;

/// Spacing helpers
pub fn units(n: f32) f32 {
    return n * unit;
}

/// Content area top (PDF coords: bottom-left origin)
pub const content_top: f32 = page_h - margin;
pub const content_bottom: f32 = margin;
pub const content_left: f32 = margin;
pub const content_right: f32 = page_w - margin;
