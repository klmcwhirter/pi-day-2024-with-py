// The entry file of your WebAssembly module.

import { pi_digits_seed } from './pi_digits_seed';

@external('env', 'console.log')
declare function consoleLog(msg: string): void;

export function aslog(str: string): void {
  consoleLog(`AS: ${str}`);
}

export function histogram(n: i32): i32[] {
  consoleLog(`AS: histogram(${n})`);
  const slice_of_pi: u8[] = pi_digits_seed.slice(0, n);
  const slice_of_pi_len = slice_of_pi.length;

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