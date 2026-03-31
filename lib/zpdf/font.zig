const std = @import("std");

/// Built-in PDF base fonts with approximate Helvetica character widths.
/// Widths are stored in standard PDF units (1/1000 of the em square).
pub const Font = enum {
    helvetica,
    helvetica_bold,
    helvetica_oblique,

    /// Returns the PostScript font name used in PDF font dictionaries.
    pub fn pdfName(self: Font) []const u8 {
        return switch (self) {
            .helvetica => "Helvetica",
            .helvetica_bold => "Helvetica-Bold",
            .helvetica_oblique => "Helvetica-Oblique",
        };
    }

    /// Returns the resource name used in content streams (e.g. /F1).
    pub fn resourceName(self: Font) []const u8 {
        return switch (self) {
            .helvetica => "/F1",
            .helvetica_bold => "/F2",
            .helvetica_oblique => "/F3",
        };
    }

    /// Returns the width of a single character at the given font size, in points.
    pub fn charWidth(self: Font, char: u8, size: f32) f32 {
        const base_width: f32 = getHelveticaWidth(char);
        const multiplier: f32 = switch (self) {
            .helvetica => 1.0,
            .helvetica_bold => 1.05,
            .helvetica_oblique => 1.0,
        };
        // Width in 1/1000 em units -> points at given size
        return base_width * multiplier * size / 1000.0;
    }

    /// Returns the total width of a text string at the given font size, in points.
    pub fn textWidth(self: Font, text: []const u8, size: f32) f32 {
        var total: f32 = 0;
        for (text) |ch| {
            total += self.charWidth(ch, size);
        }
        return total;
    }
};

/// Approximate Helvetica character widths in 1/1000 em units.
/// These are the standard AFM widths for Helvetica (Adobe's metrics).
fn getHelveticaWidth(char: u8) f32 {
    return switch (char) {
        // Space
        ' ' => 278,
        // Uppercase letters
        'A' => 722,
        'B' => 722,
        'C' => 722,
        'D' => 722,
        'E' => 667,
        'F' => 611,
        'G' => 778,
        'H' => 722,
        'I' => 278,
        'J' => 556,
        'K' => 722,
        'L' => 611,
        'M' => 833,
        'N' => 722,
        'O' => 778,
        'P' => 667,
        'Q' => 778,
        'R' => 722,
        'S' => 667,
        'T' => 611,
        'U' => 722,
        'V' => 667,
        'W' => 944,
        'X' => 667,
        'Y' => 667,
        'Z' => 611,
        // Lowercase letters
        'a' => 556,
        'b' => 611,
        'c' => 556,
        'd' => 611,
        'e' => 556,
        'f' => 333,
        'g' => 611,
        'h' => 611,
        'i' => 278,
        'j' => 278,
        'k' => 556,
        'l' => 278,
        'm' => 889,
        'n' => 611,
        'o' => 611,
        'p' => 611,
        'q' => 611,
        'r' => 389,
        's' => 556,
        't' => 333,
        'u' => 611,
        'v' => 556,
        'w' => 778,
        'x' => 556,
        'y' => 556,
        'z' => 500,
        // Digits
        '0'...'9' => 556,
        // Common punctuation
        '.' => 278,
        ',' => 278,
        ':' => 333,
        ';' => 333,
        '?' => 611,
        '!' => 333,
        '-' => 333,
        '/' => 278,
        '(' => 333,
        ')' => 333,
        '\'' => 278,
        '"' => 474,
        // Fallback for any other character
        else => 556,
    };
}
