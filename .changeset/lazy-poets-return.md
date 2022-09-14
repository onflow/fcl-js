---
"@onflow/fcl-wc": patch
---

Adds additional options to init for pairing modal override and sessionRequestHook

```js
import { init } from '@onflow/fcl-wc'
// example using pairing data from sessionRequestHook and providing a custom pairing modal overide
const { FclWcServicePlugin, client } = await init({
  projectId: PROJECT_ID,
  metadata: PROJECT_METADATA,
  includeBaseWC: true,
  wallets: []  
  sessionRequestHook: (data: {session, pairing, uri}) => {
    const peerMetadata = data?.pairing?.peerMetadata
    setSessionRequestData(peerMetadata)
    setShowRequestModal(true)
  },
  pairingModalOveride: {
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
```
