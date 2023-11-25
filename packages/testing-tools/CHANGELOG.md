# [1.7.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.6...testing-tools-v1.7.0) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Resolved issue with ES module imports ([8573fbc](https://github.com/storm-software/storm-ops/commit/8573fbcc2c741c8496160e61ff7011070ad07402))


### Features

* **workspace-tools:** Added `WorkspaceStorage` class to handle caching during processing ([b7a6830](https://github.com/storm-software/storm-ops/commit/b7a68300721be70fdf18c07b9e700f77f1191486))

## [1.6.6](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.5...testing-tools-v1.6.6) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Resovled issue with missing options in rollup build in tsup patch ([765f538](https://github.com/storm-software/storm-ops/commit/765f538d0dd11964299e254654bbd1b5b38261ff))

## [1.6.5](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.4...testing-tools-v1.6.5) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Update imports for @typescript/vfs to use named values ([99306e5](https://github.com/storm-software/storm-ops/commit/99306e575db6c059035077c26dcef4a116ff1bcb))

## [1.6.4](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.3...testing-tools-v1.6.4) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Added virtual file system to tsup patch to resolve missing libs ([068ab7a](https://github.com/storm-software/storm-ops/commit/068ab7a56a45d3d3ed63a86661d8207929829e5a))

## [1.6.3](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.2...testing-tools-v1.6.3) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Removed compiler options to set targer manaully in tsup build ([4aff28d](https://github.com/storm-software/storm-ops/commit/4aff28d6e451b18c120157b0c7e62ce6530a9eff))

## [1.6.2](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.1...testing-tools-v1.6.2) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Update default compilerOptions prior to calling tsc ([8bcb254](https://github.com/storm-software/storm-ops/commit/8bcb254fc0045414a80d79b056f6cfde2fd66e68))

## [1.6.1](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.6.0...testing-tools-v1.6.1) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Resolved bad iterable issue in tsup patch ([62a016b](https://github.com/storm-software/storm-ops/commit/62a016bc7bc5aec0978d0a92883843c795f997ac))

# [1.6.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.5.1...testing-tools-v1.6.0) (2023-11-25)


### Features

* **workspace-tools:** Added the `includeSrc` option to the tsup build executor ([be66e22](https://github.com/storm-software/storm-ops/commit/be66e222af773fb741cfa719f883bfb921ff8a68))

## [1.5.1](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.5.0...testing-tools-v1.5.1) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Update include paths in tsconfig used in tsup builder ([99e651d](https://github.com/storm-software/storm-ops/commit/99e651d42f770bc29e7e76f7533abe519e29b9a4))

# [1.5.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.13...testing-tools-v1.5.0) (2023-11-25)


### Features

* **workspace-tools:** Added workers distribution to tsup build ([fc80ec1](https://github.com/storm-software/storm-ops/commit/fc80ec1e3ecea46bc63b2bd5fc4e46f3ecdc8ba0))

## [1.4.13](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.12...testing-tools-v1.4.13) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Update the outDir value of parsed tsconfig options in tsup patch ([65c2aca](https://github.com/storm-software/storm-ops/commit/65c2aca19ba41a7de44d2f4b2121f7e2abfd3893))

## [1.4.12](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.11...testing-tools-v1.4.12) (2023-11-25)


### Bug Fixes

* **workspace-tools:** Fixed issue with invalid chars in entry name ([5d849dd](https://github.com/storm-software/storm-ops/commit/5d849dd45c198283b31fe5e939351df0e841107c))

## [1.4.11](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.10...testing-tools-v1.4.11) (2023-11-24)


### Bug Fixes

* **workspace-tools:** Resolve issue with dts `files` in compiler options ([2e9a611](https://github.com/storm-software/storm-ops/commit/2e9a611f6dee0c2db0fc6b87301472960f3b0cb5))

## [1.4.10](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.9...testing-tools-v1.4.10) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Resolved issue with bad path in tsup build ([33a7b25](https://github.com/storm-software/storm-ops/commit/33a7b25b153f81cfced829dd0b3e6c5225afea36))

## [1.4.9](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.8...testing-tools-v1.4.9) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Update generated tsconfig include to point to package root ([49aef81](https://github.com/storm-software/storm-ops/commit/49aef8178bb8a2c71e92ee3785358d42507eee56))

## [1.4.8](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.7...testing-tools-v1.4.8) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Resolve include issue with tsc during tsup build ([a6fffbe](https://github.com/storm-software/storm-ops/commit/a6fffbe881cb4f05f974de0b745157a0cfb8dcf6))

## [1.4.7](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.6...testing-tools-v1.4.7) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Resolved issue around incorrect output mapping in api-extractor ([b0464ed](https://github.com/storm-software/storm-ops/commit/b0464ed5f4b1f91a5b4c21d00e29d770d5732582))

## [1.4.6](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.5...testing-tools-v1.4.6) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Removed overriden tsconfig for api-extractor ([fcece07](https://github.com/storm-software/storm-ops/commit/fcece076bca3b0bd9938a4f5fbf3717628085ac3))

## [1.4.5](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.4...testing-tools-v1.4.5) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Correctly formatted include path in tsconfig passed to api extractor ([4c65fcf](https://github.com/storm-software/storm-ops/commit/4c65fcfb109f21f854ba5d6973e00bbc6e5c5173))

## [1.4.4](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.3...testing-tools-v1.4.4) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Resolved issue with export generation after api-extractor ([2b9e593](https://github.com/storm-software/storm-ops/commit/2b9e593a72ee352531e5721c62e3a3d10e86ed47))

## [1.4.3](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.2...testing-tools-v1.4.3) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Add default tsconfig values for api-extractor ([ae43e3f](https://github.com/storm-software/storm-ops/commit/ae43e3f47636a8921ace3441da5d533fa9773fe1))

## [1.4.2](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.1...testing-tools-v1.4.2) (2023-11-22)


### Bug Fixes

* **workspace-tools:** Update the `projectFolder` option passed to api-extractor ([fb0c939](https://github.com/storm-software/storm-ops/commit/fb0c939122c19947bebfbebdea153cbabc3335cc))

## [1.4.1](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.4.0...testing-tools-v1.4.1) (2023-11-21)


### Bug Fixes

* **workspace-tools:** Resolved issues with api-extractors paths ([8ea88f0](https://github.com/storm-software/storm-ops/commit/8ea88f09c240a94533474436dbac50bdabd26b2a))

# [1.4.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.3.0...testing-tools-v1.4.0) (2023-11-21)


### Features

* **workspace-tools:** Added the `main` option to tsup build support manually entered entry paths ([fcb0fa7](https://github.com/storm-software/storm-ops/commit/fcb0fa7b98a8ed9bf14f9b724d9d9c7f345b7a08))

# [1.3.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.2.5...testing-tools-v1.3.0) (2023-11-21)


### Features

* **workspace-tools:** Added `description` as an option in the node-library generator ([7a8eb85](https://github.com/storm-software/storm-ops/commit/7a8eb851ae7d979bb32c250ed3a1c78ea5b65af9))

## [1.2.5](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.2.4...testing-tools-v1.2.5) (2023-11-21)


### Bug Fixes

* **workspace-tools:** Updated paths of generated api-reports ([c79d65e](https://github.com/storm-software/storm-ops/commit/c79d65e8a77c4801f20934e4cc733817f60d1aa2))

## [1.2.4](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.2.3...testing-tools-v1.2.4) (2023-11-21)


### Bug Fixes

* **workspace-tools:** Resolved issue with `tsdocMetadataFilePath` option ([e1e8b59](https://github.com/storm-software/storm-ops/commit/e1e8b59c853580ea5deb5175cad6971953878f18))

## [1.2.3](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.2.2...testing-tools-v1.2.3) (2023-11-21)


### Bug Fixes

* **workspace-tools:** Resolved issue with path separator character in tsup ([ea97d60](https://github.com/storm-software/storm-ops/commit/ea97d60bec1d966bbda5edffcc9f7edb8e488c27))

## [1.2.2](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.2.1...testing-tools-v1.2.2) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Resolved path issue in API Extractor config ([d3f8ae5](https://github.com/storm-software/storm-ops/commit/d3f8ae5d6f298e9e18dc2b26270edbb704a9b712))

## [1.2.1](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.2.0...testing-tools-v1.2.1) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Updated the api-reports docs path in tsup executor ([7ba4b1d](https://github.com/storm-software/storm-ops/commit/7ba4b1d6969d6de7f77ca9f1b99a53426ed659fb))

# [1.2.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.46...testing-tools-v1.2.0) (2023-11-20)


### Features

* **workspace-tools:** Update tsup executor to generate API Report file, Doc Model, and TSDoc Metadata ([fb4cda5](https://github.com/storm-software/storm-ops/commit/fb4cda5807005d2ae412d637fa5247ebad09abf7))

## [1.1.46](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.45...testing-tools-v1.1.46) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Added missing @microsoft/api-extractor dependency for tsup DTS build ([56ab124](https://github.com/storm-software/storm-ops/commit/56ab124124275be7f66f0e9f11d64477c82bbcf5))

## [1.1.45](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.44...testing-tools-v1.1.45) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Resolved issue with tsconfig parser parameteters in tsup patch ([f71e590](https://github.com/storm-software/storm-ops/commit/f71e59055fc2d37ba282fd041c7a60e6469c76da))

## [1.1.44](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.43...testing-tools-v1.1.44) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Added extra logging to tsup patch ([6c58d8a](https://github.com/storm-software/storm-ops/commit/6c58d8a369d5ee4b28804903b49ae2ea141e7abd))

## [1.1.43](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.42...testing-tools-v1.1.43) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Resolved issue with package export lookup in tsup patch ([ba53a36](https://github.com/storm-software/storm-ops/commit/ba53a3606b60e78d0f66894c6e3bc5d116ddaacd))

## [1.1.42](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.41...testing-tools-v1.1.42) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Resolved bad tsconfig path issue in tsup patch ([564b0b5](https://github.com/storm-software/storm-ops/commit/564b0b5cd054852106328fb047cd77baefea962e))

## [1.1.41](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.40...testing-tools-v1.1.41) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Resolve issue with path library reference in tsup ([9745279](https://github.com/storm-software/storm-ops/commit/974527945816b40c8b210b06b3da16f20cb86dde))

## [1.1.40](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.39...testing-tools-v1.1.40) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Resovled issue with tsup dts tsconfig path ([eefb517](https://github.com/storm-software/storm-ops/commit/eefb517fc2369ab2411911c3810e51390a4689d9))

## [1.1.39](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.38...testing-tools-v1.1.39) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Added code to default tsup build options and package.json path in api-extractor ([f79dbb1](https://github.com/storm-software/storm-ops/commit/f79dbb1d57ba7e2da054ae47483e98516739662b))

## [1.1.38](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.37...testing-tools-v1.1.38) (2023-11-20)


### Bug Fixes

* **workspace-tools:** Prevent both dts and experimentalDts from being enabled ([c2e5082](https://github.com/storm-software/storm-ops/commit/c2e50822440564f27e7f387e0e936c07092b4653))

## [1.1.37](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.36...testing-tools-v1.1.37) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Upgrade tsup version and enabled experimental dts ([96f6870](https://github.com/storm-software/storm-ops/commit/96f6870f590ab6a44a3058f20f6ee4e6a6ab1623))

## [1.1.36](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.35...testing-tools-v1.1.36) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Update where tsup loads shim files and added define option ([fa8fe6a](https://github.com/storm-software/storm-ops/commit/fa8fe6a4e7a5d6ac0f87a7b07d1db41cdd3bddc6))

## [1.1.35](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.34...testing-tools-v1.1.35) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Added esm and cjs shims to package bundle ([87a16e4](https://github.com/storm-software/storm-ops/commit/87a16e4007f04201bb0b817fe6fe2bf41c461f95))

## [1.1.34](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.33...testing-tools-v1.1.34) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Added rollup support for DTS generation ([d1f3325](https://github.com/storm-software/storm-ops/commit/d1f3325bf712e3714904e9ca4b795bfba3df39f8))

## [1.1.33](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.32...testing-tools-v1.1.33) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Resolved issue preventing package.json from being written ([c340959](https://github.com/storm-software/storm-ops/commit/c340959fdacb2541c60afca5feef9868bc0296e1))

## [1.1.32](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.31...testing-tools-v1.1.32) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Resolved issue with bad loop conditional in Tsup patch ([a692e7d](https://github.com/storm-software/storm-ops/commit/a692e7d3adf526353a4714e22761a1ba3bcc1cb5))

## [1.1.31](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.30...testing-tools-v1.1.31) (2023-11-19)


### Bug Fixes

* **workspace-tools:** Added conditional to tsup package.json search ([f1e26a9](https://github.com/storm-software/storm-ops/commit/f1e26a9fadee64704e7a3beebed6ac8e9d103063))

## [1.1.30](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.29...testing-tools-v1.1.30) (2023-11-18)


### Bug Fixes

* **workspace-tools:** Resolved issue with order of package.json search in tsup executor ([5fea9a1](https://github.com/storm-software/storm-ops/commit/5fea9a117691bef20aa22fbd107522d43b8b1b62))

## [1.1.29](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.28...testing-tools-v1.1.29) (2023-11-18)


### Bug Fixes

* **workspace-tools:** Added join to add separators in package.json path in tsup ([b56df8a](https://github.com/storm-software/storm-ops/commit/b56df8a3c20e12fb8763e481cbc6ca82ff6403cf))

## [1.1.28](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.27...testing-tools-v1.1.28) (2023-11-18)


### Bug Fixes

* **workspace-tools:** Resolved issue looking up package folder in tsup patch ([0eeee37](https://github.com/storm-software/storm-ops/commit/0eeee37219ceaf2873d7e8d0c7d5f7f46ab6a9bd))

## [1.1.27](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.26...testing-tools-v1.1.27) (2023-11-18)


### Bug Fixes

* **workspace-tools:** Fixed issue in tsup patch around package.json generation ([a526fe7](https://github.com/storm-software/storm-ops/commit/a526fe72607ed7a957266fc790cafa8fb5d5b501))

## [1.1.26](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.25...testing-tools-v1.1.26) (2023-11-18)


### Bug Fixes

* **workspace-tools:** Added banner to tsup patch ([2b97503](https://github.com/storm-software/storm-ops/commit/2b975032eece19bcdde9b7c3fbbd160c37c02c0f))

## [1.1.25](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.24...testing-tools-v1.1.25) (2023-11-18)


### Bug Fixes

* **workspace-tools:** Patched tsup to properly use logger ([73a56f0](https://github.com/storm-software/storm-ops/commit/73a56f07931e173a70e30b01cf629ae17f27646a))

## [1.1.24](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.23...testing-tools-v1.1.24) (2023-11-16)


### Bug Fixes

* **workspace-tools:** Update `entry` in tsup to use a single default file ([06bf60c](https://github.com/storm-software/storm-ops/commit/06bf60c125411a1bdc72bebd7ebe0e7bbc9aa740))

## [1.1.23](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.22...testing-tools-v1.1.23) (2023-11-16)


### Bug Fixes

* **linting-tools:** Added tsconfig recommended to root tsconfig ([cfc70d7](https://github.com/storm-software/storm-ops/commit/cfc70d70ed5a123260d4ef9f1649ad66a0fe38e1))

## [1.1.22](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.21...testing-tools-v1.1.22) (2023-11-16)


### Bug Fixes

* **workspace-tools:** Change tsup build to use glob package instead of function from Nx ([4fa5e17](https://github.com/storm-software/storm-ops/commit/4fa5e17d3d29f1769caccb52957fb8fb9ee772d0))
* **workspace-tools:** Included missing config function signature change ([a2228f2](https://github.com/storm-software/storm-ops/commit/a2228f2fba09d2dfd80a3f3c6dc5059077265f12))

## [1.1.21](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.20...testing-tools-v1.1.21) (2023-11-16)


### Bug Fixes

* **workspace-tools:** Patch logging into tsup build ([e6ce2d7](https://github.com/storm-software/storm-ops/commit/e6ce2d7332c409d98f3aee4c561c299de6566de5))
* **workspace-tools:** Patch tsup build with check for `this` in rollup config ([f6bd066](https://github.com/storm-software/storm-ops/commit/f6bd06677163c0df6bd0a1b4a5e40bd651bf1e86))

## [1.1.20](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.19...testing-tools-v1.1.20) (2023-11-16)


### Bug Fixes

* **workspace-tools:** Update tsup patch to use the logger ([4874960](https://github.com/storm-software/storm-ops/commit/4874960eff7c9335d51c375ea858bca992c9e5f8))

## [1.1.19](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.18...testing-tools-v1.1.19) (2023-11-16)


### Bug Fixes

* **workspace-tools:** Added troubleshooting logging to tsup build ([f033bc5](https://github.com/storm-software/storm-ops/commit/f033bc548ef94aee6310fb6d5105fc750074264b))

## [1.1.18](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.17...testing-tools-v1.1.18) (2023-11-15)


### Bug Fixes

* **workspace-tools:** Resolved issue with prettier config import ([4e2c026](https://github.com/storm-software/storm-ops/commit/4e2c026ca16072a60cbf34ece52e836ed6c0c183))
* **workspace-tools:** Updated tsup build to check for package.json in outDir via patch ([65afb51](https://github.com/storm-software/storm-ops/commit/65afb51dbcd4e68ebf44f643a9f683e66564b18c))

## [1.1.17](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.16...testing-tools-v1.1.17) (2023-11-15)


### Bug Fixes

* **workspace-tools:** Resolved tsup issue with entry option and package.json full path ([1181d64](https://github.com/storm-software/storm-ops/commit/1181d644c5c1ced40c7dbb563df252b2630ca7ca))

## [1.1.16](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.15...testing-tools-v1.1.16) (2023-11-15)


### Bug Fixes

* **workspace-tools:** Patch tsup to use generated package.json file ([424fb45](https://github.com/storm-software/storm-ops/commit/424fb454abea5399b7333777210286d654610f2d))

## [1.1.15](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.14...testing-tools-v1.1.15) (2023-11-15)


### Bug Fixes

* **deps:** update patch prod dependencies ([4f84a7e](https://github.com/storm-software/storm-ops/commit/4f84a7e38ddd416883229b67665649ae0ffcc03a))
* **workspace-tools:** Update default options for tsup executor ([436d792](https://github.com/storm-software/storm-ops/commit/436d7922a31128030659d671e5ed76272801215d))

## [1.1.14](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.13...testing-tools-v1.1.14) (2023-11-13)


### Bug Fixes

* **workspace-tools:** Update tsup config to package src files in build package ([c6297b5](https://github.com/storm-software/storm-ops/commit/c6297b54a4db28d0737adfa4203a6a6dd9b4565f))

## [1.1.13](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.12...testing-tools-v1.1.13) (2023-11-13)


### Bug Fixes

* **workspace-tools:** Include terser in workspace package for tsup build ([ee26f46](https://github.com/storm-software/storm-ops/commit/ee26f4696873ea4b329f73d7b4b718cd193c7847))

## [1.1.12](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.11...testing-tools-v1.1.12) (2023-11-12)


### Bug Fixes

* **workspace-tools:** Update output paths on tsup executor config ([54e2078](https://github.com/storm-software/storm-ops/commit/54e2078c4d6fbc98401d4703746c1de9504e75a4))

## [1.1.11](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.10...testing-tools-v1.1.11) (2023-11-12)


### Bug Fixes

* **workspace-tools:** Update clean functionality so no previously build files are removed ([19ce7bd](https://github.com/storm-software/storm-ops/commit/19ce7bd17f570587a70256471c63b613943a0c39))

## [1.1.10](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.9...testing-tools-v1.1.10) (2023-11-12)


### Bug Fixes

* **workspace-tools:** Resolve issue with config objects passed to copyAssets function ([ea68191](https://github.com/storm-software/storm-ops/commit/ea681918bac665c7442afee6aa3228897b69ea10))

## [1.1.9](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.8...testing-tools-v1.1.9) (2023-11-12)


### Bug Fixes

* **workspace-tools:** Include @nx/esbuild and tsup dependencies in build bundle ([7acaf5e](https://github.com/storm-software/storm-ops/commit/7acaf5e138709ac0ded3bbcfda2de6f3dfe8cca8))

## [1.1.8](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.7...testing-tools-v1.1.8) (2023-11-10)


### Bug Fixes

* **workspace-tools:** Resolved issue setting private package.json field in node-library generator ([7e570c5](https://github.com/storm-software/storm-ops/commit/7e570c5d62b206bca2840e8e92c0a9920d8b571e))

## [1.1.7](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.6...testing-tools-v1.1.7) (2023-11-10)


### Bug Fixes

* **git-tools:** Update list-staged config extension to work with ES modules ([a408b88](https://github.com/storm-software/storm-ops/commit/a408b88543fa835c931b25d8c9294c4427e8e6fe))

## [1.1.6](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.5...testing-tools-v1.1.6) (2023-11-10)


### Bug Fixes

* **git-tools:** Resolved issue with missing husky hooks ([505113d](https://github.com/storm-software/storm-ops/commit/505113d29a17b37c99aa00d93bb6a1b5f60412ed))

## [1.1.5](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.4...testing-tools-v1.1.5) (2023-11-09)


### Bug Fixes

* **workspace-tools:** Resolved issue with dependency versions in preset ([3e8225a](https://github.com/storm-software/storm-ops/commit/3e8225aed8de591575b225b01d4fb7fb9ed4d56a))

## [1.1.4](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.3...testing-tools-v1.1.4) (2023-11-08)


### Bug Fixes

* **workspace-tools:** Resolved issues with all-contributors template ([56f40e0](https://github.com/storm-software/storm-ops/commit/56f40e06143203c6d24658d192cba20fefa75004))

## [1.1.3](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.2...testing-tools-v1.1.3) (2023-11-08)


### Bug Fixes

* **workspace-tools:** Resolved issues with mismatching node/pnpm versions ([8f9d0dd](https://github.com/storm-software/storm-ops/commit/8f9d0ddf4391534ee60dee603a819bf95f8b859c))

## [1.1.2](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.1...testing-tools-v1.1.2) (2023-11-07)


### Bug Fixes

* **create-storm-workspace:** Bundle packages with create-storm-workspace ([f3bcb3b](https://github.com/storm-software/storm-ops/commit/f3bcb3b750cf8f8aacb2e93a600a5b18bcacaa7d))

## [1.1.1](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.1.0...testing-tools-v1.1.1) (2023-11-07)


### Bug Fixes

* **create-storm-workspace:** Resolved issue with linked workspace-tools dependency in package.json ([90b0b76](https://github.com/storm-software/storm-ops/commit/90b0b766817445084cec96126c51c8302ca16d6d))

# [1.1.0](https://github.com/storm-software/storm-ops/compare/testing-tools-v1.0.0...testing-tools-v1.1.0) (2023-11-07)


### Features

* **workspace-tools:** Added the node-library generator ([85ada65](https://github.com/storm-software/storm-ops/commit/85ada65f9737f972a36d0a001179f87963b4aa98))

# [1.0.0](https://github.com/storm-software/storm-ops/compare/...testing-tools-v1.0.0) (2023-11-07)


### Bug Fixes

* **deps:** pin dependencies ([3a245b9](https://github.com/storm-software/storm-ops/commit/3a245b9f6781af520862474da42de105a59a96e1))
* **deps:** update dependency @cspell/dict-en-gb to v4 ([eddf2bf](https://github.com/storm-software/storm-ops/commit/eddf2bff0125b38008a3dccf22928f20767ecd26))
* **deps:** update dependency p-limit to v5 ([353e00a](https://github.com/storm-software/storm-ops/commit/353e00a00d4de71ca2d828d4a788726da6020ba4))
* **deps:** update dependency prettier to v3 ([f505213](https://github.com/storm-software/storm-ops/commit/f50521399cb1f54916a803b91587f6241467123a))
* **deps:** update typescript-eslint monorepo to v6 ([c8b086b](https://github.com/storm-software/storm-ops/commit/c8b086b43f25c22c200bf157e88459371391ec38))
* **git-tools:** Add @semantic-release/github dependency to git-tools ([949bc8d](https://github.com/storm-software/storm-ops/commit/949bc8d953b855e3f2e0a2f7e1faae12da83cdad))
* **git-tools:** Added config token replacement functionality ([cd48602](https://github.com/storm-software/storm-ops/commit/cd4860283eb249bfe2b2b08a439f729f2f5b89a3))
* **git-tools:** Added missing GitHub release config and removed failed GitGuardian lines ([4b64698](https://github.com/storm-software/storm-ops/commit/4b646983226fa979c76f8078ffd1cee1d544f1a1))
* **git-tools:** Added missing semantic-release depenencies ([33a0f5e](https://github.com/storm-software/storm-ops/commit/33a0f5e635a417715db8cbfd78540912e721529b))
* **git-tools:** Added missing semantic-release plugins ([5350bc2](https://github.com/storm-software/storm-ops/commit/5350bc2bd4c89f9f1dc1f29903dfbd90ffb6f337))
* **git-tools:** Added semantic-release plugins to root package.json ([55289a7](https://github.com/storm-software/storm-ops/commit/55289a75b08e1603f087dfa1c8b6d594b6386f95))
* **git-tools:** Convert package to ES module ([b845fda](https://github.com/storm-software/storm-ops/commit/b845fdacbd530a90cb6a596cd9e182f3466e92f0))
* **git-tools:** Patch semantic-release to use an import instead of require on the plugin ([25dcf81](https://github.com/storm-software/storm-ops/commit/25dcf81794381cb3df24ea944592bf6e729093cf))
* **git-tools:** Remove unused lodash dependency ([0381059](https://github.com/storm-software/storm-ops/commit/0381059a48e7260648a61178ad52912c69362601))
* **git-tools:** Resolve issue with CJS vs ESM conflicts ([7afb4c9](https://github.com/storm-software/storm-ops/commit/7afb4c98b22dff7a9b9d9ba5987b212797b7aa29))
* **git-tools:** Resolved issues with release module imports ([befe2b2](https://github.com/storm-software/storm-ops/commit/befe2b21a3726abd51a032abaed21e8bcaf50c74))
* **git-tools:** Update method of importing semantic-release ([5ae114e](https://github.com/storm-software/storm-ops/commit/5ae114e0fee775840363ffcf7f2efcb727c2c9ed))
* **git-tools:** Update require to import in semantic-release patch ([e2ef52c](https://github.com/storm-software/storm-ops/commit/e2ef52cd0920336ad33857954040af7291a66e6d))
* **semantic-release-plugin:** Add cjs build to release plugin ([3e06494](https://github.com/storm-software/storm-ops/commit/3e0649470fcc68814b550dd933fedb5840425617))
* **semantic-release-plugin:** Add code for commit analyzer ([2757ca3](https://github.com/storm-software/storm-ops/commit/2757ca3c9805b1cde9cb4bab0361ebee783fae11))
* **semantic-release-plugin:** Add release note generation to semantic release plugin ([c4e250d](https://github.com/storm-software/storm-ops/commit/c4e250d910daa10aa33549c1c6f508e569930870))
* **semantic-release-plugin:** Add rootDir to plugin ([674ebdd](https://github.com/storm-software/storm-ops/commit/674ebddf21eaea5958064d4791df1ef676aab393))
* **semantic-release-plugin:** Change compiler type ([542667d](https://github.com/storm-software/storm-ops/commit/542667db6b58fe9775c92632cf0497a80d74593b))
* **semantic-release-plugin:** Changed import type for release plugin ([51f4809](https://github.com/storm-software/storm-ops/commit/51f480922809acb5592fcc8b594548d729388a7b))
* **semantic-release-plugin:** Converted the plugin to CommonJS ([ff870ee](https://github.com/storm-software/storm-ops/commit/ff870ee083c7da4524f50332cf2b47ef27734a3f))
* **semantic-release-plugin:** Format output to mjs file ([2175391](https://github.com/storm-software/storm-ops/commit/217539176889675d3e47a7dac102a1533a68869a))
* **semantic-release-plugin:** Invoke commit analzyer manually to prevent ES module issues ([09c66cb](https://github.com/storm-software/storm-ops/commit/09c66cb2c2fc94f59149b93d299cc95346438542))
* **semantic-release-plugin:** Mark the semantic-release plugin as external ([863ed64](https://github.com/storm-software/storm-ops/commit/863ed640a3960fbed7de71f946db0e2d591c87b8))
* **semantic-release-plugin:** Patch semantic-release-plugin-decorators to use import instead of require ([8a4b348](https://github.com/storm-software/storm-ops/commit/8a4b34854be0b5b6e7d4bef05942de8ea7ab84b4))
* **semantic-release-plugin:** Remove code to avoid semantic release built-in plugins ([6a7263b](https://github.com/storm-software/storm-ops/commit/6a7263b1273c0233ccdb79b3c3c06a9059375e5d))
* **semantic-release-plugin:** Remove third party code from bundle ([5d0d464](https://github.com/storm-software/storm-ops/commit/5d0d464e75d1fdd47e8db9f471ef8655a6b800e5))
* **semantic-release-plugin:** Removed dependancy on commit analyzer ([4796955](https://github.com/storm-software/storm-ops/commit/479695525e578ead9ada3fc79b2f46edfb0b667d))
* **semantic-release-plugin:** Resolve imports to support ES modules ([91cdf56](https://github.com/storm-software/storm-ops/commit/91cdf569e0e2237bbc0cb2e81446c3b2578a2e27))
* **semantic-release-plugin:** Resolve issue with main path extension in package.json ([b2aa62b](https://github.com/storm-software/storm-ops/commit/b2aa62be19ed31f64f6b1c483f0dd480ce73c1de))
* **semantic-release-plugin:** Resolve missing path module ([34409df](https://github.com/storm-software/storm-ops/commit/34409df07f095e6b11d80f570d03dea3bf859a86))
* **semantic-release-plugin:** Resolve path import issue ([c7769a1](https://github.com/storm-software/storm-ops/commit/c7769a123fbb48988c58047fa4832563b7946dad))
* **semantic-release-plugin:** Unbundle sematic release plugin ([7910e43](https://github.com/storm-software/storm-ops/commit/7910e43b14a9f048ad4979cdc8819589adbc1b3a))
* **semantic-release-plugin:** Update extension on main file to be mjs ([8c6e389](https://github.com/storm-software/storm-ops/commit/8c6e389bac21008b2cb4289b47f345ec52b2c204))
* **semantic-release-plugin:** Update the package.json index file path ([1da1cce](https://github.com/storm-software/storm-ops/commit/1da1cce9d135826636ed7af371e01db329bf1cc9))
* **storm-ops:** Add @semantic-release/commit-analyzer dependency back to workspace root ([553dd65](https://github.com/storm-software/storm-ops/commit/553dd6548aba57eada49dce635312b2c4bdd474f))
* **storm-ops:** Added back husky hooks and removed config from package.json ([f1b0b85](https://github.com/storm-software/storm-ops/commit/f1b0b85af21c22051a9f26c8d987c4370c60ca76))
* **storm-ops:** Patch semantic release to use old config import ([18e27d6](https://github.com/storm-software/storm-ops/commit/18e27d6f5038475e28a83efbfdb0438fac3acda2))
* **storm-ops:** Regenerate pnpm lockfile ([6cc4c75](https://github.com/storm-software/storm-ops/commit/6cc4c75486d843327d8e438e34dd08182bb0e052))
* **storm-ops:** Regenerated pnpm filelock file ([113bf16](https://github.com/storm-software/storm-ops/commit/113bf1678acd4324992f4d8f2581c262bddcbc85))
* **storm-ops:** Remove unused workspace config from package.json ([0651468](https://github.com/storm-software/storm-ops/commit/0651468547eab92f29ea0f74152752eb700af0cb))
* **storm-ops:** Resolved issue with prepare script in workspace root ([4caa35a](https://github.com/storm-software/storm-ops/commit/4caa35a09421e0ac48a0d2eddc27843c4dcff6e7))
* **storm-ops:** Resolved issues with build/CI ([fc81a8f](https://github.com/storm-software/storm-ops/commit/fc81a8f527d7b0a069818243f955d05062a4efac))
* **storm-ops:** Resolved issues with pnpm lockfile ([563238c](https://github.com/storm-software/storm-ops/commit/563238cad00bc4042512438aee4072a084cfce99))
* **storm-ops:** Update linting tools, and scripts, to use ES modules ([59cb4a1](https://github.com/storm-software/storm-ops/commit/59cb4a18772bbe85a8d88aa356c37b799ce0d11f))
* **storm-ops:** Update lockfile for monorepo ([fc39b4a](https://github.com/storm-software/storm-ops/commit/fc39b4a32e199550eddf85360728e9253d210fa7))
* **storm-ops:** Update pnpm lockfile ([f08a730](https://github.com/storm-software/storm-ops/commit/f08a7309f56fabbf6d0c108b3a57834a0ec05429))


### Features

* **create-storm-workspace:** Initial check-in for storm-ops monorepo ([ecb9822](https://github.com/storm-software/storm-ops/commit/ecb9822741fd989c3ce68fd7d07547e8b925cd9d))
* **git-tools:** Move the semantic-release-plugin into the git-tools package ([663e7ca](https://github.com/storm-software/storm-ops/commit/663e7ca6f51bf141b698a6448f88471278a2c77f))
* **semantic-release-plugin:** Resolve issues with plugin so release executes ([b7164b5](https://github.com/storm-software/storm-ops/commit/b7164b5b5b077da44a40141ade245ddd26ae54ee))
* **semantic-release-plugin:** Split out the semantic release plugin into it's own project ([317e52c](https://github.com/storm-software/storm-ops/commit/317e52ca4278855a87a5d1f8b52faab610a35ba8))
* **storm-ops:** Converted repository eslint to flat structure ([a738c3a](https://github.com/storm-software/storm-ops/commit/a738c3a9839cd5262e98029641f7a9a4d886e117))
* **testing-tools:** Added testing-tools library for common test functionality ([08d3ccd](https://github.com/storm-software/storm-ops/commit/08d3ccda5508db5c9abf2481900f9d9826d6ece1))
