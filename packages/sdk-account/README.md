# sdk-account

Fetch the Account for a given address from the configured Access Node

```javascript
import {config} from "@onflow/config"
import {account} from "@onflow/sdk-account"

config()
  .put("accessNode.api", "https://access-testnet.onflow.org") // point the sdk to the desired access node

var acct = await account("0xba1132bc08f82fe2")

console.log("address", acct.address)      // The address of the account
console.log("Flow balance", acct.balance) // (10 nFLOW, 1e-8)
console.log("code", acct.code)            // The code that is deployed to the account
console.log("keys", acct.keys)            // The keys associated with the account
```
