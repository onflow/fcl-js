# @onflow/transport-grpc

## 1.1.2

### Patch Changes

- [#1436](https://github.com/onflow/fcl-js/pull/1436) [`87771cd6`](https://github.com/onflow/fcl-js/commit/87771cd6db2cea13787502522a292e75ce43c4f0) Thanks [@justinbarry](https://github.com/justinbarry)! - Upgrade @onflow/fcl-bundle 1.2.0-alpha.0 -> 1.2.0

- Updated dependencies [[`87771cd6`](https://github.com/onflow/fcl-js/commit/87771cd6db2cea13787502522a292e75ce43c4f0)]:
  - @onflow/rlp@1.0.3
  - @onflow/util-address@1.0.3
  - @onflow/util-invariant@1.0.3
  - @onflow/util-template@1.0.4

## 1.1.1

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- Updated dependencies [[`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/rlp@1.0.2
  - @onflow/util-address@1.0.2
  - @onflow/util-invariant@1.0.2
  - @onflow/util-template@1.0.3

## 1.1.1-alpha.0

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- Updated dependencies [[`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/rlp@1.0.2-alpha.0
  - @onflow/util-address@1.0.2-alpha.0
  - @onflow/util-invariant@1.0.2-alpha.0
  - @onflow/util-template@1.0.3-alpha.0

## 1.1.0

### Minor Changes

- [#1206](https://github.com/onflow/fcl-js/pull/1206) [`6ae4469c`](https://github.com/onflow/fcl-js/commit/6ae4469cdaa9590ef110ed1c0ec6928d9ac09845) Thanks [@jribbink](https://github.com/jribbink)! - Added blockId to transport-grpc transaction status

### Patch Changes

- Updated dependencies [[`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0), [`6ae4469c`](https://github.com/onflow/fcl-js/commit/6ae4469cdaa9590ef110ed1c0ec6928d9ac09845)]:
  - @onflow/util-template@1.0.2
  - @onflow/protobuf@1.1.0

## 1.1.0-alpha.1

### Patch Changes

- Updated dependencies [[`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0)]:
  - @onflow/util-template@1.0.2-alpha.0

## 1.1.0-alpha.0

### Minor Changes

- [#1206](https://github.com/onflow/fcl-js/pull/1206) [`6ae4469c`](https://github.com/onflow/fcl-js/commit/6ae4469cdaa9590ef110ed1c0ec6928d9ac09845) Thanks [@jribbink](https://github.com/jribbink)! - Added blockId to transport-grpc transaction status

### Patch Changes

- Updated dependencies [[`6ae4469c`](https://github.com/onflow/fcl-js/commit/6ae4469cdaa9590ef110ed1c0ec6928d9ac09845)]:
  - @onflow/protobuf@1.1.0-alpha.0

## 1.0.1

### Patch Changes

- [#1178](https://github.com/onflow/fcl-js/pull/1178) [`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4) Thanks [@jribbink](https://github.com/jribbink)! - Add --no-compress to watch scripts for easier debugging

- Updated dependencies [[`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4)]:
  - @onflow/rlp@1.0.1
  - @onflow/util-address@1.0.1
  - @onflow/util-invariant@1.0.1
  - @onflow/util-template@1.0.1

## 1.0.0

### Major Changes

- [#1100](https://github.com/onflow/fcl-js/pull/1100) [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854) Thanks [@justinbarry](https://github.com/justinbarry)! - Release 1.0.0 alpha

### Patch Changes

- [#1129](https://github.com/onflow/fcl-js/pull/1129) [`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Add blockId to GetTransactionStatus response

* [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

- [#1115](https://github.com/onflow/fcl-js/pull/1115) [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - **BREAKING** Remove deprecated block builders, interaction types and send methods.

- Updated dependencies [[`2768d1fa`](https://github.com/onflow/fcl-js/commit/2768d1fac5c74f7fc81cd0810fb7f30b68f8ab6d), [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8), [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854)]:
  - @onflow/util-address@1.0.0
  - @onflow/util-invariant@1.0.0
  - @onflow/rlp@1.0.0
  - @onflow/util-template@1.0.0
  - @onflow/protobuf@1.0.0

## 1.0.0-alpha.3

### Patch Changes

- [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

- Updated dependencies [[`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8)]:
  - @onflow/rlp@1.0.0-alpha.1
  - @onflow/util-address@1.0.0-alpha.1
  - @onflow/util-invariant@1.0.0-alpha.1
  - @onflow/util-template@1.0.0-alpha.1

## 1.0.0-alpha.2

### Patch Changes

- [#1129](https://github.com/onflow/fcl-js/pull/1129) [`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Add blockId to GetTransactionStatus response

* [#1115](https://github.com/onflow/fcl-js/pull/1115) [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - **BREAKING** Remove deprecated block builders, interaction types and send methods.

* 2022-04-05 -- **BREAKING** [@chasefleming](https://github.com/chasefleming): Remove the following from block response:

  - `block.collectionGuarantees.signatures`
  - `block.blockSeals.executionReceiptSignatures`
  - `block.blockSeals.resultApprovalSignatures`
  - `block.signatures`

## 1.0.0-alpha.1

### Major Changes

- Release 1.0.0 alpha

### Patch Changes

- Updated dependencies [7469c5c3]
- Updated dependencies

  - @onflow/util-address@1.0.0-alpha.0
  - @onflow/util-invariant@1.0.0-alpha.0
  - @onflow/protobuf@1.0.0-alpha.0
  - @onflow/rlp@1.0.0-alpha.0
  - @onflow/util-template@1.0.0-alpha.0

- 2022-03-16 -- [@bthaile](https://github.com/bthaile) Payer can now be an array.
- 2022-02-11 -- Uses Buffer as provided by context injection

## 0.0.2 -- 2022-02-02

- 2022-02-02 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds statusString lookup based off of status field.

## 0.0.1 -- 2022-01-13

- 2022-01-13 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Initial Implementation.
