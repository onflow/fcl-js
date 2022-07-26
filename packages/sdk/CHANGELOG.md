# @onflow/sdk

## 1.1.1

### Patch Changes

- [#1326](https://github.com/onflow/fcl-js/pull/1326) [`053ff10d`](https://github.com/onflow/fcl-js/commit/053ff10dbc1d6ec64b1cafec9dad6b58ad154552) Thanks [@jribbink](https://github.com/jribbink)! - Fix getAccount executing at latest finalized block instead of sealed block (version bump `@onflow/transport-http`)

* [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

* Updated dependencies [[`422914bc`](https://github.com/onflow/fcl-js/commit/422914bcdc4c1b44c61d3ec1850bf57114f31a6b), [`b9577b63`](https://github.com/onflow/fcl-js/commit/b9577b6355be06dec98f1e11101594fa65e66cf7), [`c83c4606`](https://github.com/onflow/fcl-js/commit/c83c4606f1c78e7addaadece89350b19cb5544d6), [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6), [`4d59f80c`](https://github.com/onflow/fcl-js/commit/4d59f80c0a8b45c82a28a05e6c579f4376107b86), [`45607fae`](https://github.com/onflow/fcl-js/commit/45607fae1d99adaa6e2c9ebbb8dc2f7e0c267033)]:
  - @onflow/transport-http@1.4.0
  - @onflow/config@1.0.3
  - @onflow/rlp@1.0.2
  - @onflow/util-actor@1.1.1
  - @onflow/util-address@1.0.2
  - @onflow/util-invariant@1.0.2
  - @onflow/util-logger@1.1.1
  - @onflow/util-template@1.0.3

## 1.1.1-alpha.2

### Patch Changes

- Fix getAccount executing at latest finalized block instead of sealed block (version bump `@onflow/transport-http`)

## 1.1.1-alpha.1

### Patch Changes

- [#1227](https://github.com/onflow/fcl-js/pull/1227) [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6) Thanks [@jribbink](https://github.com/jribbink)! - Switch to fcl-bundle instead of microbundle for build scripts

- Updated dependencies [[`b9577b63`](https://github.com/onflow/fcl-js/commit/b9577b6355be06dec98f1e11101594fa65e66cf7), [`c83c4606`](https://github.com/onflow/fcl-js/commit/c83c4606f1c78e7addaadece89350b19cb5544d6), [`352f1460`](https://github.com/onflow/fcl-js/commit/352f1460a2f34d228a74fa4bbc6fcf6e68a968b6)]:
  - @onflow/transport-http@1.3.1-alpha.1
  - @onflow/config@1.0.3-alpha.0
  - @onflow/rlp@1.0.2-alpha.0
  - @onflow/util-actor@1.1.1-alpha.0
  - @onflow/util-address@1.0.2-alpha.0
  - @onflow/util-invariant@1.0.2-alpha.0
  - @onflow/util-logger@1.1.1-alpha.1
  - @onflow/util-template@1.0.3-alpha.0

## 1.1.1-alpha.0

### Patch Changes

- Updated dependencies [[`4d59f80c`](https://github.com/onflow/fcl-js/commit/4d59f80c0a8b45c82a28a05e6c579f4376107b86)]:
  - @onflow/transport-http@1.3.1-alpha.0
  - @onflow/util-logger@1.1.1-alpha.0

## 1.1.0

### Minor Changes

- [#1183](https://github.com/onflow/fcl-js/pull/1183) [`e0d3a377`](https://github.com/onflow/fcl-js/commit/e0d3a377260338a37518f0ad2a52dcc618fd9bc5) Thanks [@jribbink](https://github.com/jribbink)! - Added deprecation warning for hard-coded DEFAULT_COMPUTE_LIMIT=10 (and increase to DEFAULT_COMPUTE_LIMIT=100 for now) and added sdk.defaultComputeLimit to config

### Patch Changes

- [#1245](https://github.com/onflow/fcl-js/pull/1245) [`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0) Thanks [@jribbink](https://github.com/jribbink)! - Switch deprecation warnings to standardized warnings introduced by @onflow/util-logger (log.deprecate)

* [#1191](https://github.com/onflow/fcl-js/pull/1191) [`90d5163a`](https://github.com/onflow/fcl-js/commit/90d5163a7723dd529324a271ea8accaa43a3d7be) Thanks [@jribbink](https://github.com/jribbink)! - Allow for integer string account.keyId in authorization function

- [#1263](https://github.com/onflow/fcl-js/pull/1263) [`45951f1a`](https://github.com/onflow/fcl-js/commit/45951f1af310d302ee708e43d1a939265f404d2c) Thanks [@jribbink](https://github.com/jribbink)! - Fix infinite recursion bug when using array authorization function (used for multiple signing keys)

* [#1218](https://github.com/onflow/fcl-js/pull/1218) [`cc422a78`](https://github.com/onflow/fcl-js/commit/cc422a781d0e87ba8945c336902bbc9542d5b4c4) Thanks [@jribbink](https://github.com/jribbink)! - Fix interaction arguments in http request body broken by prettier

- [#1212](https://github.com/onflow/fcl-js/pull/1212) [`1654ebbe`](https://github.com/onflow/fcl-js/commit/1654ebbe45ea5e4ca13536ed2139520ce21ee314) Thanks [@jribbink](https://github.com/jribbink)! - Make deprecation notice for getEvents use @onflow/util-logger instead of console.warn

* [#1199](https://github.com/onflow/fcl-js/pull/1199) [`d1765950`](https://github.com/onflow/fcl-js/commit/d176595021681e660ae0a06161340833280091fb) Thanks [@jribbink](https://github.com/jribbink)! - Fix issue where custom decoders did not properly override default decoders

* Updated dependencies [[`06279c1d`](https://github.com/onflow/fcl-js/commit/06279c1d27433893494b6a79b7f742ea9a7fab8e), [`d9bc1cc6`](https://github.com/onflow/fcl-js/commit/d9bc1cc671f143d2f37cad6eb6b80123f1f3d760), [`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0), [`cd218e84`](https://github.com/onflow/fcl-js/commit/cd218e843acfc390049b391d36c447ce93668221), [`cc422a78`](https://github.com/onflow/fcl-js/commit/cc422a781d0e87ba8945c336902bbc9542d5b4c4), [`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0), [`4ec2bdc9`](https://github.com/onflow/fcl-js/commit/4ec2bdc9805ac081bdc8003b6e1ea52e02d3909d)]:
  - @onflow/transport-http@1.3.0
  - @onflow/util-logger@1.1.0
  - @onflow/util-template@1.0.2
  - @onflow/util-actor@1.1.0
  - @onflow/config@1.0.2

## 1.1.0-alpha.4

### Patch Changes

- [#1263](https://github.com/onflow/fcl-js/pull/1263) [`45951f1a`](https://github.com/onflow/fcl-js/commit/45951f1af310d302ee708e43d1a939265f404d2c) Thanks [@jribbink](https://github.com/jribbink)! - Fix infinite recursion bug when using array authorization function (used for multiple signing keys)

## 1.1.0-alpha.3

### Patch Changes

- [#1245](https://github.com/onflow/fcl-js/pull/1245) [`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0) Thanks [@jribbink](https://github.com/jribbink)! - Switch deprecation warnings to standardized warnings introduced by @onflow/util-logger (log.deprecate)

- Updated dependencies [[`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0), [`d09ba0f0`](https://github.com/onflow/fcl-js/commit/d09ba0f00f53f93feb351a3da5e821eada6287f0), [`4ec2bdc9`](https://github.com/onflow/fcl-js/commit/4ec2bdc9805ac081bdc8003b6e1ea52e02d3909d)]:
  - @onflow/util-logger@1.1.0-alpha.2
  - @onflow/util-template@1.0.2-alpha.0
  - @onflow/util-actor@1.1.0-alpha.0
  - @onflow/transport-http@1.3.0-alpha.3
  - @onflow/config@1.0.2-alpha.0

## 1.1.0-alpha.2

### Minor Changes

- [#1183](https://github.com/onflow/fcl-js/pull/1183) [`e0d3a377`](https://github.com/onflow/fcl-js/commit/e0d3a377260338a37518f0ad2a52dcc618fd9bc5) Thanks [@jribbink](https://github.com/jribbink)! - Added deprecation warning for hard-coded DEFAULT_COMPUTE_LIMIT=10 (and increase to DEFAULT_COMPUTE_LIMIT=100 for now) and added sdk.defaultComputeLimit to config

### Patch Changes

- Updated dependencies [[`06279c1d`](https://github.com/onflow/fcl-js/commit/06279c1d27433893494b6a79b7f742ea9a7fab8e)]:
  - @onflow/transport-http@1.3.0-alpha.2
  - @onflow/util-logger@1.0.2-alpha.1

## 1.0.2-alpha.1

### Patch Changes

- [#1191](https://github.com/onflow/fcl-js/pull/1191) [`90d5163a`](https://github.com/onflow/fcl-js/commit/90d5163a7723dd529324a271ea8accaa43a3d7be) Thanks [@jribbink](https://github.com/jribbink)! - Allow for integer string account.keyId in authorization function

* [#1218](https://github.com/onflow/fcl-js/pull/1218) [`cc422a78`](https://github.com/onflow/fcl-js/commit/cc422a781d0e87ba8945c336902bbc9542d5b4c4) Thanks [@jribbink](https://github.com/jribbink)! - Fix interaction arguments in http request body broken by prettier

* Updated dependencies [[`cc422a78`](https://github.com/onflow/fcl-js/commit/cc422a781d0e87ba8945c336902bbc9542d5b4c4)]:
  - @onflow/transport-http@1.3.0-alpha.1

## 1.0.2-alpha.0

### Patch Changes

- [#1212](https://github.com/onflow/fcl-js/pull/1212) [`1654ebbe`](https://github.com/onflow/fcl-js/commit/1654ebbe45ea5e4ca13536ed2139520ce21ee314) Thanks [@jribbink](https://github.com/jribbink)! - Make deprecation notice for getEvents use @onflow/util-logger instead of console.warn

* [#1199](https://github.com/onflow/fcl-js/pull/1199) [`d1765950`](https://github.com/onflow/fcl-js/commit/d176595021681e660ae0a06161340833280091fb) Thanks [@jribbink](https://github.com/jribbink)! - Fix issue where custom decoders did not properly override default decoders

* Updated dependencies [[`d9bc1cc6`](https://github.com/onflow/fcl-js/commit/d9bc1cc671f143d2f37cad6eb6b80123f1f3d760), [`cd218e84`](https://github.com/onflow/fcl-js/commit/cd218e843acfc390049b391d36c447ce93668221)]:
  - @onflow/transport-http@1.3.0-alpha.0
  - @onflow/util-logger@1.0.2-alpha.0

## 1.0.1

### Patch Changes

- [#1178](https://github.com/onflow/fcl-js/pull/1178) [`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4) Thanks [@jribbink](https://github.com/jribbink)! - Add --no-compress to watch scripts for easier debugging

- Updated dependencies [[`9e7e4cfb`](https://github.com/onflow/fcl-js/commit/9e7e4cfbc026765019653b0e891e63a2d789ceb4), [`f348803d`](https://github.com/onflow/fcl-js/commit/f348803dbaaebad6d7081248b41f5582d5627d86)]:
  - @onflow/config@1.0.1
  - @onflow/rlp@1.0.1
  - @onflow/transport-http@1.1.0
  - @onflow/util-actor@1.0.1
  - @onflow/util-address@1.0.1
  - @onflow/util-invariant@1.0.1
  - @onflow/util-logger@1.0.1
  - @onflow/util-template@1.0.1

## 1.0.0

### Major Changes

- [#1100](https://github.com/onflow/fcl-js/pull/1100) [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854) Thanks [@justinbarry](https://github.com/justinbarry)! - Release 1.0.0 alpha

### Patch Changes

- [#1155](https://github.com/onflow/fcl-js/pull/1155) [`700433d5`](https://github.com/onflow/fcl-js/commit/700433d50d4156183b09b13781f7f74f23882586) Thanks [@caosbad](https://github.com/caosbad)! - Export encodeTransactionPayload, encodeTransactionEnvelope, and encodeTxIdFromVoucher from sdk.

* [#1156](https://github.com/onflow/fcl-js/pull/1156) [`6ff970df`](https://github.com/onflow/fcl-js/commit/6ff970dfc04281c86043e1cf8f5bceb633dc4186) Thanks [@justinbarry](https://github.com/justinbarry)! - Add sansPrefix for address before RLP encoding

- [#1129](https://github.com/onflow/fcl-js/pull/1129) [`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Add blockId to GetTransactionStatus response

* [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

- [#1115](https://github.com/onflow/fcl-js/pull/1115) [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - **BREAKING** Remove deprecated block builders, interaction types and send methods.

- Updated dependencies [[`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7), [`9c191c15`](https://github.com/onflow/fcl-js/commit/9c191c1520ee772b4343265a42ad0e995a92dd9a), [`de47af64`](https://github.com/onflow/fcl-js/commit/de47af647a5bdad154a2d83e2ea2260ab54f0c60), [`b2c95e77`](https://github.com/onflow/fcl-js/commit/b2c95e776a3bbfd769778e0bae767fdd69ba6143), [`2768d1fa`](https://github.com/onflow/fcl-js/commit/2768d1fac5c74f7fc81cd0810fb7f30b68f8ab6d), [`828a7b2b`](https://github.com/onflow/fcl-js/commit/828a7b2b4babb6485218e67e49f3a8ba9d4488fd), [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8), [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe), [`ced27ea8`](https://github.com/onflow/fcl-js/commit/ced27ea855988f02f1312c7b732aa107a410c854)]:
  - @onflow/transport-http@1.0.0
  - @onflow/config@1.0.0
  - @onflow/util-actor@1.0.0
  - @onflow/util-address@1.0.0
  - @onflow/util-invariant@1.0.0
  - @onflow/rlp@1.0.0
  - @onflow/util-logger@1.0.0
  - @onflow/util-template@1.0.0

## 1.0.0-alpha.2

### Patch Changes

- [#1164](https://github.com/onflow/fcl-js/pull/1164) [`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8) Thanks [@justinbarry](https://github.com/justinbarry)! - No longer minify released source code.

* [#1167](https://github.com/onflow/fcl-js/pull/1167) [`d6d0d1`](https://github.com/onflow/fcl-js/commit/cd6d0d1b43f57d316e1325ae415bd862e9eea200) Thanks [@justinbarry](https://github.com/justinbarry)! - Remove warning about interaction field renamings/deprecations.

- Updated dependencies [[`11229868`](https://github.com/onflow/fcl-js/commit/11229868cf916d204901f8bb3f76ee234e9152a8)]:
  - @onflow/config@1.0.0-alpha.2
  - @onflow/rlp@1.0.0-alpha.1
  - @onflow/transport-http@1.0.0-alpha.2
  - @onflow/util-actor@1.0.0-alpha.2
  - @onflow/util-address@1.0.0-alpha.1
  - @onflow/util-invariant@1.0.0-alpha.1
  - @onflow/util-logger@1.0.0-alpha.1
  - @onflow/util-template@1.0.0-alpha.1

## 1.0.0-alpha.1

### Patch Changes

- [#1155](https://github.com/onflow/fcl-js/pull/1155) [`700433d5`](https://github.com/onflow/fcl-js/commit/700433d50d4156183b09b13781f7f74f23882586) Thanks [@caosbad](https://github.com/caosbad)! - Export encodeTransactionPayload, encodeTransactionEnvelope, and encodeTxIdFromVoucher from sdk.

* [#1153](https://github.com/onflow/fcl-js/pull/1153) [`6ff970df`](https://github.com/onflow/fcl-js/commit/6ff970dfc04281c86043e1cf8f5bceb633dc4186) Thanks [@lmcmz](https://github.com/lmcmz)! - Add sansPrefix for address before RLP encoding

- [#1129](https://github.com/onflow/fcl-js/pull/1129) [`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - Add blockId to GetTransactionStatus response

* [#1115](https://github.com/onflow/fcl-js/pull/1115) [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe) Thanks [@JeffreyDoyle](https://github.com/JeffreyDoyle)! - **BREAKING** Remove deprecated block builders, interaction types and send methods.

* Updated dependencies [[`7287ff14`](https://github.com/onflow/fcl-js/commit/7287ff14d20e19270ff345cd8b274ad5c8509eb7), [`9c191c15`](https://github.com/onflow/fcl-js/commit/9c191c1520ee772b4343265a42ad0e995a92dd9a), [`de47af64`](https://github.com/onflow/fcl-js/commit/de47af647a5bdad154a2d83e2ea2260ab54f0c60), [`b2c95e77`](https://github.com/onflow/fcl-js/commit/b2c95e776a3bbfd769778e0bae767fdd69ba6143), [`828a7b2b`](https://github.com/onflow/fcl-js/commit/828a7b2b4babb6485218e67e49f3a8ba9d4488fd), [`f7a985b3`](https://github.com/onflow/fcl-js/commit/f7a985b3cb64ed80c7354f97177ae7ef006530fe)]:
  - @onflow/transport-http@1.0.0-alpha.1
  - @onflow/config@1.0.0-alpha.1
  - @onflow/util-actor@1.0.0-alpha.1

## 1.0.0-alpha.0

### Major Changes

- Release 1.0.0 alpha

### Patch Changes

- Updated dependencies [7469c5c3]
- Updated dependencies

  - @onflow/util-address@1.0.0-alpha.0
  - @onflow/util-invariant@1.0.0-alpha.0
  - @onflow/rlp@1.0.0-alpha.0
  - @onflow/transport-http@1.0.0-alpha.0
  - @onflow/util-actor@1.0.0-alpha.0
  - @onflow/util-logger@1.0.0-alpha.0
  - @onflow/util-template@1.0.0-alpha.0

- 2022-03-31 -- [@chasefleming](https://github.com/chasefleming): Convert SDK logger functionality to use `@onflow/util-logger`.
- 2022-03-28 -- **BREAKING** [@JeffreyDoyle](https://github.com/JeffreyDoyle): Makes `@onflow/transport-http` the default send module used by SDK. By default, SDK will need to be configured with `accessNode.api` corresponding to a REST/HTTP access node, unless another send module is configured.
- 2022-03-16 -- [@bthaile](https://github.com/bthaile) Payer can now be an array of keys on a single account. Non-array payer is deprecated and will error in future versions of sdk.
- 2022-03-16 -- [@chasefleming](https://github.com/chasefleming): Warn about field renamings/deprecations. To turn on warnings, set config `log.level` to `2`.

```js
sdk.config("logger.level", 2)
```

- 2022-03-07 -- **BREAKING** [@JeffreyDoyle](https://github.com/JeffreyDoyle): Decode number types implicitly. Number types, `[U]Int*` and `Word*`, will now be decoded into String. This is done to protect against decoding such types into JavaScript Number when the value they represent exceeds the largest supported value for Number. Developers should adjust their use of the JS-SDK accordingly to this new return type when decoding number `[U]Int*` and `Word*` types.
- 2022-02-11 -- Uses Buffer from @onflow/rlp in encode.
- 2022-02-11 -- Injects Buffer from @onflow/rlp to transport send modules.
- 2022-02-04 -- [@chasefleming](https://github.com/chasefleming): Add options for for getting account by block height.

```javascript
await sdk.account("0x123") // Existing: get account at the latest block
await sdk.account("0x123", {height: 123}) // New: get account at the block with the provided height
```

## 0.0.57-alpha.3 -- 2022-02-02

- 2022-02-03 -- [@gregsantos](https://github.com/gregsantos): Rename `preSendCheck` to `voucherIntercept` and expose.
- 2022-01-31 -- [@chasefleming](https://github.com/chasefleming): Fix SDK circular dependency in `src/block.js` file.

## 0.0.57-alpha.1 -- 2022-01-21

- 2022-01-21 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Abstracts away the SDK transport modules into their own packages. The JS-SDK now makes use of transport modules for sending an interaction to an access api and receiving a response. A transport module can be defined in config:

```javascript
import {send as grpcSend} from "@onflow/transport-grpc"
import {send as httpSend} from "@onflow/transport-http"

// Configure SDK to use GRPC
sdk
  .config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("sdk.transport", grpcSend)

// Configure SDK to use HTTP
sdk
  .config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("sdk.transport", httpSend)
```

## 0.0.56-alpha.3 -- 2022-01-19

- 2022-01-07 -- [@chasefleming](https://github.com/chasefleming): Create methods for more easily getting a block by height or by id.

```javascript
await sdk.block() // get latest finalized block
await sdk.block({sealed: true}) // get latest sealed block
await sdk.block({id: "abc"}) // get block by id
await sdk.block({height: 123}) // get block by height
```

## 0.0.56-alpha.2 -- 2022-01-05

- 2021-12-17 -- [@chasefleming](https://github.com/chasefleming): Fix bug `resolveArgument` is being executed in the wrong context.
- 2021-11-22 -- [@chasefleming](https://github.com/chasefleming): Fix bug where similar aliases in config can result in partial replacement of the wrong alias.
- 2021-11-22 -- [@chasefleming](https://github.com/chasefleming): Fix bug where address aliases from config in cadence code are only replaced once.
- 2021-11-17 -- [@chasefleming](https://github.com/chasefleming): Support passing of current user as authorization. Simply pass `currentUser` instead of `currentUser.authorization` or `currentUser().authorization`.

```javascript
import {currentUser} from "@onflow/fcl"

fcl
  .send([
    fcl.transaction(CODE),
    fcl.proposer(currentUser),
    fcl.payer(currentUser),
    fcl.authorizations([currentUser]),
  ])
  .then(fcl.decode)
```

## 0.0.56-alpha.1 -- 2021-10-21

- 2021-10-21 -- [@GregSantos](https://github.com/gregsantos): SDK Alpha Release `@onflow/sdk` 0.0.55 -> 0.0.56-alpha.1
- 2021-10-13 -- **Community Contribution from** [@avcdsld](https://github.com/avcdsld): Adds initial implementation of a feature that allows for the transaction id to be computed before sending the transaction to the chain. It can be passed an asynchronous function that receives the voucher. Exports `voucherToTxId` to produce a transaction hash from `voucher`.
- 2021-10-11 -- [@chasefleming](https://github.com/chasefleming): Access string status instead of just number value (e.g. `FINALIZED` for status `2`) by using the `statusString` property on the response of `getTransactionStatus`

Example of `statusString`:

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(
  await sdk.build([sdk.getTransactionStatus(txId)]),
  {node: "http://localhost:8080"}
)

console.log(response.statusString)
```

## 0.0.55 -- 2021-10-01

- 2021-09-30 -- [@chasefleming](https://github.com/chasefleming): Resolve asynchronous arguments with specific `resolveArgument` method over generic `resolve`

Example of `resolveArgument` for async args.

```javascript
const argument = {
  async resolveArgument() {
    return {
      value: "0x12341324",
      xform: t.Address,
    }
  },
}

sdk.args([argument])
```

- 2021-09-20 -- [@chasefleming](https://github.com/chasefleming): Support asynchronous resolve methods in `resolveArguments`
- 2021-09-20 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds wallet utility for encoding provable authentication messages.
- 2021-08-05 -- [@gregsantos](https://github.com/gregsantos): Update `createSignableVoucher` structure and move to separate module.

## 0.0.54 -- 2021-07-23

- 2021-07-22 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds support for decoding `Enum` and `Capability` JSON-CDC payloads.

## 0.0.53 -- 2021-07-21

- 2021-07-21 -- Full version bump
- 2021-07-21 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Corrects error in send-get-account where account address was not supplied to GRPC request object.

## 0.0.52 -- 2021-07-21

- 2021-07-21 -- Full version bump
- 2021-07-21 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds support for decoding `Type` and `Path` JSON-CDC payloads.
- 2021-07-14 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Refactors Send Functions to prevent and mitigate cases where the expected request type cannot be determined.

## 0.0.51 -- 2021-07-20

- 2021-07-20 -- Full version bump

## 0.0.51-alpha.2 -- 2021-07-19

- 2021-07-14 -- Update `createSignableVoucher` to return `payloadSigs` and `envelopeSigs`. Addresses CORS bug.

## 0.0.51-alpha.1 -- 2021-07-13

- 2021-07-13 -- [@orodio](https://github.com/orodio): Top level now exposes `TestUtils`
- 2021-07-13 -- [@orodio](https://github.com/orodio): Config now exposes an `overload` function. `config.overload(otps, callback)`
- 2021-07-13 -- [@orodio](https://github.com/orodio): Config now exposes a `first` function. `config.first(["A", "B"], "FALLBACK")`
- 2021-07-13 -- [@orodo](https://github.com/orodio): Config functions can now be written like `config.get("foo")` instead of `config().get("foo")`
- 2021-07-13 -- [@orodio](https://github.com/orodio): Config now exposes an `all` function. `config().all()`
- 2021-06-24 -- [@gregsantos](https://github.com/gregsantos): Added `payer` signature to `payloadSigs` on `voucher`.

Example Updates to config.

```javascript
import {config} from "@onflow/config"

expect(await config.all()).toEqual({})

config({
  "foo.bar": "baz",
})
config.put("bob", "pat")

expect(await config.all()).toEqual({
  "foo.bar": "baz",
  bob: "pat",
})

var ret = await config.overload({bob: "bill"}, async () => {
  expect(await config.all()).toEqual({
    "foo.bar": "baz",
    bob: "bill",
  })
  return "woot"
})

expect(ret).toBe("woot")

expect(await config.all()).toEqual({
  "foo.bar": "baz",
  bob: "pat",
})

expect(await config.first(["bax", "foo.bar"], "FALLBACK")).toBe("baz")
expect(await config.first(["nope", "oh-no"], "FALLBACK")).toBe("FALLBACK")
```

Example of TestUtils.

```javascript
import {config, TestUtils} from "@onflow/sdk"
import * as sdk from "@onflow/sdk"

test("single account/key pair for all three signatory roles", async () => {
  await config.overload(
    {
      // mockSend -- Mocks the internal send calls used in resolve
      // can pass in a function that will be used as the return value of sdk.transport (Response)
      "sdk.transport": TestUtils.mockSend(),
    },
    async () => {
      const SIGNATORY = {addr: "0x1111222233334444", keyId: 1}
      const idof = acct => `${acct.addr}-${acct.keyId}`

      // authzFn -- stubs out an authorization function from a signatory
      const authz = TestUtils.authzFn(SIGNATORY)

      // run -- builds and resolves the transaction // sets a reference block
      var ix = await run([
        sdk.transaction`CODE`,
        sdk.proposer(authz),
        sdk.payer(authz),
        sdk.authorizations([authz]),
      ])

      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[TestUtils.idof(SIGNATORY)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(SIGNATORY))
      expect(ix.payer).toBe(TestUtils.idof(SIGNATORY))
      expect(ix.authorizations).toEqual([TestUtils.idof(SIGNATORY)])
    }
  )
})
```

## 0.0.50 - 2021-06-17

- 2021-06-16 -- [@orodio](https://github.com/orodio): General dep clean up. And force internal usage of config.

## 0.0.49 - 2021-06-16

- 2021-06-16 -- [@orodio](https://github.com/orodio): Pulled `@onflow/config` functionality into `@onflow/sdk`
- 2021-06-16 -- [@orodio](https://github.com/orodio): Added the ability to set configuration values in `sdk.config` from initializer.

```javascript
import {config} from "@onflow/config"

config({
  "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xFUSD": "0xe223d8a629e49c68",
})

// -- is equivalent to --

config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xFUSD", "0xe223d8a629e49c68")
```

## 0.0.48 - 2021-06-16

- 2021-06-16 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds ability to specify optional grpc metadata to requests sent to an Access API. To specity grpc metadata, use config like such:

```javascript
import {config} from "@onflow/config"

fcl.config().put("grpc.metadata", {headerkey1: "headervalue1"})
```

- 2021-06-16 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds encode signable wallet utility function.

## 0.0.47 - 2021-06-04

- 2021-04-27 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Full VSN Release `@onflow/sdk` 0.0.47-alpha.1 -> 0.0.47

## 0.0.47-alpha.1 - 2021-05-27

- 2021-05-27 -- [@gregsantos](https://github.com/gregsantos): Exposes `createSignableVoucher`

## 0.0.46 - 2021-05-10

- 2021-05-05 -- [@gregsantos](https://github.com/gregsantos): Renames `createVoucher` to `createSignableVoucher` and moves to `resolve-signatures`. Internal only.
- 2021-04-27 -- [@gregsantos](https://github.com/gregsantos): Removes `resolveParams`, Updates `resolvers` exported from `sdk`

## 0.0.46-alpha.1 - 2021-05-05

- 2021-05-05 **BREAKING** -- Prepends a transaction domain tag to encoded payload and envelope messages. Transaction domain tags allow signers to identify which messages are intended to represent encoded transactions, and which are not. The Flow protocol has been updated (as of May 5th 2021) to both accept signatures produced from messages prepended with a transaction domain tag, and from messages that are not. The next spork (time and date of next spork are TBD) will _strictly require_ all signatures for transnactions to have been produced from messages prepended with a transaction domain tag. This breaking change requires _all_ users of Flow Client Library and the Flow JavaScript SDK to update their versions to a version greater than or equal to the verison that this change was included in.
- 2021-05-03 -- Decodes signatures in block responses from a byte array to a hex string
- 2021-05-03 -- Updates shape of response ADT

## 0.0.45 - 2021-04-27

- 2021-04-27 -- Full VSN Release `@onflow/sdk` 0.0.45-alpha.20 -> 0.0.45
- 2021-04-23 -- Moves type check utils to `/utils`
- 2021-04-23 -- Move `createVoucher` to `/utils` to resolve circular dependency in `interaction`
- 2021-04-22 -- Adds `wallet-utils` `validateSignableTransaction` support for wallets to validate Signable payload
- 2021-04-20 -- Removes **Deprecated** `params`, `buildParams`
- 2021-04-21 -- Updates encoding naming of `gasLimit` and `script` to `computeLimit` and `cadence`. Internal only.

## 0.0.45-alpha.20 -- 2021-04-21

- 2021-04-21 -- **BREAKING** The experimental feature `sdk.meta` which allowed for a transaction to send along meta data to an authorization function has been removed because of the unprovable nature of its data and our strict trustless requirements. We believe this removal is in the best interest for js-sdk/fcl end users and will be looking into alternative approaches that provide the same functionality but in a more provable/trustless way. We have no ETA on this features replacement.

## 0.0.45-alpha.19 -- 2021-04-16

- 2021-04-15 -- Adds `createSignableVoucher` for message payload verification by wallet, pass as `voucher` to `PreSignable` and `Signable`
- 2021-04-15 -- Exposes `config` from SDK.
- 2021-04-15 -- Removes use of `TextDecoder` from `send-get-account`.
- 2021-04-13 -- Adds `makeVoucher` for message verification by wallet, pass as `voucher` to `PreSignable` and `Signable`
- 2021-04-09 -- Internal only - Added `prepAccount` to `interaction`. Update `authorizations`, `payer`, `proposer` builders.

## 0.0.45-alpha.18 -- 2021-04-09

- 2021-04-08 -- Adds `GetCollection` interaction, build, send and decode support.
- 2021-04-08 -- - Implements Transaction Metadata for media rich wallet transactions
- 2021-04-08 -- Implements Transaction Metadata for media rich wallet transactions
  - Adds `metadata` field to `interaction` and provides `meta` builder to include optional metadata with the transaction.
  - `meta()` accepts the optional fields `title`, `description`, `price`, and `image` as Strings. Invalid types will `throw`. Unsupport fields will be scrubbed.

```js
sdk.build([
  sdk.transaction(TRANSFER_NFT),
  sdk.meta({
    title: 'Kitty Kangol',
    description: 'A cool cat hat',
    price: '10',
    image: 'https://i.imgur.com/Ol2zPax.png',
  }),
])

type Metadata {
  title: String
  description: String
  price: String
  image: String
}
```

- 2021-04-08 -- Added validation to `metadata` builder.
- 2021-04-07 -- Internal only. Update `build-limit`
- 2021-04-07 -- Added `metadata` field to `Signable` in resolve-signatures.
- 2021-04-06 -- Added `metadata` field to `preSignable` in resolve-accounts. Export `meta` builder from `sdk.js`
- 2021-04-02 -- Updated `interaction` with metadata object. Added `meta` builder function and test.

## 0.0.45-alpha.16 -- 2021-03-28

- 2021-03-28 -- Added new test suits for `build` and `send`.

## 0.0.45-alpha.15 -- 2021-03-22

- 2021-03-22 -- Fixed an issue where `send-get-block-header` interactions were not able to be sent correctly.

## 0.0.45-alpha.14 -- 2021-03-19

- 2021-03-19 -- Fixed an issue in `send-get-block` and `send-get-block-header` where timestamps were not being decoded to ISO strings properly.

## 0.0.45-alpha.13 -- 2021-03-17

- 2021-03-17 -- Fixed an issue in `send-get-events` where block IDs were not being decoded to strings properly.

## 0.0.45-alpha.12 -- 2021-03-12

- 2021-03-16 -- Fixed issue in `interaction` where `isNumber` did not correctly check if a value is a number or not
- 2021-03-12 -- Fixed issue where `GetEvents*` interactions were not being sent in correct GRPC request type

## 0.0.45-alpha.10 -- 2021-03-02

- 2021-03-02 -- Fixed issue where `ExecuteScript*` interactions were not being sent in correct GRPC request type
- 2021-03-02 -- Fixed issue where `GetAccount*` interactions were not being sent in correct GRPC request type

## 0.0.45-alpha.[4-6] -- 2021-02-02

- 2021-02-18 -- Merged `@onflow/send` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/decode` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/encode` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/interaction` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/response` into `@onflow/sdk`
- 2021-02-18 -- Merged all `@onflow/resolve-*` into `@onflow/sdk`
- 2021-02-18 -- Merged all `@onflow/build-*` into `@onflow/sdk`

## 0.0.45-alpha.[1-3] -- 2021-02-02

- 2021-02-02 -- Adds support for new `GetEvents`, `GetBlockHeader`, `GetBlock` interactions.

## 0.0.44 -- 2020-12-11

- 2020-12-11 -- VSN `@onflow/sdk-resolve-ref-block-id` 0.0.0 -> 0.0.7
- 2020-12-11 -- VSN `@onflow/decode` 0.0.9 -> 0.0.10
- 2020-12-11 -- VSN `@onflow/send` 0.0.34 -> 0.0.34

## 0.0.43 -- 2020-10-28

- 2020-11-04 -- VSN `@onflow/sdk-resolve-signatures` 0.0.4 -> 0.0.5

## 0.0.42 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/decode` 0.0.8 -> 0.0.9
- 2020-10-28 -- VSN `@onflow/sdk-build-authorizations` 0.0.0 -> 0.0.1
- 2020-10-28 -- VSN `@onflow/sdk-resolve-ref-block-id` 0.0.0 -> 0.0.3
- 2020-10-28 -- VSN `@onflow/sdk-resolve-signatures` 0.0.3 -> 0.0.4

## 0.0.41 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-resolve-signatures` 0.0.2 -> 0.0.3

## 0.0.40 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-resolve-signatures` 0.0.1 -> 0.0.2

## 0.0.39 -- 2020-10-08

- 2020-10-08 -- VSN `@onflow/decode` 0.0.7 -> 0.0.8
- 2020-10-08 -- VSN `@onflow/sdk-build-get-account` 0.0.0 -> 0.0.1

## 0.0.38 -- 2020-10-07

- 2020-10-07 -- Proxy `@onflow/sdk-resolve-ref-block-id` at the top level
- 2020-10-07 -- Removed export of resolveProposerSequenceNumber (it never worked anyways)

## 0.0.37 -- 2020-10-07

- 2020-10-07 -- VSN `@onflow/sdk-resolve-signatures` 0.0.0 -> 0.0.1

## 0.0.36 -- 2020-10-07

- 2020-10-07 -- Proxy `@onflow/sdk-build-authorizations` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-account` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-events` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-latest-block` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-block-by-id` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-block-by-height` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-transaction-status` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-limit` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-params` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-arguments` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-proposer` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-payer` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-ping` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-ref` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-script` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-transaction` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-validator` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-invariant` at the top level

## 0.0.35 -- 2020-09-29

- 2020-09-29 -- Proxy @onflow/sdk-resolve-validators at the top level
- 2020-09-29 -- Proxy @onflow/sdk-resolve-signatures at the top level
- 2020-09-29 -- Proxy @onflow/sdk-resolve-accounts at the top level
- 2020-09-29 -- Proxy @onflow/sdk-resolve-arguments at the top level
- 2020-09-29 -- VSN `@onflow/send` 0.0.21 -> 0.0.22

## 0.0.34 - 2020-09-29

- 2020-09-29 -- VSN `@onflow/send` 0.0.20 -> 0.0.21

## 0.0.33 - 2020-09-29

- 2020-09-29 -- Proxy sdk.resolveArguments to `@onflow/sdk-resolve-arguments`
- 2020-09-29 -- VSN `@onflow/sdk-resolve-cadence` 0.0.0 -> 0.0.1

## 0.0.32 -- 2020-09-29

- 2020-09-29 -- Deprecate resolverParams

## 0.0.31 -- 2020-08-25

- 2020-08-25 -- VSN `@onflow/send` 0.0.17 -> 0.0.20
- 2020-08-25 -- VSN `@onflow/interaction` 0.0.9 -> 0.0.10
- 2020-08-25 -- VSN `@onflow/decode` 0.0.6 -> 0.0.7
- 2020-08-24 -- Implements GetBlockByHeight and GetBlockById interaction builders.
- 2020-08-13 -- Updates Readme with an overview of the JS-SDK
- 2020-08-10 -- Updates Readme

## 0.0.30 -- 2020-7-27

- 2020-07-27 -- VSN `@onflow/send` 0.0.16 -> 0.0.17

## 0.0.29 -- 2020-7-27

- 2020-07-27 -- VSN `@onflow/send` 0.0.15 -> 0.0.16

## 0.0.28 -- 2020-7-13

- 2020-07-13 -- VSN `@onflow/send` 0.0.14 -> 0.0.15
- 2020-07-20 -- Adds resolveProposerSequenceNumber resolve to resolve proposer sequence numbers where they are unspecified.
- 2020-07-20 -- Adds resolveRefBlockId resolver to resolve reference block ids on transactions where they are unspecified.

## 0.0.27 -- 2020-7-13

- 2020-07-13 -- VSN `@onflow/send` 0.0.13 -> 0.0.14

## 0.0.26 -- 2020-07-09

- 2020-07-09 -- FIX: resolveSignatures now passes arguments to encoder

## 0.0.25 -- 2020-07-09

- 2020-07-09 -- FIX: no longer lose signatures sometimes
- 2020-07-07 -- Updates to Readme

## 0.0.24 -- 2020-07-07

- 2020-06-30 -- Update dependency versions
- 2020-06-22 -- Adds arguments to signature resolver
- 2020-06-19 -- Adds argument resolver
- 2020-06-19 -- Adds argument builder
- 2020-06-08 -- Added validator builder

## 0.0.23 -- 2020-06-04

- 2020-06-04 -- VSN `@onflow/encode` 0.0.2 -> 0.0.3

## 0.0.22 -- 2020-06-03

- 2020-06-03 -- VSN `@onflow/encode` 0.0.2 -> 0.0.3
- 2020-06-03 -- VSN `@onflow/send` 0.0.11 -> 0.0.12

## 0.0.21 -- 2020-05-15

- 2020-05-15 -- VSN `@qvvg/templar` 0.0.0 -> 0.0.1

## 0.0.20 -- 2020-05-07

- 2020-05-07 **BREAKING** -- Proposers accept authorization object

## 0.0.19 -- 2020-05-07

- Same as 0.0.18 but the package-lock was updated

## 0.0.18 -- 2020-05-07

- 2020-05-07 -- Params resolver parses params correctly
- 2020-05-07 -- Allows authorizer payer and proposer to be the same

## 0.0.17 -- 2020-05-06

- 2020-05-06 -- VSN `@onflow/send` 0.0.9 -> 0.0.10
- 2020-05-06 -- VSN `@onflow/interaction` 0.0.6 -> 0.0.7
- 2020-05-05 -- Allows params to accept async resolver functions that return a param

## 0.0.16 -- 2020-05-05

- 2020-05-05 -- Fix bug where `resolveAccounts` was mutating a copy of an account instead of the original account

## 0.0.15 -- 2020-05-05

- 2020-05-05 -- VSN `@onflow/send` 0.0.8 -> 0.0.9
- 2020-05-05 -- VSN `@onflow/interaction` 0.0.5 -> 0.0.6
- 2020-05-05 -- VSN `@onflow/decode` 0.0.5 -> 0.0.6
- 2020-05-04 **BREAKING** -- Updates sdk according to updated interaction ADT

## 0.0.14 -- 2020-04-20

- 2020-04-20 -- VSN `@onflow/send` 0.0.7 -> 0.0.8

## 0.0.13 -- 2020-04-20

- 2020-04-20 -- Updates proposer to set only on the top level proposer field on the ix and updates tests.
- 2020-04-20 -- VSN `@onflow/send` 0.0.5 -> 0.0.7
- 2020-04-20 -- VSN `@onflow/interaction` 0.0.4 -> 0.0.5
- 2020-04-20 -- VSN `@onflow/decode` 0.0.4 -> 0.0.5
- 2020-04-20 -- VSN `@onflow/encode` 0.0.1 -> 0.0.2
- 2020-04-20 -- VSN `@onflow/interaction` 0.0.3 -> 0.0.4
- 2020-04-20 **BREAKING** -- No longer exporting `nonce`
- 2020-04-20 **BREAKING** -- No longer exporting `resolvePayload`
- 2020-04-20 -- Remove dep `rlp`
- 2020-04-20 -- Remove dep `@onflow/bytes`
- 2020-04-20 -- Add dep `@onflow/encode` 0.0.1
- 2020-04-19 **BREAKING** Updates `resolveAuthorizations()` according to the signing requirements of the latest AccessAPI spec. Adds `payer` builder.

## 0.0.12 -- 2020-04-18

- 2020-04-18 -- VSN send 0.0.4 -> 0.0.5
- 2020-04-18 -- VSN bytes 0.0.1 -> 0.0.2
- 2020-04-18 -- VSN decode 0.0.1 -> 0.0.4
- 2020-04-18 -- VSN jest 25.1.0 -> 25.3.0
- 2020-04-18 -- VSN microbundle 0.11.0 -> 0.12.0-next.8
- 2020-04-18 **BREAKING** -- Changes `getTransaction(txId)` to `getTransactionStatus(txId)` in accordance to the updated AccessAPI spec.
- 2020-04-17 -- Adds `proposer` builder to add a proposer to a transaction interaction.

## 0.0.11 -- 2020-04-17

- Pre Changelog
