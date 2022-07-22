# @onflow/fcl-wc

WalletConnect adapter for FCL-JS.

## Status

- **Last Updated:** July 2022
- **Stable:** No
- **Risk of Breaking Change:** Yes

## Install

```bash
npm install --save @onflow/fcl-wc
```

## Usage

```javascript
import * as fclWC from '@onflow/fcl-wc'

const wcAdapter = fclWC.initWcAdapter({
  projectId: WC_PROJECT_ID,
  metadata: {
    name: 'FCL WalletConnect',
    description: 'FCL DApp for WalletConnect',
    url: 'https://flow.com/',
    icons: ['https://avatars.githubusercontent.com/u/62387156?s=280&v=4']
  }
})
```
