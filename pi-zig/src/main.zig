const runtime = @import("runtime");
const allocator = runtime.allocator;
const logConsole = runtime.logConsole;
const histo = @import("histo.zig");

pub fn main() !void {
    // "0.11.0"
    const builtin = @import("builtin");
    const zvers: []const u8 = builtin.zig_version_string;
    logConsole("zig version: {s}\n\n", .{zvers});

    const n: i32 = 1024;
    const rc_ptr: [*]i32 = histo.histogram(n);

    const ten = 10;
    const rc: []i32 = rc_ptr[0..ten];

    logConsole("[", .{});

    var i: usize = 0;
    while (i < ten) : (i += 1) {
        logConsole("{}, ", .{rc[i]});
    }

    logConsole("]\n", .{});
}
