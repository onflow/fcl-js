# @onflow/config

## 1.1.0

### Minor Changes

- [#1481](https://github.com/onflow/fcl-js/pull/1481) [`e10e3c9c`](https://github.com/onflow/fcl-js/commit/e10e3c9c1f611e7dfd8a0bf7292473c71c2e04b9) Thanks [@chasefleming](https://github.com/chasefleming)! - Remove need to manually add contract placeholders in config by ingesting flow.json with config.load

- [#1511](https://github.com/onflow/fcl-js/pull/1511) [`de7ffa47`](https://github.com/onflow/fcl-js/commit/de7ffa4768ea19e9378e7db74c85750b6554027c) Thanks [@justinbarry](https://github.com/justinbarry)! - Put contract addr in `system.contracts.*` namespace

- [#1575](https://github.com/onflow/fcl-js/pull/1575) [`bbdeea32`](https://github.com/onflow/fcl-js/commit/bbdeea32f024d6eea4a74c94023e01688a38b6cb) Thanks [@chasefleming](https://github.com/chasefleming)! - Exclude tests from type gen

- [#1511](https://github.com/onflow/fcl-js/pull/1511) [`48ff4330`](https://github.com/onflow/fcl-js/commit/48ff43303c30bab86274bd281f6af28affdb2f25) Thanks [@justinbarry](https://github.com/justinbarry)! - Add support for `import "ContractName"` syntax in scripts and transactions.

- [#1577](https://github.com/onflow/fcl-js/pull/1577) [`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4) Thanks [@chasefleming](https://github.com/chasefleming)! - Add npmignore file for build

- [#1570](https://github.com/onflow/fcl-js/pull/1570) [`f68c1433`](https://github.com/onflow/fcl-js/commit/f68c14337b5470b4d79ec682f7bb41ddeae2e020) Thanks [@chasefleming](https://github.com/chasefleming)! - Add types for config package.

### Patch Changes

- [#1663](https://github.com/onflow/fcl-js/pull/1663) [`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e) Thanks [@nialexsan](https://github.com/nialexsan)! - Upgrade jest to v29.5 and update tests accordingly. Change build to transpile with ESM modules.

- [#1658](https://github.com/onflow/fcl-js/pull/1658) [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106) Thanks [@nialexsan](https://github.com/nialexsan)! - Align jest version

- [#1629](https://github.com/onflow/fcl-js/pull/1629) [`544d8ebb`](https://github.com/onflow/fcl-js/commit/544d8ebb298ce1be8491d5609729110211b83242) Thanks [@chasefleming](https://github.com/chasefleming)! - Fix key warning when key/file/location format is used in flow.json

- [#1604](https://github.com/onflow/fcl-js/pull/1604) [`a4a1c7bf`](https://github.com/onflow/fcl-js/commit/a4a1c7bf0be9facb213f56a91d1a66b60bdea64b) Thanks [@chasefleming](https://github.com/chasefleming)! - Fix config types when invoked as a function

- Updated dependencies [[`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e), [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106), [`35052784`](https://github.com/onflow/fcl-js/commit/3505278418e64045248c04fd21f0c09ddbb3132e), [`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4)]:
  - @onflow/util-actor@1.2.0

## 1.1.0-alpha.8

### Patch Changes

- [#1663](https://github.com/onflow/fcl-js/pull/1663) [`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e) Thanks [@nialexsan](https://github.com/nialexsan)! - Upgrade jest to v29.5 and update tests accordingly. Change build to transpile with ESM modules.

- Updated dependencies [[`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e)]:
  - @onflow/util-actor@1.2.0-alpha.3

## 1.1.0-alpha.7

### Patch Changes

- [#1658](https://github.com/onflow/fcl-js/pull/1658) [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106) Thanks [@nialexsan](https://github.com/nialexsan)! - Align jest version

- Updated dependencies [[`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106)]:
  - @onflow/util-actor@1.2.0-alpha.2

## 1.1.0-alpha.6

### Patch Changes

- [#1629](https://github.com/onflow/fcl-js/pull/1629) [`544d8ebb`](https://github.com/onflow/fcl-js/commit/544d8ebb298ce1be8491d5609729110211b83242) Thanks [@chasefleming](https://github.com/chasefleming)! - Fix key warning when key/file/location format is used in flow.json

- Updated dependencies [[`35052784`](https://github.com/onflow/fcl-js/commit/3505278418e64045248c04fd21f0c09ddbb3132e)]:
  - @onflow/util-actor@1.2.0-alpha.1

## 1.1.0-alpha.5

### Patch Changes

- [#1604](https://github.com/onflow/fcl-js/pull/1604) [`a4a1c7bf`](https://github.com/onflow/fcl-js/commit/a4a1c7bf0be9facb213f56a91d1a66b60bdea64b) Thanks [@chasefleming](https://github.com/chasefleming)! - Fix config types when invoked as a function

## 1.1.0-alpha.4

### Minor Changes

- [#1577](https://github.com/onflow/fcl-js/pull/1577) [`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4) Thanks [@chasefleming](https://github.com/chasefleming)! - Add npmignore file for build

### Patch Changes

- Updated dependencies [[`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4)]:
  - @onflow/util-actor@1.2.0-alpha.0

## 1.1.0-alpha.3

### Minor Changes

- [#1575](https://github.com/onflow/fcl-js/pull/1575) [`bbdeea32`](https://github.com/onflow/fcl-js/commit/bbdeea32f024d6eea4a74c94023e01688a38b6cb) Thanks [@chasefleming](https://github.com/chasefleming)! - Exclude tests from type gen

## 1.1.0-alpha.2

### Minor Changes

- [#1570](https://github.com/onflow/fcl-js/pull/1570) [`f68c1433`](https://github.com/onflow/fcl-js/commit/f68c14337b5470b4d79ec682f7bb41ddeae2e020) Thanks [@chasefleming](https://github.com/chasefleming)! - Add types for config package.

## 1.1.0-alpha.1

### Minor Changes

- [#1511](https://github.com/onflow/fcl-js/pull/1511) [`de7ffa47`](https://github.com/onflow/fcl-js/commit/de7ffa4768ea19e9378e7db74c85750b6554027c) Thanks [@justinbarry](https://github.com/justinbarry)! - Put contract addr in `system.contracts.*` namespace

- [#1511](https://github.com/onflow/fcl-js/pull/1511) [`48ff4330`](https://github.com/onflow/fcl-js/commit/48ff43303c30bab86274bd281f6af28affdb2f25) Thanks [@justinbarry](https://github.com/justinbarry)! - Add support for `import "ContractName"` syntax in scripts and transactions.

## 1.1.0-alpha.0

### Minor Changes

- [#1481](https://github.com/onflow/fcl-js/pull/1481) [`e10e3c9c`](https://github.com/onflow/fcl-js/commit/e10e3c9c1f611e7dfd8a0bf7292473c71c2e04b9) Thanks [@chasefleming](https://github.com/chasefleming)! - Remove need to manually add contract placeholders in config by ingesting flow.json with config.load

## 1.0.5

### Patch Changes

- [#1443](https://github.com/onflow/fcl-js/pull/1443) [`7bdfa016`](https://github.com/onflow/fcl-js/commit/7bdfa016823d1caac23143351940b42f65d4d1c4) Thanks [@huyndo](https://github.com/huyndo)! - PKG - [config] Fix config overload prone to race condition

## 1.0.4

### Patch Changes

- [#1436](https://github.com/onflow/fcl-js/pull/1436) [`87771cd6`](https://github.com/onflow/fcl-js/commit/87771cd6db2cea13787502522a292e75ce43c4f0) Thanks [@justinbarry](https://github.com/justinbarry)! - Upgrade @onflow/fcl-bundle 1.2.0-alpha.0 -> 1.2.0

- Updated dependencies [[`87771cd6`](https://github.com/onflow/fcl-js/commit/87771cd6db2cea13787502522a292e75ce43c4f0)]:
  - @onflow/util-actor@1.1.2

## 1.0.3

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- Updated dependencies [[`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/util-actor@1.1.1

## 1.0.3-alpha.0

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- Updated dependencies [[`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/util-actor@1.1.1-alpha.0

## 1.0.2

### Patch Changes

- Updated dependencies [[`4ec2bdc9`](https://github.com/onflow/fcl-js/commit/4ec2bdc9805ac081bdc8003b6e1ea52e02d3909d)]:
  - @onflow/util-actor@1.1.0

## 1.0.2-alpha.0

### Patch Changes

- Updated dependencies [[`4ec2bdc9`](https://github.com/onflow/fcl-js/commit/4ec2bdc9805ac081bdc8003b6e1ea52e02d3909d)]:
  - @onflow/util-actor@1.1.0-alpha.0

## 1.0.1

### Patch Changes

- [#1178](https://github.com/onflow/fcl-js/pull/1178) [`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4) Thanks [@jribbink](https://github.com/jribbink)! - Add --no-compress to watch scripts for easier debugging

- Updated dependencies [[`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4)]:
  - @onflow/util-actor@1.0.1

## 1.0.0

### Patch Changes

- [#1124](https://github.com/onflow/fcl-js/pull/1124) [`9c191c15`](https://github.com/onflow/fcl-js/commit/9c191c1520ee772b4343265a42ad0e995a92dd9a) Thanks [@chasefleming](https://github.com/chasefleming)! - Create config package

* [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

* Updated dependencies [[`de47af64`](https://github.com/onflow/fcl-js/commit/de47af647a5bdad154a2d83e2ea2260ab54f0c60), [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8), [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854)]:
  - @onflow/util-actor@1.0.0

## 1.0.0-alpha.2

### Patch Changes

- [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

- Updated dependencies [[`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8)]:
  - @onflow/util-actor@1.0.0-alpha.2

## 1.0.0-alpha.1

### Patch Changes

- [#1124](https://github.com/onflow/fcl-js/pull/1124) [`9c191c15`](https://github.com/onflow/fcl-js/commit/9c191c1520ee772b4343265a42ad0e995a92dd9a) Thanks [@chasefleming](https://github.com/chasefleming)! - Create config package

- Updated dependencies [[`de47af64`](https://github.com/onflow/fcl-js/commit/de47af647a5bdad154a2d83e2ea2260ab54f0c60)]:
  - @onflow/util-actor@1.0.0-alpha.1
