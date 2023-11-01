#!/usr/bin/env node

import("../cli/index.js").then(mod => {
  mod
    .default()
    .then(exitCode => {
      process.exitCode = exitCode;
    })
    .catch(error => {
      console.error(error);
      process.exitCode = 1;
    });
});
