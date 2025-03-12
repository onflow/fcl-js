---
"@onflow/fcl-core": minor
---

Allow apps to exclude certain wallets from FCL Discovery.

```javascript
import { config } from "@onflow/fcl";

config({
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/testnet/authn",
  "discovery.authn.exclude": ["0x123"],
});
```