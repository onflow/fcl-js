# sdk-latest-block

Fetch the Latest Block from the configured Access Node

```javascript
import {config} from "@onflow/config"
import {latestBlock} from "@onflow/sdk-latest-block"

config()
  .put("accessNode.api", "https://access-testnet.onflow.org") // point the sdk to the desired access node

var block = await latestBlock()

console.log("id", block.id)              // The blocks ID
console.log("height", block.height)      // The blocks Height
console.log("parent id", block.parentId) // ID of the blocks parent
```
