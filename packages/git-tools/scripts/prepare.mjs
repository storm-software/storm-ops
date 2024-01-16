#!/usr/bin/env zx

if (!process.env.CI) {
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  await $`lefthook install`;
}
