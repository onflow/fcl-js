[![FLOW-JS-SDK Continuous Integration](https://github.com/onflow/flow-js-sdk/actions/workflows/integrate.yml/badge.svg)](https://github.com/onflow/flow-js-sdk/actions/workflows/integrate.yml)

## Introducing `@onflow/fcl`

Flow's JavaScript SDK was created to make developing JavaScript applications that connect to
the Flow blockchain easy and secure.

While it would be possible to create a Flow wallet as a browser plugin, we specifically created `@onflow/fcl` so that web-based dapps don’t have to depend on browser
plugins. `@onflow/fcl` is able to connect browser-based dapps to a wallet service, or a wallet installed on your phone
or running on your local computer without introducing the security risks that can come from installing
a browser plugin.

## Wallet Discovery

`@onflow/fcl` also eliminates the need for dapp developers to write code to integrate their user's preferred wallet into
their application. Instead,`@onflow/fcl` uses a secure discovery protocol that wallets can implement to connect
to `@onflow/fcl`. The end result is dapps using `@onflow/fcl` automatically integrate all compatible wallets without their developers
needing to write any custom code!

## Limitless Development

`@onflow/fcl` enables cross-platform dapps. By not depending on JavaScript injection as a mechanism for connecting dapps with wallets,
native desktop dapps and mobile dapps can connect to the same wallet software as browser dapps.

## Getting Started with FCL

To use the Flow JavaScript SDK in your application, install using **yarn** or **npm**

```shell
npm i -S @onflow/fcl @onflow/types

```

### Learn to use `@onflow/fcl`: [Flow App Quickstart](https://docs.onflow.org/fcl/flow-app-quickstart/)

---
## Requirements

Please note, that some code provided - e.g. `Object.fromEntries` - will require Node version `v12.0.0 or higher`.

## Overview

- Higher Level

  - [x] [`@onflow/fcl`](./packages/fcl) -- A high level dapp framework built on top an opinionated use of the sdk.
  - [x] [`@onflow/sdk`](./packages/sdk) -- Tools that enable developers to [build](./packages/sdk/src/build), [resolve](./packages/sdk/src/resolve), [send](./packages/sdk/src/send) and [decode](./packages/sdk/src/decode) interactions with the Flow blockchain.
  - [x] [`@onflow/types`](./packages/types) -- Type casting interaction params to cadence compatible values.
  - [x] [`send`](./packages/sdk/src/send) -- Send [interactions](./packages/sdk/src/interaction) to the Flow blockchain get [responses](./packages/sdk/src/response) back.
  - [x] [`decode`](./packages/sdk/src/decode) -- Decodes [responses](./packages/sdk/src/response) return values into Javascript (No need for an ABI).

- Lower Level

  - [x] [`@onflow/protobuf`](./packages/protobuf) -- Dependency of [send](./packages/protobuf). Provides transport between the browser and the Flow blockchain.
  - [x] [`interaction`](./packages/sdk/src/interaction) -- A data structure that can be [built](./packages/sdk/src/build), [resolved](./packages/sdk/src/resolve) and [sent](./packages/sdk/src/send) to the Flow blockchain.
  - [x] [`response`](./packages/sdk/src/response) -- A data structure that represents a response from the Flow blockchain. If the interaction returns something, it can be [decoded](./package/sdk/src/decode) without something like an ABI.
  - [x] [`encode`](./packages/sdk/src/encode) -- Transactions needs signatures, this module knows how to create the values that get signed.

- Development Tools
  - [x] [`@onflow/dev-wallet`](./packages/dev-wallet) -- A local fcl wallet provider for local development and testing.
