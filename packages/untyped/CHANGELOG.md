## 0.4.1 (2025-01-20)

### Bug Fixes

- **workspace-tools:** Resolve formatting issue with missing `parser` config ([da80cf3d](https://github.com/storm-software/storm-ops/commit/da80cf3d))

### 🧱 Updated Dependencies

- Updated config-tools to 1.136.3
- Updated build-tools to 0.129.1
- Updated config to 1.96.2

## 0.4.0 (2025-01-20)

### Features

- **unbuild:** Added `jiti` to resolve the build module ([8f613f91](https://github.com/storm-software/storm-ops/commit/8f613f91))

### Bug Fixes

- **untyped:** Resovle bundling issue with externals ([ff044ddf](https://github.com/storm-software/storm-ops/commit/ff044ddf))

### 🧱 Updated Dependencies

- Updated config-tools to 1.136.2
- Updated build-tools to 0.129.0

## 0.3.1 (2025-01-20)

### Bug Fixes

- **unbuild:** Update package to bundle the `unbuild` package for distribution ([d304c28d](https://github.com/storm-software/storm-ops/commit/d304c28d))

### 🧱 Updated Dependencies

- Updated config-tools to 1.136.1
- Updated build-tools to 0.128.1
- Updated config to 1.96.1

## 0.3.0 (2025-01-20)

### Features

- **unbuild:** Update build process to use cached project graph ([610c94aa](https://github.com/storm-software/storm-ops/commit/610c94aa))

### 🧱 Updated Dependencies

- Updated config-tools to 1.136.0
- Updated build-tools to 0.127.0
- Updated config to 1.96.0

## 0.2.0 (2025-01-20)

### Features

- **untyped:** Standard file name changes to avoid collisions ([71acf100](https://github.com/storm-software/storm-ops/commit/71acf100))

### 🧱 Updated Dependencies

- Updated config-tools to 1.135.0

## 0.1.0 (2025-01-20)

### Features

- **config-tools:** Update the formatting of the console log level indicators ([7169c489](https://github.com/storm-software/storm-ops/commit/7169c489))
- **untyped:** Added more robust error handling/reporting logic ([8ee74d63](https://github.com/storm-software/storm-ops/commit/8ee74d63))
- **workspace-tools:** Update Nx plugin packages to use new build/dist infrastructure ([67cd3df2](https://github.com/storm-software/storm-ops/commit/67cd3df2))
- **untyped:** Initial check-in for the `untyped` package ([c02dad71](https://github.com/storm-software/storm-ops/commit/c02dad71))

### Bug Fixes

- **untyped:** Resolve issue with logic when determinig if `jiti` cache should be enabled ([82d96acd](https://github.com/storm-software/storm-ops/commit/82d96acd))
- **untyped:** Resolve issue with module resolution during CI workflows ([31fe0eb5](https://github.com/storm-software/storm-ops/commit/31fe0eb5))
- **untyped:** Resolved caching issue when run by CI workflow ([507dc76b](https://github.com/storm-software/storm-ops/commit/507dc76b))
- **workspace-tools:** Resolved issue with invalid `package.json` exports ([76c63c08](https://github.com/storm-software/storm-ops/commit/76c63c08))

### Miscellaneous

- **untyped:** Remove the extensions list from `untyped` options ([f381ea1f](https://github.com/storm-software/storm-ops/commit/f381ea1f))
- **monorepo:** Regenerate README markdown files ([5c8e5c96](https://github.com/storm-software/storm-ops/commit/5c8e5c96))

### 🧱 Updated Dependencies

- Updated config-tools to 1.134.0
- Updated build-tools to 0.126.0
- Updated config to 1.95.0