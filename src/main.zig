const std = @import("std");
const zpdf = @import("zpdf");
const daily = @import("worksheets/daily.zig");
const weekly = @import("worksheets/weekly.zig");
const goals = @import("worksheets/goals.zig");
const decide = @import("worksheets/decide.zig");
const founder = @import("worksheets/founder.zig");
const progress = @import("worksheets/progress.zig");

const Command = enum {
    daily,
    weekly,
    goals,
    decide,
    founder,
    progress,
    all,
    help,
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    // Parse command
    var cmd: Command = .help;
    var output_path: ?[]const u8 = null;

    var i: usize = 1;
    while (i < args.len) : (i += 1) {
        const arg = args[i];
        if (std.mem.eql(u8, arg, "-h") or std.mem.eql(u8, arg, "--help")) {
            cmd = .help;
            break;
        } else if (std.mem.eql(u8, arg, "-o")) {
            i += 1;
            if (i < args.len) {
                output_path = args[i];
            }
        } else if (std.mem.eql(u8, arg, "daily")) {
            cmd = .daily;
        } else if (std.mem.eql(u8, arg, "weekly")) {
            cmd = .weekly;
        } else if (std.mem.eql(u8, arg, "goals")) {
            cmd = .goals;
        } else if (std.mem.eql(u8, arg, "decide")) {
            cmd = .decide;
        } else if (std.mem.eql(u8, arg, "founder")) {
            cmd = .founder;
        } else if (std.mem.eql(u8, arg, "progress")) {
            cmd = .progress;
        } else if (std.mem.eql(u8, arg, "all")) {
            cmd = .all;
        }
    }

    if (cmd == .help) {
        printHelp();
        return;
    }

    // Generate PDF
    var doc = zpdf.Document.init(allocator);
    defer doc.deinit();

    const cmd_name: []const u8 = switch (cmd) {
        .daily => blk: {
            const page = try doc.addPage();
            try daily.render(page);
            break :blk "daily";
        },
        .weekly => blk: {
            const page = try doc.addPage();
            try weekly.render(page);
            break :blk "weekly";
        },
        .goals => blk: {
            const page = try doc.addPage();
            try goals.render(page);
            break :blk "goals";
        },
        .decide => blk: {
            const page = try doc.addPage();
            try decide.render(page);
            break :blk "decide";
        },
        .founder => blk: {
            const page = try doc.addPage();
            try founder.render(page);
            break :blk "founder";
        },
        .progress => blk: {
            const page = try doc.addPage();
            try progress.render(page);
            break :blk "progress";
        },
        .all => blk: {
            const p1 = try doc.addPage();
            try daily.render(p1);
            const p2 = try doc.addPage();
            try weekly.render(p2);
            const p3 = try doc.addPage();
            try goals.render(p3);
            const p4 = try doc.addPage();
            try decide.render(p4);
            const p5 = try doc.addPage();
            try founder.render(p5);
            const p6 = try doc.addPage();
            try progress.render(p6);
            break :blk "all";
        },
        .help => unreachable,
    };

    const pdf_bytes = try doc.render();
    defer allocator.free(pdf_bytes);

    // Determine output filename
    var fname_buf: [256]u8 = undefined;
    const filename = if (output_path) |p| p else blk: {
        const s = try std.fmt.bufPrint(&fname_buf, "feelcheck-{s}.pdf", .{cmd_name});
        break :blk s;
    };

    const file = try std.fs.cwd().createFile(filename, .{});
    defer file.close();
    try file.writeAll(pdf_bytes);

    std.debug.print("Generated {s} ({d} bytes)\n", .{ filename, pdf_bytes.len });
}

fn printHelp() void {
    std.debug.print(
        \\feelcheck — Psychology-backed printable journal worksheets
        \\
        \\USAGE:
        \\    feelcheck <command> [options]
        \\
        \\COMMANDS:
        \\    daily       Daily Mood Check-in (RULER Framework)
        \\    weekly      Weekly Reflection
        \\    goals       Goal-Setting & Vision (OKRs)
        \\    decide      Decision Planning (Mental Models)
        \\    founder     Founder Resilience Check
        \\    progress    Progress Check-in
        \\    all         Complete workbook (all 6 pages)
        \\
        \\OPTIONS:
        \\    -o <path>   Output file path (default: feelcheck-<type>.pdf)
        \\    -h          Show this help
        \\
        \\EXAMPLES:
        \\    feelcheck daily
        \\    feelcheck all -o my-journal.pdf
        \\
        \\FOR EXPERIMENTAL PURPOSES ONLY
        \\Not a substitute for professional mental health care.
        \\
    , .{});
}
