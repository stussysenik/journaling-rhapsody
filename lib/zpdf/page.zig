const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const Font = @import("font.zig").Font;

/// Kappa constant for approximating circular arcs with cubic Bezier curves.
/// Four curves with this control-point offset produce a near-perfect circle.
const KAPPA: f32 = 0.5522847498;

/// A single page in a PDF document. Accumulates drawing commands into a
/// PDF content stream using standard PDF operators.
pub const Page = struct {
    content: ArrayList(u8),
    allocator: Allocator,
    width: f32,
    height: f32,
    current_font: Font,
    current_font_size: f32,

    pub fn init(allocator: Allocator) Page {
        return .{
            .content = .{},
            .allocator = allocator,
            .width = 612.0, // US Letter width in points
            .height = 792.0, // US Letter height in points
            .current_font = .helvetica,
            .current_font_size = 12.0,
        };
    }

    pub fn deinit(self: *Page) void {
        self.content.deinit(self.allocator);
    }

    // ---------------------------------------------------------------
    // Text
    // ---------------------------------------------------------------

    /// Sets the current font and size for subsequent text drawing.
    pub fn setFont(self: *Page, font: Font, size: f32) void {
        self.current_font = font;
        self.current_font_size = size;
    }

    /// Draws a text string at (x, y) using the current font and size.
    /// Coordinates follow PDF convention: origin at bottom-left, y increases upward.
    pub fn drawText(self: *Page, x: f32, y: f32, text: []const u8) !void {
        try self.appendFmt("BT\n", .{});
        try self.appendFmt("{s} {d:.2} Tf\n", .{ self.current_font.resourceName(), self.current_font_size });
        try self.appendFmt("{d:.2} {d:.2} Td\n", .{ x, y });
        try self.appendByte('(');
        // Escape special PDF string characters
        for (text) |ch| {
            switch (ch) {
                '\\' => {
                    try self.appendByte('\\');
                    try self.appendByte('\\');
                },
                '(' => {
                    try self.appendByte('\\');
                    try self.appendByte('(');
                },
                ')' => {
                    try self.appendByte('\\');
                    try self.appendByte(')');
                },
                else => try self.appendByte(ch),
            }
        }
        try self.appendFmt(") Tj\n", .{});
        try self.appendFmt("ET\n", .{});
    }

    // ---------------------------------------------------------------
    // Color and line width
    // ---------------------------------------------------------------

    /// Sets the stroke (outline) color in RGB, each component 0.0 to 1.0.
    pub fn setStrokeColor(self: *Page, r: f32, g: f32, b: f32) !void {
        try self.appendFmt("{d:.3} {d:.3} {d:.3} RG\n", .{ r, g, b });
    }

    /// Sets the fill color in RGB, each component 0.0 to 1.0.
    pub fn setFillColor(self: *Page, r: f32, g: f32, b: f32) !void {
        try self.appendFmt("{d:.3} {d:.3} {d:.3} rg\n", .{ r, g, b });
    }

    /// Sets the line width for subsequent stroke operations.
    pub fn setLineWidth(self: *Page, w: f32) !void {
        try self.appendFmt("{d:.2} w\n", .{w});
    }

    // ---------------------------------------------------------------
    // Line
    // ---------------------------------------------------------------

    /// Draws a stroked line from (x1, y1) to (x2, y2).
    pub fn drawLine(self: *Page, x1: f32, y1: f32, x2: f32, y2: f32) !void {
        try self.appendFmt("{d:.2} {d:.2} m\n", .{ x1, y1 });
        try self.appendFmt("{d:.2} {d:.2} l\n", .{ x2, y2 });
        try self.appendFmt("S\n", .{});
    }

    // ---------------------------------------------------------------
    // Rectangle
    // ---------------------------------------------------------------

    /// Draws a stroked rectangle.
    pub fn drawRect(self: *Page, x: f32, y: f32, w: f32, h: f32) !void {
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} re\n", .{ x, y, w, h });
        try self.appendFmt("S\n", .{});
    }

    /// Draws a filled rectangle (no stroke).
    pub fn fillRect(self: *Page, x: f32, y: f32, w: f32, h: f32) !void {
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} re\n", .{ x, y, w, h });
        try self.appendFmt("f\n", .{});
    }

    /// Draws a rectangle that is both filled and stroked.
    pub fn strokeAndFillRect(self: *Page, x: f32, y: f32, w: f32, h: f32) !void {
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} re\n", .{ x, y, w, h });
        try self.appendFmt("B\n", .{});
    }

    // ---------------------------------------------------------------
    // Rounded rectangle
    // ---------------------------------------------------------------

    /// Draws a stroked rounded rectangle.
    pub fn drawRoundedRect(self: *Page, x: f32, y: f32, w: f32, h: f32, radius: f32) !void {
        try self.buildRoundedRectPath(x, y, w, h, radius);
        try self.appendFmt("S\n", .{});
    }

    /// Draws a filled rounded rectangle (no stroke).
    pub fn fillRoundedRect(self: *Page, x: f32, y: f32, w: f32, h: f32, radius: f32) !void {
        try self.buildRoundedRectPath(x, y, w, h, radius);
        try self.appendFmt("f\n", .{});
    }

    /// Builds the path for a rounded rectangle using Bezier curves at corners.
    fn buildRoundedRectPath(self: *Page, x: f32, y: f32, w: f32, h: f32, radius: f32) !void {
        const r = radius;
        const k = r * KAPPA;

        // Start at bottom-left, just past the corner radius
        try self.appendFmt("{d:.2} {d:.2} m\n", .{ x + r, y });

        // Bottom edge -> bottom-right corner
        try self.appendFmt("{d:.2} {d:.2} l\n", .{ x + w - r, y });
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            x + w - r + k, y,
            x + w,         y + r - k,
            x + w,         y + r,
        });

        // Right edge -> top-right corner
        try self.appendFmt("{d:.2} {d:.2} l\n", .{ x + w, y + h - r });
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            x + w,         y + h - r + k,
            x + w - r + k, y + h,
            x + w - r,     y + h,
        });

        // Top edge -> top-left corner
        try self.appendFmt("{d:.2} {d:.2} l\n", .{ x + r, y + h });
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            x + r - k, y + h,
            x,         y + h - r + k,
            x,         y + h - r,
        });

        // Left edge -> bottom-left corner (close)
        try self.appendFmt("{d:.2} {d:.2} l\n", .{ x, y + r });
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            x,         y + r - k,
            x + r - k, y,
            x + r,     y,
        });
    }

    // ---------------------------------------------------------------
    // Circle
    // ---------------------------------------------------------------

    /// Draws a stroked circle centered at (cx, cy) with radius r.
    pub fn drawCircle(self: *Page, cx: f32, cy: f32, r: f32) !void {
        try self.buildCirclePath(cx, cy, r);
        try self.appendFmt("S\n", .{});
    }

    /// Draws a filled circle centered at (cx, cy) with radius r.
    pub fn fillCircle(self: *Page, cx: f32, cy: f32, r: f32) !void {
        try self.buildCirclePath(cx, cy, r);
        try self.appendFmt("f\n", .{});
    }

    /// Builds a circle path using four cubic Bezier segments.
    fn buildCirclePath(self: *Page, cx: f32, cy: f32, r: f32) !void {
        const k = r * KAPPA;

        // Start at the rightmost point
        try self.appendFmt("{d:.2} {d:.2} m\n", .{ cx + r, cy });

        // Quadrant 1: right -> top
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            cx + r, cy + k,
            cx + k, cy + r,
            cx,     cy + r,
        });

        // Quadrant 2: top -> left
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            cx - k, cy + r,
            cx - r, cy + k,
            cx - r, cy,
        });

        // Quadrant 3: left -> bottom
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            cx - r, cy - k,
            cx - k, cy - r,
            cx,     cy - r,
        });

        // Quadrant 4: bottom -> right (closes the circle)
        try self.appendFmt("{d:.2} {d:.2} {d:.2} {d:.2} {d:.2} {d:.2} c\n", .{
            cx + k, cy - r,
            cx + r, cy - k,
            cx + r, cy,
        });
    }

    // ---------------------------------------------------------------
    // Internal helpers
    // ---------------------------------------------------------------

    /// Appends a formatted string to the content stream buffer.
    fn appendFmt(self: *Page, comptime fmt: []const u8, args: anytype) !void {
        var buf: [512]u8 = undefined;
        const result = try std.fmt.bufPrint(&buf, fmt, args);
        try self.content.appendSlice(self.allocator, result);
    }

    /// Appends a single byte to the content stream buffer.
    fn appendByte(self: *Page, byte: u8) !void {
        try self.content.append(self.allocator, byte);
    }
};
