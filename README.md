# Flow Javascript SDK

Enabling developers to create dApps on the Flow blockchain using Javascript

# Status

**EARLY ALPHA**

- **Interface** Stable _(low risk of change)_
- **Realization** Unstable _(high risk of change)_

We are currently confident in how to consume most of the things in this repository, but most of the modules are in active development and their underlying implementations are subject to change.

All changes to a module will be reflected in the modules version number (including breaking changes) as a patch, until we are confident the module is working and stable, at which point we will release a `v1.0.0`. After a `v1.0.0` release of a module we will strictly follow SemVer.

# Overview

- Higher Level
  - [ ] [`@onflow/fcl`](./packages/fcl) _(wip)_ -- A high level dApp framework built on top an opinionated use of the sdk.
  - [ ] [`@onflow/sdk`](./packages/sdk) _(wip)_ -- Tools that enable developers to [build](./packages/sdk/src/build), [resolve](./packages/sdk/src/resolve), [send](./packages/send) and [decode](./packages/decode) interactions with the Flow blockchain.
  - [ ] [`@onflow/types`](./packages/types) _(wip)_ -- Type casting interaction params to cadence compatible values.
  - [ ] [`@onflow/send`](./packages/send) _(wip)_ -- Send [interactions](./packages/interaction) to the Flow blockchain get [responses](./packages/response) back.
  - [x] [`@onflow/decode](./packages/decode) _(mvp)_ -- Decodes [responses](./packages/response) return values into Javascript (No need for an ABI).

- Lower Level
  - [x] [`@onflow/protobuf`](./packages/protobuf) _(mvp)_ -- Dependency of [send](./packages/protobuf). Provides transport between the browser and the Flow blockchain.
  - [ ] [`@onflow/interaction`](./packages/interaction) _(wip)_ -- A data structure that can be [built](./packages/sdk/src/build), [resolved](./packages/sdk/src/resolve) and [sent](./packages/send) to the Flow blockchain.
  - [ ] [`@onflow/response`](./packages/response) _(wip)_ -- A data structure that represents a response from the Flow blockchain. If the interaction returns something, it can be [decoded](./package/decode) without something like an ABI.
  - [ ] [`@onflow/encode`](./packages/encode) _(wip)_ -- Transactions needs signatures, this module knows how to create the values that get signed.

- Development Tools
  - [x] [`@onflow/dev-handshake`](./packages/dev-handshake) _(mvp)_ -- A local fcl provider handshake service for local development and testing.
  - [ ] [`@onflow/dev-wallet`](./packages/dev-wallet) _(early wip)_ -- A local fcl wallet provider for local development and testing.

- Resources
  - [fcl async remote auth diagram] _(working draft)_ -- How fcl authenticates and authorizes transactions with remote wallets.
