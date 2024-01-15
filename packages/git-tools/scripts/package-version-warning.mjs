#!/usr/bin/env zx

import { checkPackageVersion } from "./check-package-version.js";

checkPackageVersion(process.argv.slice(2));
