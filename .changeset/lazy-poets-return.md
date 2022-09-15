---
"@onflow/fcl-wc": patch
---

Adds additional options to `init` for `pairingModalOverride` and `wcRequestHook`

```js
import * as fcl from '@onflow/fcl'
import { init } from '@onflow/fcl-wc'
// example using pairing data from wcRequestHook and providing a custom pairing modal
const { FclWcServicePlugin, client } = await init({
  projectId: PROJECT_ID,
  metadata: PROJECT_METADATA,
  includeBaseWC: false,
  wallets: [],  
  wcRequestHook: (data: WcRequestData) => {
    const peerMetadata = data?.pairing?.peerMetadata
    setSessionRequestData(peerMetadata)
    setShowRequestModal(true)
  },
  pairingModalOverride: {
    // required
    open: (uri: string = '', closeCallback: () => void) => {
      // open modal for WalletConnect uri
      // closeCallback() if user closes modal
      openModal(uri, closeCallback)
    },
    // required
    close: () => {
      // handle close modal, called by fcl-wc after approval or rejection
      closeModal()
    }
  }
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
