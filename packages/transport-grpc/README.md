---
title: Transport GRPC
description: Sends an interaction to an access node via the GRPC Rest API and returns a response.
---

# Deprecated - DO NOT USE

This package is deprecated and will will no receive updates for new features.  Please migrate your projects to use the [HTTP Transport] package (`@onflow/transport-http`) instead.

Latest versions of FCL/JS-SDK will automatically use the HTTP Transport as long as the `sdk.transport` configuration key is not set.

## Usage

### Install

```bash
npm install --save @onflow/transport-grpc
```

### Integration with FCL

By default `@onflow/fcl` defaults to using the HTTP Access Node endpoint via the [HTTP Transport](/packages/transport-http/) package (`@onflow/transport-http`).  This may be overriden, however.

If using the gRPC Access API, the `sdk.transport` configuration key must be populated as this value defaults to the HTTP API transport.  The SDK can be configured to use the gRPC API transport as follows:

```javascript
import { config } from "@onflow/fcl"
import { send as transportGRPC } from "@onflow/transport-grpc"

config({
  "accessNode.api": "https://access-testnet.onflow.org",
  "sdk.transport": transportGRPC
})
```

This will override the HTTP Transport and use the gRPC Transport instead.

📖 **gRPC Access API URLs** can be found [here](https://developers.flow.com/concepts/nodes/access-api#flow-access-node-endpoints).  The public Flow gRPC access nodes are accessible at:
- Testnet `https://access-testnet.onflow.org`
- Mainnet `https://access-mainnet.onflow.org`
- Local Emulator `127.0.0.1:3569`

For more information, please consult the [FCL-JS SDK guidelines](https://developers.flow.com/tooling/fcl-js/sdk-guidelines).

For information about installing and configuring FCL, see the [FCL Quick Start Tutorial](https://developers.flow.com/tutorials/flow-app-quickstart).