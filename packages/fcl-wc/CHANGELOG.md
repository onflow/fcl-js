# @onflow/fcl-wc

## 1.0.0-alpha.0

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
