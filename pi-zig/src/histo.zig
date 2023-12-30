const std = @import("std");
const testing = std.testing;

const builtin = @import("builtin");
var allocator = if (builtin.target.isWasm())
    std.heap.wasm_allocator
else need_aa: {
    var aa = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    break :need_aa aa.allocator();
};

// pi_30000.zig is generated during the container build process - see Containerfile
const pi_30000: []u8 = @import("./pi_30000.zig").pi_30000;

// calculate histograms based on the presence of digits 0-9 in pi_30000.
// number is the N digits to consider in pi_30000 (sample size from left)
export fn histogram(number: i32) [*]i32 {
    logToWasm("histogram({d})", .{number});
    var upper: usize = @intCast(number);
    const zero: usize = 0;
    var slice_of_pi: []u8 = pi_30000[zero..upper];

    var array_len: usize = 10;
    const array: [*]i32 = if (allocArray(i32, array_len)) |p| p else with_err: {
        array_len = 0;
        break :with_err undefined;
    };

    // var i: usize = 0;
    // while (i < array_len) : (i += 1) {
    //     const d: i32 = @intCast(i);
    //     array[i] = count(d, slice_of_pi);
    // }

    for (slice_of_pi) |d| {
        array[d] += 1;
    }

    return array;
}

test "histograms forms correct result" {
    allocator = testing.allocator;
    var number: i32 = 10;
    var array = [10]i32{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
    var array_slice: []i32 = &array;
    // 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 = 0, 2, 1, 2, 1, 2, 1, 0, 0, 1
    var expected_array = [10]i32{ 0, 2, 1, 2, 1, 2, 1, 0, 0, 1 };
    var expected: []i32 = &expected_array;
    histogram(number, array_slice.ptr, array_slice.len);
    try testing.expectEqualDeep(expected, array_slice);
}

export fn pi_digits() [*]u8 {
    return pi_30000.ptr;
}

export fn pi_digits_len() usize {
    return pi_30000.len;
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
    return if (allocator.alloc(T, @sizeOf(T) * len)) |slice|
        slice.ptr
    else |_|
        null;
}

/// Free `len` bytes in WASM memory pointed to by `ptr`.
pub export fn free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}

fn logToWasm(comptime fmt: []const u8, args: anytype) void {
    var hasError: bool = false;
    var msg: []u8 = if (std.fmt.allocPrint(allocator, fmt, args)) |m|
        m
    else |_| with_error: {
        hasError = true;
        break :with_error "";
    };

    if (!hasError) {
        defer allocator.free(msg);

        consoleLog(msg.ptr, msg.len);
    }

    if (hasError) {
        var errStr = "Out of memory!";
        consoleLog(errStr.ptr, errStr.len);
    }
}

// Log to the JS console.
extern "env" fn consoleLog(ptr: [*]const u8, len: usize) void;
