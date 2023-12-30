const std = @import("std");

var aa = std.heap.ArenaAllocator.init(std.heap.page_allocator);
pub const allocator = aa.allocator();

pub fn logConsole(comptime fmt: []const u8, args: anytype) void {
    std.debug.print(fmt, args);
}
