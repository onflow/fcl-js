# @onflow/fcl-wc

WalletConnect adapter for FCL-JS.

## Status

- **Last Updated:** Aug 2022
- **Stable:** No
- **Risk of Breaking Change:** Yes

## Install

```bash
npm install --save @onflow/fcl-wc
```

## Usage

The package exports `initFclConnect` and utils.
Currently, a WalletConnect `projectId` is required and can be obtained @ https://cloud.walletconnect.com. Metadata is optional.

Initializtion returns `fclConnectServicePlugin` and `client`. The `client` can be used to subscribe to events, disconnect, and query session and pairing status.
Passing `fclConnectServicePlugin` to `fcl.pluginRegistry.add()` will enable `"WC/RPC"` service strategy and add new and existing services to FCL Discovery.

```javascript
import * as fcl from '@onflow/fcl'
import { initFclConnect } from '@onflow/fcl-wc'

const { fclConnectServicePlugin, client } = await initFclConnect({
  projectId: PROJECT_ID,
  metadata: {
    name: 'FCL Connect',
    description: 'FCL DApp with support for WalletConnect',
    url: 'https://flow.com/',
    icons: ['https://avatars.githubusercontent.com/u/62387156?s=280&v=4']
  }
})

fcl.pluginRegistry.add(fclConnectServicePlugin)
```
