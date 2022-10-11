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

The package exports `init` and utils.
Currently, a WalletConnect `projectId` is required and can be obtained @ https://cloud.walletconnect.com. Metadata is optional.

Initializtion returns `FclWcServicePlugin` and a Walletconnect `client`. The `client` can be used to subscribe to events, disconnect from a wallet, and query session and pairing status.
Passing `FclWcServicePlugin` to `fcl.pluginRegistry.add()` will enable use of the `"WC/RPC"` service strategy and add new and existing WalletConnect services to FCL Discovery.

```javascript
import * as fcl from '@onflow/fcl'
import { init } from '@onflow/fcl-wc'

const { FclWcServicePlugin, client } = await init({
  projectId: PROJECT_ID,
  metadata: {
    name: 'FCL WC DApp',
    description: 'FCL DApp with support for WalletConnect',
    url: 'https://flow.com/',
    icons: ['https://avatars.githubusercontent.com/u/62387156?s=280&v=4']
  }
})

fcl.pluginRegistry.add(FclWcServicePlugin)
```
