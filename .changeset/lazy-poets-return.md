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
  pairingModalOverride: (uri: string = '', rejectPairingRequest: () => void) => {
    openCustomPairingModal(uri)
    // call rejectPairingRequest() to manually reject pairing request from client
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
