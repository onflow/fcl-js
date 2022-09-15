# @onflow/fcl-wc

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
