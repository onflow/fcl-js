# @onflow/fcl-rainbowkit-adapter

## Usage

```typescript
import { createFclConnector } from '@onflow/fcl-rainbowkit-adapter';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  flowTestnet,
} from 'wagmi/chains';
import * as fcl from '@onflow/fcl';
import { createConfig, http } from 'wagmi';

// Set FCL config
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "walletconnect.projectId": "9b70cfa398b2355a5eb9b1cf99f4a981",
})

// FCL connector
const flowWalletConnector = createFclConnector({
  user: fcl.currentUser,
  config: fcl.config,
  service: {
        "f_type": "Service",
        "f_vsn": "1.0.0",
        "type": "authn",
        "uid": "Flow Wallet",
        "endpoint": "chrome-extension://hpclkefagolihohboafpheddmmgdffjm/popup.html",
        "method": "EXT/RPC",
        "id": "hpclkefagolihohboafpheddmmgdffjm",
        "identity": {
            "address": "0x33f75ff0b830dcec"
        },
        "provider": {
            "name": "Flow Wallet",
            "address": "0x33f75ff0b830dcec",
            "description": "A wallet created for everyone",
            "icon": "https://lilico.app/frw-logo.png",
            "color": "#41CC5D",
            "website": "https://core.flow.com",
            "requires_install": true,
            "is_installed": true,
            "install_link": "https://chromewebstore.google.com/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm",
            "rdns": "com.flowfoundation.wallet"
        }
    } as any,
})

// RainbowKit connectors
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    "wallets": [
      flowWalletConnector as any,
    ],
  }
], {
  appName: 'RainbowKit demo',
  projectId: '9b70cfa398b2355a5eb9b1cf99f4a981',
});

// Wagmi config
export const config = createConfig({
  chains: [
    flowTestnet
  ],
  connectors,
  ssr: true,
  transports: {
    [flowTestnet.id]: http(),
  }
});
```