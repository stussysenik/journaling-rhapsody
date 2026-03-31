//! zpdf - A minimal zero-dependency PDF 1.4 writer for Zig.
//!
//! Supports text rendering with built-in PDF fonts, geometric primitives
//! (lines, rectangles, rounded rectangles, circles), and multi-page documents.

pub const Document = @import("document.zig").Document;
pub const Page = @import("page.zig").Page;
pub const Font = @import("font.zig").Font;
