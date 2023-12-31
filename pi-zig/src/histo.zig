const std = @import("std");
const testing = std.testing;

const runtime = @import("runtime");
var allocator = runtime.allocator; // var for tests
const logConsole = runtime.logConsole;

// pi_digits_seed.zig is generated during the container build process - see Containerfile
const pi_digits_seed: []u8 = @import("./pi_digits_seed.zig").pi_digits_seed;

// calculate histograms based on the presence of digits 0-9 in pi_digits_seed.
// number is the N digits to consider in pi_digits_seed (sample size from left)
pub export fn histogram(number: i32) [*]i32 {
    logConsole("histogram({})\n", .{number});
    const upper: usize = @intCast(number);
    const zero = 0;
    const slice_of_pi: []u8 = pi_digits_seed[zero..upper];

    var array_len: usize = 10;
    const array: [*]i32 = if (allocArray(i32, array_len)) |p| p else with_err: {
        array_len = 0;
        break :with_err undefined;
    };

    if (array_len == 10) {
        // Make sure the memory allocated is zeroed out before beginning to increment.
        // Creates issues when -Wwasm=false otherwise.
        var i: usize = 0;
        while (i < array_len) : (i += 1) {
            array[i] = 0;
        }

        // Increment for each of the digits in our sliced_of_pi ;)
        for (slice_of_pi) |d| {
            array[d] += 1;
        }
    }

    return array;
}

test "histograms forms correct result" {
    allocator = testing.allocator;
    const number = 10;
    const ten: usize = number;

    // 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 = 0, 2, 1, 2, 1, 2, 1, 0, 0, 1
    var expected_array = [ten]i32{ 0, 2, 1, 2, 1, 2, 1, 0, 0, 1 };
    const expected: []i32 = expected_array[0..ten];

    const array: [*]i32 = histogram(number);
    var array_slice: []i32 = try allocator.alloc(i32, ten);
    defer allocator.free(array_slice);

    var i: usize = 0;
    while (i < ten) : (i += 1) {
        array_slice[i] = array[i];
    }
    try testing.expectEqualDeep(expected, array_slice);
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
    return if (allocator.alloc(T, @sizeOf(T) * len)) |slice|
        slice.ptr
    else |_|
        null;
}

/// Free `len` bytes in WASM memory pointed to by `ptr`.
pub export fn free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}
