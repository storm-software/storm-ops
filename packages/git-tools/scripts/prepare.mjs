#!/usr/bin/env zx

if (!process.env.CI) {
  await $`lefthook install`;
}
