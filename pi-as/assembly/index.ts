// The entry file of your WebAssembly module.

import { pi_digits_seed } from './pi_digits_seed';

// hack until AssemblyScript allows customization with ESM bindings
// console.trace just happens to be bound and we don't need it

// See: https://www.assemblyscript.org/compiler.html#host-bindings
// > These assumptions cannot be intercepted or customized since,
// > to provide static ESM exports from the bindings file directly,
// > instantiation must start immediately when the bindings file is imported.
// > If customization is required, --bindings raw can be used instead.
@external('env', 'console.trace')
declare function consoleLog(msg: string): void;

export function aslog(str: string): void {
  consoleLog(str);
}

export function histogram(n: i32): i32[] {
  consoleLog(`histogram(${n})`);
  const actual_len: i32 = pi_digits_seed.length;
  const slice_of_pi_len: i32 = <i32>Math.min(actual_len, n);
  if (slice_of_pi_len < n) {
    consoleLog(`WARN: using ${slice_of_pi_len} instead of ${n}`);
  }
  const slice_of_pi: u8[] = pi_digits_seed.slice(0, slice_of_pi_len);

  const rc: i32[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i: i32 = 0; i < slice_of_pi_len; i++) {
    rc[slice_of_pi[i]]++;
  }

  return rc;
}

export function pi_digits(): u8[] {
  return pi_digits_seed;
}

export function pi_digits_len(): i32 {
  return pi_digits_seed.length;
}

export function version(): string {
  return `assemblyscript: ${ASC_VERSION_MAJOR}.${ASC_VERSION_MINOR}.${ASC_VERSION_PATCH}`;
}
