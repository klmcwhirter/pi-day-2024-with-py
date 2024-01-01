const std = @import("std");
const builtin = @import("builtin");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});

    const optimize = b.standardOptimizeOption(.{});

    var artifact: *std.Build.Step.Compile = undefined;

    // This adds a command line option to zig build via the -D flag. i.e. -Dwasm
    const is_wasm = b.option(bool, "wasm", "build for wasm") orelse false;
    // Now we can make a build decision based on that option.

    const runtimeName = "runtime";
    const runtimeFile = if (is_wasm) "src/wasm_runtime.zig" else "src/zig_runtime.zig";
    const runtime = b.addModule(runtimeName, .{ .source_file = .{ .path = runtimeFile } });

    if (is_wasm) {
        artifact = b.addSharedLibrary(.{
            .name = "pi-zig",
            .root_source_file = .{ .path = "src/histo.zig" },
            .target = .{ .cpu_arch = .wasm32, .os_tag = .wasi },
            // .target = .{ .cpu_arch = .wasm32, .os_tag = .freestanding },
            .optimize = .ReleaseSmall,
        });
        artifact.rdynamic = true;

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

        const copy_js = b.addSystemCommand(&[_][]const u8{
            "cp",
            "src/pi-zig.js",
            b.getInstallPath(.lib, "pi-zig.js"),
        });
        copy_js.step.dependOn(b.getInstallStep());

        // Create build step for generating wat file
        const copy_js_step = b.step("copy-js", "Copy the js script used for testing");
        copy_js_step.dependOn(&copy_js.step);
    } else {
        artifact = b.addExecutable(.{
            .name = "pi-zig",
            .root_source_file = .{ .path = "src/main.zig" },
            .target = target,
            .optimize = optimize,
        });
        artifact.single_threaded = true;
    }
    artifact.addModule(runtimeName, runtime);

    b.installArtifact(artifact);

    // Creates a step for unit testing. This only builds the test executable
    // but does not run it.
    const unit_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    unit_tests.addModule(runtimeName, runtime);

    const run_unit_tests = b.addRunArtifact(unit_tests);

    // Similar to creating the run step earlier, this exposes a `test` step to
    // the `zig build --help` menu, providing a way for the user to request
    // running the unit tests.
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_unit_tests.step);
}
