# @onflow/transport-http

## 1.4.0

### Minor Changes

- [#1324](https://github.com/onflow/fcl-js/pull/1324) [`45607fae`](https://github.com/onflow/fcl-js/commit/45607fae1d99adaa6e2c9ebbb8dc2f7e0c267033) Thanks [@jribbink](https://github.com/jribbink)! - Add http headers as option to in httpRequest

### Patch Changes

- [#1321](https://github.com/onflow/fcl-js/pull/1321) [`422914bc`](https://github.com/onflow/fcl-js/commit/422914bcdc4c1b44c61d3ec1850bf57114f31a6b) Thanks [@jribbink](https://github.com/jribbink)! - Make sendGetAccountAtLatestBlockRequest execute at latest sealed block instead of latest finalized block

* [#1278](https://github.com/onflow/fcl-js/pull/1278) [`b9577b63`](https://github.com/onflow/fcl-js/commit/b9577b6355be06dec98f1e11101594fa65e66cf7) Thanks [@jribbink](https://github.com/jribbink)! - Add error message if using non-HTTP/REST endpoint via transport-http

- [#1303](https://github.com/onflow/fcl-js/pull/1303) [`c83c4606`](https://github.com/onflow/fcl-js/commit/c83c4606f1c78e7addaadece89350b19cb5544d6) Thanks [@jribbink](https://github.com/jribbink)! - Removed @onflow/util-node-http-modules, added node-fetch

* [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- [#1270](https://github.com/onflow/fcl-js/pull/1270) [`4d59f80c`](https://github.com/onflow/fcl-js/commit/4d59f80c0a8b45c82a28a05e6c579f4376107b86) Thanks [@jribbink](https://github.com/jribbink)! - Fix sendGetAccount throwing error if account has no keys

- Updated dependencies [[`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/util-address@1.0.2
  - @onflow/util-invariant@1.0.2
  - @onflow/util-logger@1.1.1
  - @onflow/util-template@1.0.3

## 1.3.1-alpha.2

### Patch Changes

- [#1321](https://github.com/onflow/fcl-js/pull/1321) [`422914bc`](https://github.com/onflow/fcl-js/commit/422914bcdc4c1b44c61d3ec1850bf57114f31a6b) Thanks [@jribbink](https://github.com/jribbink)! - Make sendGetAccountAtLatestBlockRequest execute at latest sealed block instead of latest finalized block

## 1.3.1-alpha.1

### Patch Changes

- [#1278](https://github.com/onflow/fcl-js/pull/1278) [`b9577b63`](https://github.com/onflow/fcl-js/commit/b9577b6355be06dec98f1e11101594fa65e66cf7) Thanks [@jribbink](https://github.com/jribbink)! - Add error message if using non-HTTP/REST endpoint via transport-http

* [#1303](https://github.com/onflow/fcl-js/pull/1303) [`c83c4606`](https://github.com/onflow/fcl-js/commit/c83c4606f1c78e7addaadece89350b19cb5544d6) Thanks [@jribbink](https://github.com/jribbink)! - Removed @onflow/util-node-http-modules, added node-fetch

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- Updated dependencies [[`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/util-address@1.0.2-alpha.0
  - @onflow/util-invariant@1.0.2-alpha.0
  - @onflow/util-logger@1.1.1-alpha.1
  - @onflow/util-template@1.0.3-alpha.0

## 1.3.1-alpha.0

### Patch Changes

- [#1270](https://github.com/onflow/fcl-js/pull/1270) [`4d59f80c`](https://github.com/onflow/fcl-js/commit/4d59f80c0a8b45c82a28a05e6c579f4376107b86) Thanks [@jribbink](https://github.com/jribbink)! - Fix sendGetAccount throwing error if account has no keys

## 1.3.0

### Minor Changes

- [#1242](https://github.com/onflow/fcl-js/pull/1242) [`06279c1d`](https://github.com/onflow/fcl-js/commit/06279c1d27433893494b6a79b7f742ea9a7fab8e) Thanks [@jribbink](https://github.com/jribbink)! - Add request retry for 408 (Request Timeout) status code

* [#1196](https://github.com/onflow/fcl-js/pull/1196) [`cd218e84`](https://github.com/onflow/fcl-js/commit/cd218e843acfc390049b391d36c447ce93668221) Thanks [@jribbink](https://github.com/jribbink)! - Added errorMessage property to HTTPRequestError to expose Access API errors when making requests

### Patch Changes

- [#1197](https://github.com/onflow/fcl-js/pull/1197) [`d9bc1cc6`](https://github.com/onflow/fcl-js/commit/d9bc1cc671f143d2f37cad6eb6b80123f1f3d760) Thanks [@jribbink](https://github.com/jribbink)! - Fix issue where httpRequest errors were thrown inside a promise and could not be caught on node

* [#1218](https://github.com/onflow/fcl-js/pull/1218) [`cc422a78`](https://github.com/onflow/fcl-js/commit/cc422a781d0e87ba8945c336902bbc9542d5b4c4) Thanks [@jribbink](https://github.com/jribbink)! - Fix interaction arguments in http request body broken by prettier

* Updated dependencies [[`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0)]:
  - @onflow/util-template@1.0.2

## 1.3.0-alpha.3

### Patch Changes

- Updated dependencies [[`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0)]:
  - @onflow/util-template@1.0.2-alpha.0

## 1.3.0-alpha.2

### Minor Changes

- [#1242](https://github.com/onflow/fcl-js/pull/1242) [`06279c1d`](https://github.com/onflow/fcl-js/commit/06279c1d27433893494b6a79b7f742ea9a7fab8e) Thanks [@jribbink](https://github.com/jribbink)! - Add request retry for 408 (Request Timeout) status code

## 1.3.0-alpha.1

### Patch Changes

- [#1218](https://github.com/onflow/fcl-js/pull/1218) [`cc422a78`](https://github.com/onflow/fcl-js/commit/cc422a781d0e87ba8945c336902bbc9542d5b4c4) Thanks [@jribbink](https://github.com/jribbink)! - Fix interaction arguments in http request body broken by prettier

## 1.3.0-alpha.0

### Minor Changes

- [#1196](https://github.com/onflow/fcl-js/pull/1196) [`cd218e84`](https://github.com/onflow/fcl-js/commit/cd218e843acfc390049b391d36c447ce93668221) Thanks [@jribbink](https://github.com/jribbink)! - Added errorMessage property to HTTPRequestError to expose Access API errors when making requests

### Patch Changes

- [#1197](https://github.com/onflow/fcl-js/pull/1197) [`d9bc1cc6`](https://github.com/onflow/fcl-js/commit/d9bc1cc671f143d2f37cad6eb6b80123f1f3d760) Thanks [@jribbink](https://github.com/jribbink)! - Fix issue where httpRequest errors were thrown inside a promise and could not be caught on node

## 1.2.0

### Minor Changes

- [#1188](https://github.com/onflow/fcl-js/pull/1188) [`b873a0fa`](https://github.com/onflow/fcl-js/commit/b873a0fa401d46b831f089118e746ab91b264f6c) Thanks [@jribbink](https://github.com/jribbink)! - Added `statusCode` to `transactionStatus` (previously always 0)

### Patch Changes

- Updated dependencies [[`5fd10864`](https://github.com/onflow/fcl-js/commit/5fd10864c33ec5fb178b7cd85ef823ae08c4ff04)]:
  - @onflow/util-node-http-modules@1.0.2

## 1.1.0

### Minor Changes

- [#1180](https://github.com/onflow/fcl-js/pull/1180) [`f348803d`](https://github.com/onflow/fcl-js/commit/f348803dbaaebad6d7081248b41f5582d5627d86) Thanks [@jribbink](https://github.com/jribbink)! - Added automatic retries for failed requests with 500,502,503,504 status code

### Patch Changes

- [#1178](https://github.com/onflow/fcl-js/pull/1178) [`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4) Thanks [@jribbink](https://github.com/jribbink)! - Add --no-compress to watch scripts for easier debugging

- Updated dependencies [[`48d2b11e`](https://github.com/onflow/fcl-js/commit/48d2b11e3c88fac8f503283fd080d161b38460a3), [`67bc4f61`](https://github.com/onflow/fcl-js/commit/67bc4f612193c6e703acfb09fc756a28c9c4f28a), [`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4)]:
  - @onflow/util-node-http-modules@1.0.1
  - @onflow/util-address@1.0.1
  - @onflow/util-invariant@1.0.1
  - @onflow/util-template@1.0.1

## 1.0.0

### Major Changes

- [#1100](https://github.com/onflow/fcl-js/pull/1100) [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854) Thanks [@justinbarry](https://github.com/justinbarry)! - Release 1.0.0 alpha

### Patch Changes

- [#1129](https://github.com/onflow/fcl-js/pull/1129) [`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Add blockId to GetTransactionStatus response

* [#1138](https://github.com/onflow/fcl-js/pull/1138) [`b2c95e77`](https://github.com/onflow/fcl-js/commit/b2c95e776a3bbfd769778e0bae767fdd69ba6143) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Propagate up http error in node environment

- [#1132](https://github.com/onflow/fcl-js/pull/1132) [`828a7b2b`](https://github.com/onflow/fcl-js/commit/828a7b2b4babb6485218e67e49f3a8ba9d4488fd) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Expose error returned from AN through HTTPRequestError

* [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

- [#1115](https://github.com/onflow/fcl-js/pull/1115) [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - **BREAKING** Remove deprecated block builders, interaction types and send methods.

- Updated dependencies [[`2768d1fa`](https://github.com/onflow/fcl-js/commit/2768d1fac5c74f7fc81cd0810fb7f30b68f8ab6d), [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8), [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854)]:
  - @onflow/util-address@1.0.0
  - @onflow/util-invariant@1.0.0
  - @onflow/util-node-http-modules@1.0.0
  - @onflow/util-template@1.0.0

## 1.0.0-alpha.2

### Patch Changes

- [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

- Updated dependencies [[`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8)]:
  - @onflow/util-address@1.0.0-alpha.1
  - @onflow/util-invariant@1.0.0-alpha.1
  - @onflow/util-node-http-modules@1.0.0-alpha.1
  - @onflow/util-template@1.0.0-alpha.1

## 1.0.0-alpha.1

### Patch Changes

- [#1129](https://github.com/onflow/fcl-js/pull/1129) [`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Add blockId to GetTransactionStatus response

* [#1138](https://github.com/onflow/fcl-js/pull/1138) [`b2c95e77`](https://github.com/onflow/fcl-js/commit/b2c95e776a3bbfd769778e0bae767fdd69ba6143) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Propagate up http error in node environment

- [#1132](https://github.com/onflow/fcl-js/pull/1132) [`828a7b2b`](https://github.com/onflow/fcl-js/commit/828a7b2b4babb6485218e67e49f3a8ba9d4488fd) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Expose error returned from AN through HTTPRequestError

* [#1115](https://github.com/onflow/fcl-js/pull/1115) [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - **BREAKING** Remove deprecated block builders, interaction types and send methods.

* 2022-04-05 -- **BREAKING** [@chasefleming](https://github.com/chasefleming): Remove the following from block response:

  - `block.collectionGuarantees.signatures`
  - `block.blockSeals.executionReceiptSignatures`
  - `block.blockSeals.resultApprovalSignatures`
  - `block.signatures`

## 1.0.0-alpha.0

### Major Changes

- Release 1.0.0 alpha

### Patch Changes

- Updated dependencies [7469c5c3]
- Updated dependencies

  - @onflow/util-address@1.0.0-alpha.0
  - @onflow/util-invariant@1.0.0-alpha.0
  - @onflow/util-node-http-modules@1.0.0-alpha.0
  - @onflow/util-template@1.0.0-alpha.0

- 2022-03-16 -- [@bthaile](https://github.com/bthaile) Payer can now be an array.
- 2022-02-25 -- Use node require to consume node standard libraries
- 2022-02-11 -- Uses Buffer as provided by context injection

### 0.0.6 -- 2022-02-04

- 2022-02-04 -- Remove `0x` prefix from public keys in get account response.

### 0.0.5 -- 2022-02-04

- 2022-02-04 -- Decodes event payloads from base64

### 0.0.3 -- 2022-02-02

- 2022-02-03 -- Adds statusCode placeholder to get transaction status response.

### 0.0.2 -- 2022-02-01

- 2022-02-01 -- Removes signer_index field from envelope signature and payload signature.
