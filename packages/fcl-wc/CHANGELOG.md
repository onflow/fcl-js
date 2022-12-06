# @onflow/fcl-wc

## 2.0.0-alpha.1

### Minor Changes

- [#1497](https://github.com/onflow/fcl-js/pull/1497) [`60b4c351`](https://github.com/onflow/fcl-js/commit/60b4c351ca84fa1fc88607fa9c58d0a6ed43b017) Thanks [@gregsantos](https://github.com/gregsantos)! - Add support for pre-authz method

### Patch Changes

- [#1420](https://github.com/onflow/fcl-js/pull/1420) [`c20bc344`](https://github.com/onflow/fcl-js/commit/c20bc34448a22966d349b0b1c4c0f742ae93a355) Thanks [@huyndo](https://github.com/huyndo)! - Add GetNetworkParameters interaction and a util to get chain ID

- Updated dependencies [[`c20bc344`](https://github.com/onflow/fcl-js/commit/c20bc34448a22966d349b0b1c4c0f742ae93a355)]:
  - @onflow/fcl@1.4.0-alpha.1

## 1.0.1-alpha.0

### Patch Changes

- Updated dependencies [[`e10e3c9c`](https://github.com/onflow/fcl-js/commit/e10e3c9c1f611e7dfd8a0bf7292473c71c2e04b9), [`6051030f`](https://github.com/onflow/fcl-js/commit/6051030f81fb102447bec40c758657ec20f43129), [`b2881f74`](https://github.com/onflow/fcl-js/commit/b2881f74f024aeca52d534d2ca6081fb57efd06d)]:
  - @onflow/config@1.1.0-alpha.0
  - @onflow/fcl@1.3.3-alpha.0
  - @onflow/util-logger@1.1.3-alpha.0

## 1.0.0

### Minor Changes

- [#1352](https://github.com/onflow/fcl-js/pull/1352) [`e33fa8df`](https://github.com/onflow/fcl-js/commit/e33fa8df764ec4f10696eedf520cc92ee402623d) Thanks [@gregsantos](https://github.com/gregsantos)! - 0.1.0 Release

  Initial alpha release of WalletConnect Adapter package for FCL.

  **EXPECT BREAKING CHANGES**

  ## Usage

  The package exports `initFclWc` and `getSdkError` util.
  Currently, a WalletConnect `projectId` is required and can be obtained @ https://cloud.walletconnect.com. Metadata is optional.

  Initialization returns `FclConnectServicePlugin` and `client`. The `client` can be used to subscribe to events, disconnect, and query session and pairing status.
  Passing `FclConnectServicePlugin` to `fcl.pluginRegistry.add()` will enable `"WC/RPC"` service strategy and add new and existing services to FCL Discovery UI/API.

  **Note**
  Setting `flow.network` in FCL config is required to enable `"WC/RPC"` service strategy to request correct chain permissions.

  ```javascript
  import {config} from '@onflow/config'

  config({
      flow.network: 'testnet'
  })
  ```

  ```javascript
  import * as fcl from "@onflow/fcl"
  import {initFclWc} from "@onflow/fcl-wc"

  const {FclConnectServicePlugin, client} = await initFclWc({
    projectId: PROJECT_ID,
    metadata: {
      name: "FCL Connect",
      description: "FCL DApp with support for WalletConnect",
      url: "https://flow.com/",
      icons: ["https://avatars.githubusercontent.com/u/62387156?s=280&v=4"],
    },
  })

  fcl.pluginRegistry.add(FclConnectServicePlugin)
  ```

  ### Using the client

  ```javascript
  import {getSdkError} from "@onflow/fcl-wc"

  client.on("session_update", ({topic, params}) => {
    const session = client.session.get(topic)
    console.log("EVENT", "session_update", {topic, params, session})
  })

  await client.disconnect({
    topic: session.topic,
    reason: getSdkError("USER_DISCONNECTED"),
  })
  ```

  -

### Patch Changes

- [#1396](https://github.com/onflow/fcl-js/pull/1396) [`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79) Thanks [@gregsantos](https://github.com/gregsantos)! - ### fcl

  - Added sending `supportedStrategies` to Discovery (UI/API) on client.config

  ***

  ### fcl-wc

  - updated `initFclWC` export/name to `init`
  - Added `sessionRequestHook` and `injectedWallets` opts, updated pairing match to use service.uid.

* [#1427](https://github.com/onflow/fcl-js/pull/1427) [`27bc599c`](https://github.com/onflow/fcl-js/commit/27bc599cdc79be9246dbbeb5e69afa60174f0577) Thanks [@gregsantos](https://github.com/gregsantos)! - Update request types and make wallets from WalletConnect API opt-in

- [#1396](https://github.com/onflow/fcl-js/pull/1396) [`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79) Thanks [@gregsantos](https://github.com/gregsantos)! - Updates ServicePlugin spec to include serviceStrategy

* [#1411](https://github.com/onflow/fcl-js/pull/1411) [`3c7a1bd6`](https://github.com/onflow/fcl-js/commit/3c7a1bd6686ff41dcd4953b471c54c1256a599a0) Thanks [@gregsantos](https://github.com/gregsantos)! - Adds additional options to `init` for `pairingModalOverride` and `wcRequestHook`

  ```js
  import * as fcl from "@onflow/fcl"
  import {init} from "@onflow/fcl-wc"
  // example using pairing data from wcRequestHook and providing a custom pairing modal
  const {FclWcServicePlugin, client} = await init({
    projectId: PROJECT_ID,
    metadata: PROJECT_METADATA,
    includeBaseWC: false,
    wallets: [],
    wcRequestHook: (data: WcRequestData) => {
      const peerMetadata = data?.pairing?.peerMetadata
      setSessionRequestData(peerMetadata)
      setShowRequestModal(true)
    },
    pairingModalOverride: (
      uri: string = "",
      rejectPairingRequest: () => void
    ) => {
      openCustomPairingModal(uri)
      // call rejectPairingRequest() to manually reject pairing request from client
    },
  })

  fcl.pluginRegistry.add(FclWcServicePlugin)
  ```

  ```ts
  interface WcRequestData {
    type: string // 'session_request' | 'pairing_request'
    session: SessionTypes.Struct | undefined // https://www.npmjs.com/package/@walletconnect/types
    pairing: PairingTypes.Struct | undefined // https://www.npmjs.com/package/@walletconnect/types
    method: string // "flow_authn" | "flow_authz" | "flow_user_sign"
    uri: string | undefined
  }
  ```

* Updated dependencies [[`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79), [`2a5fa910`](https://github.com/onflow/fcl-js/commit/2a5fa910009501c7c789efc9b1c1731668578361), [`9ea98850`](https://github.com/onflow/fcl-js/commit/9ea988503bbf4760bdee2a8bd8098be1cd95acb6), [`e33fa8df`](https://github.com/onflow/fcl-js/commit/e33fa8df764ec4f10696eedf520cc92ee402623d), [`3fdcc3be`](https://github.com/onflow/fcl-js/commit/3fdcc3be2d206c0df3f3b250012db5c18cac3bed), [`6708494d`](https://github.com/onflow/fcl-js/commit/6708494df236dc8c7375a2f91dc04fbcc03235c8), [`15d77220`](https://github.com/onflow/fcl-js/commit/15d77220a90be66b440129b73ffe889fe20335ab), [`f14b730c`](https://github.com/onflow/fcl-js/commit/f14b730c52bec664bda7bf222e3f0c0ab9c70f40), [`0a9c9677`](https://github.com/onflow/fcl-js/commit/0a9c96770933df4e0ed685b0ee4575533e345ecb), [`17a7f1e4`](https://github.com/onflow/fcl-js/commit/17a7f1e413340f72f45350075e8ea79ce1c2b711), [`5e6d114a`](https://github.com/onflow/fcl-js/commit/5e6d114a8fb0489c6bc70df8ec02d7ec4bb9ea1d), [`ecbd77b2`](https://github.com/onflow/fcl-js/commit/ecbd77b2acfbe4a28793baca3db47c1d5347247d), [`75d06938`](https://github.com/onflow/fcl-js/commit/75d069380c2dbb2040af57ce39a9847fb33a7db4), [`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79), [`1982c00b`](https://github.com/onflow/fcl-js/commit/1982c00bc334403bb603762a7f921bbe1887ee2b), [`f9f1dab7`](https://github.com/onflow/fcl-js/commit/f9f1dab70a6014b68ce5197544fae396340b6670)]:
  - @onflow/fcl@1.3.0

## 1.0.0-alpha.3

### Patch Changes

- [#1411](https://github.com/onflow/fcl-js/pull/1411) [`3c7a1bd6`](https://github.com/onflow/fcl-js/commit/3c7a1bd6686ff41dcd4953b471c54c1256a599a0) Thanks [@gregsantos](https://github.com/gregsantos)! - Adds additional options to `init` for `pairingModalOverride` and `wcRequestHook`

  ```js
  import * as fcl from "@onflow/fcl"
  import {init} from "@onflow/fcl-wc"
  // example using pairing data from wcRequestHook and providing a custom pairing modal
  const {FclWcServicePlugin, client} = await init({
    projectId: PROJECT_ID,
    metadata: PROJECT_METADATA,
    includeBaseWC: false,
    wallets: [],
    wcRequestHook: (data: WcRequestData) => {
      const peerMetadata = data?.pairing?.peerMetadata
      setSessionRequestData(peerMetadata)
      setShowRequestModal(true)
    },
    pairingModalOverride: (
      uri: string = "",
      rejectPairingRequest: () => void
    ) => {
      openCustomPairingModal(uri)
      // call rejectPairingRequest() to manually reject pairing request from client
    },
  })

  fcl.pluginRegistry.add(FclWcServicePlugin)
  ```

  ```ts
  interface WcRequestData {
    type: string // 'session_request' | 'pairing_request'
    session: SessionTypes.Struct | undefined // https://www.npmjs.com/package/@walletconnect/types
    pairing: PairingTypes.Struct | undefined // https://www.npmjs.com/package/@walletconnect/types
    method: string // "flow_authn" | "flow_authz" | "flow_user_sign"
    uri: string | undefined
  }
  ```

- Updated dependencies [[`15d77220`](https://github.com/onflow/fcl-js/commit/15d77220a90be66b440129b73ffe889fe20335ab), [`75d06938`](https://github.com/onflow/fcl-js/commit/75d069380c2dbb2040af57ce39a9847fb33a7db4)]:
  - @onflow/fcl@1.3.0-alpha.9

## 1.0.0-alpha.2

### Patch Changes

- [#1396](https://github.com/onflow/fcl-js/pull/1396) [`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79) Thanks [@gregsantos](https://github.com/gregsantos)! - ### fcl

  - Added sending `supportedStrategies` to Discovery (UI/API) on client.config

  ***

  ### fcl-wc

  - updated `initFclWC` export/name to `init`
  - Added `sessionRequestHook` and `injectedWallets` opts, updated pairing match to use service.uid.

* [#1396](https://github.com/onflow/fcl-js/pull/1396) [`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79) Thanks [@gregsantos](https://github.com/gregsantos)! - Updates ServicePlugin spec to include serviceStrategy

* Updated dependencies [[`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79), [`8475d5a4`](https://github.com/onflow/fcl-js/commit/8475d5a49e07a678da35a1b8f45751f599256e79)]:
  - @onflow/fcl@1.3.0-alpha.6

## 1.0.0-alpha.1

### Patch Changes

- Updated dependencies [[`2a5fa910`](https://github.com/onflow/fcl-js/commit/2a5fa910009501c7c789efc9b1c1731668578361), [`1982c00b`](https://github.com/onflow/fcl-js/commit/1982c00bc334403bb603762a7f921bbe1887ee2b)]:
  - @onflow/fcl@1.3.0-alpha.4

## 0.1.0-alpha.0

### Minor Changes

- [#1352](https://github.com/onflow/fcl-js/pull/1352) [`e33fa8df`](https://github.com/onflow/fcl-js/commit/e33fa8df764ec4f10696eedf520cc92ee402623d) Thanks [@gregsantos](https://github.com/gregsantos)! - 0.1.0 Release

  Initial alpha release of WalletConnect Adapter package for FCL.

  **EXPECT BREAKING CHANGES**

  ## Usage

  The package exports `initFclWc` and `getSdkError` util.
  Currently, a WalletConnect `projectId` is required and can be obtained @ https://cloud.walletconnect.com. Metadata is optional.

  Initialization returns `FclConnectServicePlugin` and `client`. The `client` can be used to subscribe to events, disconnect, and query session and pairing status.
  Passing `FclConnectServicePlugin` to `fcl.pluginRegistry.add()` will enable `"WC/RPC"` service strategy and add new and existing services to FCL Discovery UI/API.

  **Note**
  Setting `flow.network` in FCL config is required to enable `"WC/RPC"` service strategy to request correct chain permissions.

  ```javascript
  import {config} from '@onflow/config'

  config({
      flow.network: 'testnet'
  })
  ```

  ```javascript
  import * as fcl from "@onflow/fcl"
  import {initFclWc} from "@onflow/fcl-wc"

  const {FclConnectServicePlugin, client} = await initFclWc({
    projectId: PROJECT_ID,
    metadata: {
      name: "FCL Connect",
      description: "FCL DApp with support for WalletConnect",
      url: "https://flow.com/",
      icons: ["https://avatars.githubusercontent.com/u/62387156?s=280&v=4"],
    },
  })

  fcl.pluginRegistry.add(FclConnectServicePlugin)
  ```

  ### Using the client

  ```javascript
  import {getSdkError} from "@onflow/fcl-wc"

  client.on("session_update", ({topic, params}) => {
    const session = client.session.get(topic)
    console.log("EVENT", "session_update", {topic, params, session})
  })

  await client.disconnect({
    topic: session.topic,
    reason: getSdkError("USER_DISCONNECTED"),
  })
  ```

  -

### Patch Changes

- Updated dependencies [[`9ea98850`](https://github.com/onflow/fcl-js/commit/9ea988503bbf4760bdee2a8bd8098be1cd95acb6), [`e33fa8df`](https://github.com/onflow/fcl-js/commit/e33fa8df764ec4f10696eedf520cc92ee402623d)]:
  - @onflow/fcl@1.3.0-alpha.2
