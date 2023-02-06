---
title: Transport GRPC
description: Sends an interaction to an access node via the GRPC Rest API and returns a response.
---

## Status

- **Last Updated:** Jan 13th 2022
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

This package is working and in active development, breaking changes may happen.

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

📖 **gRPC Access API URLs** can be found [here](https://docs.onflow.org/access-api/#flow-access-node-endpoints).  The public Flow gRPC access nodes are accessible at:
- Testnet `https://access-testnet.onflow.org`
- Mainnet `https://access-mainnet-beta.onflow.org`
- Local Emulator `127.0.0.1:3569`

For more information, please consult the [FCL-JS SDK guidelines](/docs/reference/sdk-guidelines.mdx).

For information about installing and configuring FCL, see the [FCL Quick Start Tutorial](/docs/tutorials/flow-app-quickstart.mdx).
