# @onflow/util-actor

## 1.1.1

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

## 1.1.1-alpha.0

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

## 1.1.0

### Minor Changes

- [#1243](https://github.com/onflow/fcl-js/pull/1243) [`4ec2bdc9`](https://github.com/onflow/fcl-js/commit/4ec2bdc9805ac081bdc8003b6e1ea52e02d3909d) Thanks [@jribbink](https://github.com/jribbink)! - Add error handling to actors. Second argument of callback is now an error object and fatal errors can be thrown with ctx.fatalError(e).

## 1.1.0-alpha.0

### Minor Changes

- [#1243](https://github.com/onflow/fcl-js/pull/1243) [`4ec2bdc9`](https://github.com/onflow/fcl-js/commit/4ec2bdc9805ac081bdc8003b6e1ea52e02d3909d) Thanks [@jribbink](https://github.com/jribbink)! - Add error handling to actors. Second argument of callback is now an error object and fatal errors can be thrown with ctx.fatalError(e).

## 1.0.1

### Patch Changes

- [#1178](https://github.com/onflow/fcl-js/pull/1178) [`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4) Thanks [@jribbink](https://github.com/jribbink)! - Add --no-compress to watch scripts for easier debugging

## 1.0.0

### Major Changes

- [#1100](https://github.com/onflow/fcl-js/pull/1100) [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854) Thanks [@justinbarry](https://github.com/justinbarry)! - Release 1.0.0 alpha

### Patch Changes

- [#1143](https://github.com/onflow/fcl-js/pull/1143) [`de47af64`](https://github.com/onflow/fcl-js/commit/de47af647a5bdad154a2d83e2ea2260ab54f0c60) Thanks [@gregsantos](https://github.com/gregsantos)! - Internal update to util-actor

* [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

## 1.0.0-alpha.2

### Patch Changes

- [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

## 1.0.0-alpha.1

### Patch Changes

- [#1143](https://github.com/onflow/fcl-js/pull/1143) [`de47af64`](https://github.com/onflow/fcl-js/commit/de47af647a5bdad154a2d83e2ea2260ab54f0c60) Thanks [@gregsantos](https://github.com/gregsantos)! - Internal update to util-actor

## 1.0.0-alpha.0

### Major Changes

- Release 1.0.0 alpha

- YYYY-MM-DD **BREAKING?** -- description

### 0.0.2 -- 2020-08-13

- 2020-08-13 -- Added exported fn `subscriber(address, spawnFn, callback)`
- 2020-08-13 -- Added exported fn `snapshoter(address, spawnFn)`
- 2020-08-13 -- Added `ctx.sendSelf()`
- 2020-08-13 -- Added `ctx.subscriberCount()`
- 2020-08-13 -- Added `ctx.hasSubs()`

### 0.0.1 -- 2020-07-17

- 2020-07-17 -- Initial Implementation
