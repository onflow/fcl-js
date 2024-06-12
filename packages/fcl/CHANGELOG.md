# @onflow/fcl

## 1.11.0

### Minor Changes

- [#1888](https://github.com/onflow/fcl-js/pull/1888) [`90aa24d2`](https://github.com/onflow/fcl-js/commit/90aa24d237e0003bd62b53dd26fcf29ab743595b) Thanks [@jribbink](https://github.com/jribbink)! - Inject FCL WalletConnect Plugin by default. All developers are expected to configure a WalletConnect project ID in their FCL configuration. The relate configuration values are as follows:

  ```typescript
  {
      // Required
      "walletconnect.projectId": "YOUR_PROJECT_ID",

      // Optional
      "app.detail.icon": "https://example.com/icon.png",
      "app.detail.name": "Example App",
      "app.detail.description": "Example App Description",
      "app.detail.url": "https://example.com",
  }
  ```

  These values are used to configure the WalletConnect client. To obtain a project ID, please go to [WalletConnect's official website](https://walletconnect.com/). Metadata is optional, but recommended (FCL will use default values if not provided).

### Patch Changes

- Updated dependencies [[`90aa24d2`](https://github.com/onflow/fcl-js/commit/90aa24d237e0003bd62b53dd26fcf29ab743595b)]:
  - @onflow/fcl-core@1.10.0
  - @onflow/fcl-wc@5.2.0

## 1.10.2

### Patch Changes

- Updated dependencies [[`fe5e1b3d`](https://github.com/onflow/fcl-js/commit/fe5e1b3d330b7734740cceb9a873d1b680f28175), [`38607662`](https://github.com/onflow/fcl-js/commit/38607662dbfc54f268c40488e7a6a89bedd169d8)]:
  - @onflow/util-actor@1.3.3
  - @onflow/fcl-core@1.9.2
  - @onflow/config@1.4.1
  - @onflow/sdk@1.5.1

## 1.10.1

### Patch Changes

- Updated dependencies [[`7ef7edf1`](https://github.com/onflow/fcl-js/commit/7ef7edf1e134041da944f24f49e661caadcc7074), [`6c635f9f`](https://github.com/onflow/fcl-js/commit/6c635f9ff340284845ffe1196965ced7c748294f), [`8fb453b5`](https://github.com/onflow/fcl-js/commit/8fb453b5ff3a00285d91a5432972afbe9e779706), [`ad089fe7`](https://github.com/onflow/fcl-js/commit/ad089fe7556767e1fae96f3f2e98fd76c49bba88)]:
  - @onflow/sdk@1.5.0
  - @onflow/types@1.4.0
  - @onflow/util-invariant@1.2.3
  - @onflow/config@1.4.0
  - @onflow/fcl-core@1.9.1

## 1.10.0

### Minor Changes

- [#1802](https://github.com/onflow/fcl-js/pull/1802) [`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259) Thanks [@nialexsan](https://github.com/nialexsan)! - Typescript improvements

- [#1794](https://github.com/onflow/fcl-js/pull/1794) [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d) Thanks [@jribbink](https://github.com/jribbink)! - Add support for new event streaming API. Syntax remains unchanged & can be accessed via `fcl.events()`. See FLIP for more information: https://github.com/onflow/flips/blob/4152912f8ec39515eb1c4dddbc6605c6ebe70966/protocol/20230309-accessnode-event-streaming-api.md.

- [#1821](https://github.com/onflow/fcl-js/pull/1821) [`b9c078ce`](https://github.com/onflow/fcl-js/commit/b9c078ce87869c2b41dff07b861cea09a294c6a1) Thanks [@nialexsan](https://github.com/nialexsan)! - Split packages into `@onflow/fcl`, `@onflow/fcl-core`, and `@onflow/fcl-react-native`.

- [#1855](https://github.com/onflow/fcl-js/pull/1855) [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88) Thanks [@jribbink](https://github.com/jribbink)! - Add GetNodeVersionInfo SDK Interaction

### Patch Changes

- [#1827](https://github.com/onflow/fcl-js/pull/1827) [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a) Thanks [@nialexsan](https://github.com/nialexsan)! - Pin internal dependencies to exact versions

- [#1814](https://github.com/onflow/fcl-js/pull/1814) [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4) Thanks [@jribbink](https://github.com/jribbink)! - Fix type declarations not fully being generated

- Updated dependencies [[`8ffd3f50`](https://github.com/onflow/fcl-js/commit/8ffd3f5040db314bc1358f05946780af1c03df1a), [`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259), [`45d3c30c`](https://github.com/onflow/fcl-js/commit/45d3c30c8965512dde41f10d1c64c813811c3c0f), [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d), [`b9c078ce`](https://github.com/onflow/fcl-js/commit/b9c078ce87869c2b41dff07b861cea09a294c6a1), [`151a2290`](https://github.com/onflow/fcl-js/commit/151a2290e92fbcb399052476004c7f20ceda5c2d), [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a), [`037dc2f9`](https://github.com/onflow/fcl-js/commit/037dc2f9db9c22185e3c048c65e23e0efa70085f), [`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0), [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88), [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4), [`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0), [`fdd52c45`](https://github.com/onflow/fcl-js/commit/fdd52c45b3a64210c5f716e13aa4d08d3796370c)]:
  - @onflow/fcl-core@1.9.0
  - @onflow/types@1.3.0
  - @onflow/sdk@1.4.0
  - @onflow/util-invariant@1.2.2
  - @onflow/util-template@1.2.2
  - @onflow/util-address@1.2.2
  - @onflow/util-logger@1.3.2
  - @onflow/util-actor@1.3.2
  - @onflow/util-uid@1.2.2
  - @onflow/config@1.3.0
  - @onflow/rlp@1.2.2
  - @onflow/util-semver@1.0.2

## 1.10.0-alpha.11

### Patch Changes

- Updated dependencies [[`7ed491c5`](https://github.com/onflow/fcl-js/commit/7ed491c5d2335fbbff04444d41f1f1580763d8d3)]:
  - @onflow/util-address@1.2.2-alpha.3
  - @onflow/sdk@1.4.0-alpha.9
  - @onflow/fcl-core@1.9.0-alpha.8

## 1.10.0-alpha.10

### Minor Changes

- [#1855](https://github.com/onflow/fcl-js/pull/1855) [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88) Thanks [@jribbink](https://github.com/jribbink)! - Add GetNodeVersionInfo SDK Interaction

### Patch Changes

- Updated dependencies [[`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88)]:
  - @onflow/fcl-core@1.9.0-alpha.7
  - @onflow/sdk@1.4.0-alpha.8

## 1.10.0-alpha.9

### Patch Changes

- Updated dependencies [[`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0), [`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0)]:
  - @onflow/sdk@1.4.0-alpha.7
  - @onflow/fcl-core@1.9.0-alpha.6

## 1.10.0-alpha.8

### Patch Changes

- Updated dependencies [[`fdd52c45`](https://github.com/onflow/fcl-js/commit/fdd52c45b3a64210c5f716e13aa4d08d3796370c)]:
  - @onflow/config@1.3.0-alpha.3
  - @onflow/fcl-core@1.9.0-alpha.5
  - @onflow/sdk@1.4.0-alpha.6

## 1.10.0-alpha.7

### Patch Changes

- Updated dependencies [[`8ffd3f50`](https://github.com/onflow/fcl-js/commit/8ffd3f5040db314bc1358f05946780af1c03df1a)]:
  - @onflow/fcl-core@1.9.0-alpha.4

## 1.10.0-alpha.6

### Patch Changes

- Updated dependencies [[`151a2290`](https://github.com/onflow/fcl-js/commit/151a2290e92fbcb399052476004c7f20ceda5c2d)]:
  - @onflow/sdk@1.4.0-alpha.5
  - @onflow/fcl-core@1.8.2-alpha.3

## 1.10.0-alpha.5

### Patch Changes

- Updated dependencies [[`45d3c30c`](https://github.com/onflow/fcl-js/commit/45d3c30c8965512dde41f10d1c64c813811c3c0f)]:
  - @onflow/types@1.3.0-alpha.3
  - @onflow/fcl-core@1.8.2-alpha.2

## 1.10.0-alpha.4

### Patch Changes

- Updated dependencies [[`037dc2f9`](https://github.com/onflow/fcl-js/commit/037dc2f9db9c22185e3c048c65e23e0efa70085f)]:
  - @onflow/fcl-core@1.8.2-alpha.1
  - @onflow/sdk@1.4.0-alpha.4

## 1.10.0-alpha.3

### Patch Changes

- [#1827](https://github.com/onflow/fcl-js/pull/1827) [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a) Thanks [@nialexsan](https://github.com/nialexsan)! - pin versions

- Updated dependencies [[`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a)]:
  - @onflow/util-invariant@1.2.2-alpha.2
  - @onflow/util-template@1.2.2-alpha.2
  - @onflow/util-address@1.2.2-alpha.2
  - @onflow/util-logger@1.3.2-alpha.2
  - @onflow/util-semver@1.0.2-alpha.0
  - @onflow/util-actor@1.3.2-alpha.2
  - @onflow/fcl-core@1.8.2-alpha.0
  - @onflow/util-uid@1.2.2-alpha.2
  - @onflow/config@1.2.2-alpha.2
  - @onflow/types@1.3.0-alpha.2
  - @onflow/rlp@1.2.2-alpha.2
  - @onflow/sdk@1.4.0-alpha.3

## 1.10.0-alpha.2

### Minor Changes

- [#1802](https://github.com/onflow/fcl-js/pull/1802) [`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259) Thanks [@nialexsan](https://github.com/nialexsan)! - TS conversion

- [#1794](https://github.com/onflow/fcl-js/pull/1794) [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d) Thanks [@jribbink](https://github.com/jribbink)! - Add support for new event streaming API https://github.com/onflow/flips/blob/4152912f8ec39515eb1c4dddbc6605c6ebe70966/protocol/20230309-accessnode-event-streaming-api.md. Syntax remains unchanged & can be accessed via fcl.events().

### Patch Changes

- [#1814](https://github.com/onflow/fcl-js/pull/1814) [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4) Thanks [@jribbink](https://github.com/jribbink)! - Fix type declarations not fully being generated

- Updated dependencies [[`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259), [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d), [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4)]:
  - @onflow/types@1.3.0-alpha.1
  - @onflow/sdk@1.4.0-alpha.2
  - @onflow/util-invariant@1.2.2-alpha.1
  - @onflow/util-template@1.2.2-alpha.1
  - @onflow/util-address@1.2.2-alpha.1
  - @onflow/util-logger@1.3.2-alpha.1
  - @onflow/util-actor@1.3.2-alpha.1
  - @onflow/util-uid@1.2.2-alpha.1
  - @onflow/config@1.2.2-alpha.1
  - @onflow/rlp@1.2.2-alpha.1
