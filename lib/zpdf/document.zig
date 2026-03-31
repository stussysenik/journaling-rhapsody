const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const Page = @import("page.zig").Page;

/// A PDF 1.4 document that accumulates pages and renders to valid PDF bytes.
///
/// Object numbering scheme:
///   1 = Catalog
///   2 = Pages dictionary
///   3 = Font: Helvetica (/F1)
///   4 = Font: Helvetica-Bold (/F2)
///   5 = Font: Helvetica-Oblique (/F3)
///   6, 7 = first page object + its content stream
///   8, 9 = second page object + its content stream
///   ... and so on (2 objects per page)
pub const Document = struct {
    allocator: Allocator,
    pages: ArrayList(Page),

    /// Creates a new empty PDF document.
    pub fn init(allocator: Allocator) Document {
        return .{
            .allocator = allocator,
            .pages = .{},
        };
    }

    /// Frees all pages and internal memory.
    pub fn deinit(self: *Document) void {
        for (self.pages.items) |*p| {
            p.deinit();
        }
        self.pages.deinit(self.allocator);
    }

    /// Adds a new US Letter page and returns a mutable pointer to it.
    pub fn addPage(self: *Document) !*Page {
        const page = try self.pages.addOne(self.allocator);
        page.* = Page.init(self.allocator);
        return page;
    }

    /// Renders the full document to a valid PDF 1.4 byte buffer.
    /// Caller owns the returned slice and must free it with the same allocator.
    pub fn render(self: *Document) ![]u8 {
        var out = ArrayList(u8){};
        errdefer out.deinit(self.allocator);

        const page_count = self.pages.items.len;
        // Total objects: catalog(1) + pages(2) + 3 fonts(3,4,5) + 2 per page
        const total_objects = 5 + page_count * 2;

        // We'll record byte offsets for each object (1-indexed, so index 0 unused)
        var offsets = try self.allocator.alloc(usize, total_objects + 1);
        defer self.allocator.free(offsets);

        // ---------------------------------------------------------------
        // Header
        // ---------------------------------------------------------------
        try out.appendSlice(self.allocator, "%PDF-1.4\n");
        // Binary comment: signals this is a binary PDF (bytes > 128)
        try out.appendSlice(self.allocator, "%\xe2\xe3\xcf\xd3\n");

        // ---------------------------------------------------------------
        // Object 1: Catalog
        // ---------------------------------------------------------------
        offsets[1] = out.items.len;
        try out.appendSlice(self.allocator, "1 0 obj\n");
        try out.appendSlice(self.allocator, "<< /Type /Catalog /Pages 2 0 R >>\n");
        try out.appendSlice(self.allocator, "endobj\n");

        // ---------------------------------------------------------------
        // Object 2: Pages dictionary
        // Build the /Kids array referencing each page object
        // ---------------------------------------------------------------
        offsets[2] = out.items.len;
        try out.appendSlice(self.allocator, "2 0 obj\n");
        try out.appendSlice(self.allocator, "<< /Type /Pages /Kids [");
        for (0..page_count) |i| {
            const page_obj_num = 6 + i * 2; // page objects start at 6
            var buf: [32]u8 = undefined;
            const s = try std.fmt.bufPrint(&buf, " {d} 0 R", .{page_obj_num});
            try out.appendSlice(self.allocator, s);
        }
        {
            var buf: [32]u8 = undefined;
            const s = try std.fmt.bufPrint(&buf, " ] /Count {d} >>\n", .{page_count});
            try out.appendSlice(self.allocator, s);
        }
        try out.appendSlice(self.allocator, "endobj\n");

        // ---------------------------------------------------------------
        // Object 3: Font - Helvetica (/F1)
        // ---------------------------------------------------------------
        offsets[3] = out.items.len;
        try out.appendSlice(self.allocator, "3 0 obj\n");
        try out.appendSlice(self.allocator, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\n");
        try out.appendSlice(self.allocator, "endobj\n");

        // ---------------------------------------------------------------
        // Object 4: Font - Helvetica-Bold (/F2)
        // ---------------------------------------------------------------
        offsets[4] = out.items.len;
        try out.appendSlice(self.allocator, "4 0 obj\n");
        try out.appendSlice(self.allocator, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\n");
        try out.appendSlice(self.allocator, "endobj\n");

        // ---------------------------------------------------------------
        // Object 5: Font - Helvetica-Oblique (/F3)
        // ---------------------------------------------------------------
        offsets[5] = out.items.len;
        try out.appendSlice(self.allocator, "5 0 obj\n");
        try out.appendSlice(self.allocator, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>\n");
        try out.appendSlice(self.allocator, "endobj\n");

        // ---------------------------------------------------------------
        // Page objects and content streams
        // ---------------------------------------------------------------
        for (self.pages.items, 0..) |page, i| {
            const page_obj_num = 6 + i * 2;
            const stream_obj_num = page_obj_num + 1;

            const content_data = page.content.items;
            const content_len = content_data.len;

            // Page object
            offsets[page_obj_num] = out.items.len;
            {
                var buf: [32]u8 = undefined;
                const s = try std.fmt.bufPrint(&buf, "{d} 0 obj\n", .{page_obj_num});
                try out.appendSlice(self.allocator, s);
            }
            try out.appendSlice(self.allocator, "<< /Type /Page /Parent 2 0 R\n");
            {
                var buf: [128]u8 = undefined;
                const s = try std.fmt.bufPrint(&buf, "   /MediaBox [0 0 {d:.0} {d:.0}]\n", .{ page.width, page.height });
                try out.appendSlice(self.allocator, s);
            }
            {
                var buf: [64]u8 = undefined;
                const s = try std.fmt.bufPrint(&buf, "   /Contents {d} 0 R\n", .{stream_obj_num});
                try out.appendSlice(self.allocator, s);
            }
            try out.appendSlice(self.allocator, "   /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >>\n");
            try out.appendSlice(self.allocator, ">>\n");
            try out.appendSlice(self.allocator, "endobj\n");

            // Content stream object
            offsets[stream_obj_num] = out.items.len;
            {
                var buf: [64]u8 = undefined;
                const s = try std.fmt.bufPrint(&buf, "{d} 0 obj\n", .{stream_obj_num});
                try out.appendSlice(self.allocator, s);
            }
            {
                var buf: [64]u8 = undefined;
                const s = try std.fmt.bufPrint(&buf, "<< /Length {d} >>\n", .{content_len});
                try out.appendSlice(self.allocator, s);
            }
            try out.appendSlice(self.allocator, "stream\n");
            try out.appendSlice(self.allocator, content_data);
            try out.appendSlice(self.allocator, "endstream\n");
            try out.appendSlice(self.allocator, "endobj\n");
        }

        // ---------------------------------------------------------------
        // Cross-reference table
        // ---------------------------------------------------------------
        const xref_offset = out.items.len;
        try out.appendSlice(self.allocator, "xref\n");
        {
            var buf: [64]u8 = undefined;
            const s = try std.fmt.bufPrint(&buf, "0 {d}\n", .{total_objects + 1});
            try out.appendSlice(self.allocator, s);
        }
        // Object 0: free entry (head of free list)
        try out.appendSlice(self.allocator, "0000000000 65535 f \n");
        // Objects 1..total_objects
        for (1..total_objects + 1) |obj_num| {
            var buf: [32]u8 = undefined;
            const s = try std.fmt.bufPrint(&buf, "{d:0>10} 00000 n \n", .{offsets[obj_num]});
            try out.appendSlice(self.allocator, s);
        }

        // ---------------------------------------------------------------
        // Trailer
        // ---------------------------------------------------------------
        try out.appendSlice(self.allocator, "trailer\n");
        {
            var buf: [64]u8 = undefined;
            const s = try std.fmt.bufPrint(&buf, "<< /Size {d} /Root 1 0 R >>\n", .{total_objects + 1});
            try out.appendSlice(self.allocator, s);
        }
        try out.appendSlice(self.allocator, "startxref\n");
        {
            var buf: [32]u8 = undefined;
            const s = try std.fmt.bufPrint(&buf, "{d}\n", .{xref_offset});
            try out.appendSlice(self.allocator, s);
        }
        try out.appendSlice(self.allocator, "%%EOF\n");

        // Transfer ownership of the buffer to the caller
        return out.toOwnedSlice(self.allocator);
    }
};
