# @onflow/util-rpc

Lightweight utility for creating transport-agnostic, bidirectional JSON-RPC channels.

# Status

- **Last Updated:** Aug 6th, 2024
- **Stable:** No
- **Risk of Breaking Change:** Yes

# Install

```bash
npm install --save @onflow/util-rpc
```

# Usage

```javascript
import {RpcClient} from "@onflow/util-rpc"

const rpc = new RpcClient(...)
rpc.connect(...)
```
