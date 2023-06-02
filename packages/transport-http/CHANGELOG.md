# @onflow/transport-http

## 1.6.0

### Minor Changes

- [#1580](https://github.com/onflow/fcl-js/pull/1580) [`82810ef0`](https://github.com/onflow/fcl-js/commit/82810ef000ebdf4dde4dbd7846d31dd335cd9cbb) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - - Adds support for retrying requests when an ETIMEDOUT error occurs.

  - Adds a default 30 second timeout to all requests, after which they will be retried.

- [#1420](https://github.com/onflow/fcl-js/pull/1420) [`c20bc344`](https://github.com/onflow/fcl-js/commit/c20bc34448a22966d349b0b1c4c0f742ae93a355) Thanks [@huyndo](https://github.com/huyndo)! - Add GetNetworkParameters interaction and a util to get chain ID

- [#1577](https://github.com/onflow/fcl-js/pull/1577) [`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4) Thanks [@chasefleming](https://github.com/chasefleming)! - Add npmignore file for build

### Patch Changes

- [#1663](https://github.com/onflow/fcl-js/pull/1663) [`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e) Thanks [@nialexsan](https://github.com/nialexsan)! - Upgrade jest to v29.5 and update tests accordingly. Change build to transpile with ESM modules.

- [#1658](https://github.com/onflow/fcl-js/pull/1658) [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106) Thanks [@nialexsan](https://github.com/nialexsan)! - Align jest version

- [#1608](https://github.com/onflow/fcl-js/pull/1608) [`0ec0c5d4`](https://github.com/onflow/fcl-js/commit/0ec0c5d46b780e2b277846f9271ab311aa048b19) Thanks [@nialexsan](https://github.com/nialexsan)! - prep for react-native package

- [#1660](https://github.com/onflow/fcl-js/pull/1660) [`9276f6ea`](https://github.com/onflow/fcl-js/commit/9276f6ea37367dfacce19bbffbad6fda56a1a645) Thanks [@nialexsan](https://github.com/nialexsan)! - Switch to cross-fetch

- Updated dependencies [[`2d143bc7`](https://github.com/onflow/fcl-js/commit/2d143bc7b30f59e9f9289eee020cfaae74b4f4e1), [`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e), [`bbdeea32`](https://github.com/onflow/fcl-js/commit/bbdeea32f024d6eea4a74c94023e01688a38b6cb), [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106), [`5bec5576`](https://github.com/onflow/fcl-js/commit/5bec5576a79809d0684411736e3f4c02b8051c22), [`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4)]:
  - @onflow/util-address@1.1.0
  - @onflow/util-invariant@1.1.0
  - @onflow/util-logger@1.2.0
  - @onflow/util-template@1.1.0

## 1.6.0-alpha.7

### Patch Changes

- [#1660](https://github.com/onflow/fcl-js/pull/1660) [`9276f6ea`](https://github.com/onflow/fcl-js/commit/9276f6ea37367dfacce19bbffbad6fda56a1a645) Thanks [@nialexsan](https://github.com/nialexsan)! - Switch to cross-fetch

## 1.6.0-alpha.6

### Patch Changes

- [#1663](https://github.com/onflow/fcl-js/pull/1663) [`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e) Thanks [@nialexsan](https://github.com/nialexsan)! - Upgrade jest to v29.5 and update tests accordingly. Change build to transpile with ESM modules.

- Updated dependencies [[`62dfafa9`](https://github.com/onflow/fcl-js/commit/62dfafa9c7adc3933822b0d3171d6eb025f1719e)]:
  - @onflow/util-address@1.1.0-alpha.5
  - @onflow/util-invariant@1.1.0-alpha.2
  - @onflow/util-logger@1.2.0-alpha.3
  - @onflow/util-template@1.1.0-alpha.2

## 1.6.0-alpha.5

### Patch Changes

- [#1658](https://github.com/onflow/fcl-js/pull/1658) [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106) Thanks [@nialexsan](https://github.com/nialexsan)! - Align jest version

- Updated dependencies [[`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106)]:
  - @onflow/util-invariant@1.1.0-alpha.1
  - @onflow/util-template@1.1.0-alpha.1
  - @onflow/util-address@1.1.0-alpha.4
  - @onflow/util-logger@1.2.0-alpha.2

## 1.6.0-alpha.4

### Patch Changes

- [#1608](https://github.com/onflow/fcl-js/pull/1608) [`0ec0c5d4`](https://github.com/onflow/fcl-js/commit/0ec0c5d46b780e2b277846f9271ab311aa048b19) Thanks [@nialexsan](https://github.com/nialexsan)! - prep for react-native package

## 1.6.0-alpha.3

### Minor Changes

- [#1580](https://github.com/onflow/fcl-js/pull/1580) [`82810ef0`](https://github.com/onflow/fcl-js/commit/82810ef000ebdf4dde4dbd7846d31dd335cd9cbb) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - - Adds support for retrying requests when an ETIMEDOUT error occurs.
  - Adds a default 30 second timeout to all requests, after which they will be retried.

## 1.6.0-alpha.2

### Minor Changes

- [#1577](https://github.com/onflow/fcl-js/pull/1577) [`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4) Thanks [@chasefleming](https://github.com/chasefleming)! - Add npmignore file for build

### Patch Changes

- Updated dependencies [[`d9a49531`](https://github.com/onflow/fcl-js/commit/d9a495316cd03ed0de99e0f01d1b8850a1f0eec4)]:
  - @onflow/util-address@1.1.0-alpha.3
  - @onflow/util-invariant@1.1.0-alpha.0
  - @onflow/util-logger@1.2.0-alpha.1
  - @onflow/util-template@1.1.0-alpha.0

## 1.6.0-alpha.1

### Minor Changes

- [#1420](https://github.com/onflow/fcl-js/pull/1420) [`c20bc344`](https://github.com/onflow/fcl-js/commit/c20bc34448a22966d349b0b1c4c0f742ae93a355) Thanks [@huyndo](https://github.com/huyndo)! - Add GetNetworkParameters interaction and a util to get chain ID

### Patch Changes

- Updated dependencies [[`5bec5576`](https://github.com/onflow/fcl-js/commit/5bec5576a79809d0684411736e3f4c02b8051c22)]:
  - @onflow/util-address@1.1.0-alpha.0

## 1.5.1-alpha.0

### Patch Changes

- Updated dependencies []:
  - @onflow/util-logger@1.1.3-alpha.0

## 1.5.0

### Minor Changes

- [#1362](https://github.com/onflow/fcl-js/pull/1362) [`9a1eb2b3`](https://github.com/onflow/fcl-js/commit/9a1eb2b3dec369d4f35ec2aa8b753ec1230c0efe) Thanks [@jribbink](https://github.com/jribbink)! - Retry 429 (Too many requests) responses which are used for access node rate limiting

### Patch Changes

- [#1362](https://github.com/onflow/fcl-js/pull/1362) [`9a1eb2b3`](https://github.com/onflow/fcl-js/commit/9a1eb2b3dec369d4f35ec2aa8b753ec1230c0efe) Thanks [@jribbink](https://github.com/jribbink)! - Catch JSON error when response body is empty

* [#1339](https://github.com/onflow/fcl-js/pull/1339) [`99e03af7`](https://github.com/onflow/fcl-js/commit/99e03af76e526593e5c989e43754ce23420e317f) Thanks [@jribbink](https://github.com/jribbink)! - Ensure that acct.tempId is always created withPrefix

## 1.5.0-alpha.1

### Minor Changes

- [#1362](https://github.com/onflow/fcl-js/pull/1362) [`9a1eb2b3`](https://github.com/onflow/fcl-js/commit/9a1eb2b3dec369d4f35ec2aa8b753ec1230c0efe) Thanks [@jribbink](https://github.com/jribbink)! - Retry 429 (Too many requests) responses which are used for access node rate limiting

### Patch Changes

- [#1362](https://github.com/onflow/fcl-js/pull/1362) [`9a1eb2b3`](https://github.com/onflow/fcl-js/commit/9a1eb2b3dec369d4f35ec2aa8b753ec1230c0efe) Thanks [@jribbink](https://github.com/jribbink)! - Catch JSON error when response body is empty

## 1.4.1-alpha.0

### Patch Changes

- [#1339](https://github.com/onflow/fcl-js/pull/1339) [`99e03af7`](https://github.com/onflow/fcl-js/commit/99e03af76e526593e5c989e43754ce23420e317f) Thanks [@jribbink](https://github.com/jribbink)! - Ensure that acct.tempId is always created withPrefix

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
