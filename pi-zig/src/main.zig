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
    const rc: []i32 = try allocator.alloc(i32, 10);
    defer allocator.free(rc);

    var i: usize = 0;
    while (i < 10) : (i += 1) {
        // TODO: this is not working! Outputs the following:
        // histogram(1024) = [
        // -1431655670,
        // -1431655649,
        // -1431655660,
        // -1431655661,
        // -1431655672,
        // -1431655665,
        // -1431655670,
        // -1431655669,
        // -1431655661,
        // -1431655659,
        // ]
        rc[i] = rc_ptr[i];
    }

    logConsole("histogram({}) = [\n", .{n});
    i = 0;
    while (i < 10) : (i += 1) {
        logConsole("{}, \n", .{rc[i]});
    }
    logConsole("]\n", .{});
}
