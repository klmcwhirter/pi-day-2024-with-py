const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    _ = target;

    const optimize = b.standardOptimizeOption(.{});
    _ = optimize;

    const lib = b.addSharedLibrary(.{
        .name = "pi-zig",
        .root_source_file = .{ .path = "src/histo.zig" },
        .target = .{ .cpu_arch = .wasm32, .os_tag = .wasi },
        .optimize = .ReleaseSmall,
    });
    lib.rdynamic = true;
    // lib.addObjectFile(.{ .path = "src/pi-zig.js" });

    b.installArtifact(lib);

    const wat = b.addSystemCommand(&[_][]const u8{
        "wasm2wat",
        b.getInstallPath(.lib, "pi-zig.wasm"),
        "-o",
        b.getInstallPath(.lib, "pi-zig.wat"),
    });
    wat.step.dependOn(b.getInstallStep());

    // Create build step for generating wat file
    const wat_step = b.step("gen-wat", "Generate the wat file using wasm2wat");
    wat_step.dependOn(&wat.step);
}
