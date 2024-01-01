const std = @import("std");
const testing = std.testing;

const runtime = @import("runtime");
var allocator = runtime.allocator; // var for tests
const logConsole = runtime.logConsole;

// pi_digits_seed.zig is generated during the container build process - see Containerfile
const pi_digits_seed: []u8 = @import("./pi_digits_seed.zig").pi_digits_seed;

/// calculate histogram based on the presence of digits 0-9 in pi_digits_seed.
/// number is the N digits to consider in pi_digits_seed (sample size from left)
pub export fn histogram(number: i32) [*]i32 {
    logConsole("histogram({})\n", .{number});
    const upper: usize = @intCast(number);
    const slice_of_pi: []u8 = pi_digits_seed[0..upper];

    const array_len: usize = 10;
    const slice: []i32 = allocator.alloc(i32, array_len) catch {
        // logConsole("PANIC: {}", .{err}); // err=OutOfMemory - this won't work!

        // ** And I cannot return the err - i.e., return type ![*]i32
        //   ... not allowed in function with calling convention 'C'
        //     pub export fn histogram(number: i32) ![*]i32 {
        //                                           ~^~~~~
        // ** cannot return null or @ptrFromInt(0) - this would be ideal
        //     src/histo.zig:29:17: error: expected type '[*]i32', found '@TypeOf(null)'
        //     return (null);
        //             ^~~~
        //     src/histo.zig:26:28: error: pointer type '[*]i32' does not allow address zero
        //        return @ptrFromInt(0);

        // ** So ... crash the wasm runtime in the browser process

        @panic("OutOfMemory");
    };

    // Make sure the memory allocated is zeroed out before beginning to increment.
    // Creates issues when built with -Dwasm=false otherwise.
    // The std.heap.wasm_alloctor seems to 0 memory.
    @memset(slice[0..array_len], 0);
    // alternate form, but I'll trust the builtin: for (array[0..array_len]) |*p| p.* = 0;

    // Increment the histogram for each of the digits in our slice_of_pi ;)
    for (slice_of_pi) |d| slice[d] += 1;

    const rc: [*]i32 = @ptrCast(slice);
    return rc;
}

test "histograms forms correct result" {
    allocator = testing.allocator;
    const number = 10;
    const ten: usize = number;

    // 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 = 0, 2, 1, 2, 1, 2, 1, 0, 0, 1
    const expected_seed = [_]i32{ 0, 2, 1, 2, 1, 2, 1, 0, 0, 1 };
    const expected: []const i32 = expected_seed[0..ten];

    var rc = histogram(number);
    defer allocator.free(rc[0..ten]);

    const slice: []const i32 = rc[0..ten];

    std.debug.print("\nChecking each value for equality individually...\n", .{});
    for (expected, 0..) |ex, i| try testing.expectEqual(ex, slice[i]);

    std.debug.print("\nChecking with expectEqualSlices...\n", .{});
    try testing.expectEqualSlices(i32, expected, slice);
}

export fn pi_digits() [*]u8 {
    return pi_digits_seed.ptr;
}

export fn pi_digits_len() usize {
    return pi_digits_seed.len;
}

/// Allocate `len` bytes in WASM memory. Returns
/// many item pointer on success, null on error.
pub export fn alloc(len: usize) ?[*]u8 {
    return if (allocator.alloc(u8, len)) |slice|
        slice.ptr
    else |_|
        null;
}

fn allocArray(comptime T: type, len: usize) ?[*]T {
    return if (allocator.alloc(T, len)) |slice|
        slice.ptr
    else |_|
        null;
}

/// Free `len` bytes in WASM memory pointed to by `ptr`.
pub export fn free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}
