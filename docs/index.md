---
title: Flow Client Library (FCL)
---
<br />
<p align="center">
  <h1 align="center"> FCL JS</h1>
  <p align="center">
    <i>Connect your dapp to users, their wallets and Flow.</i>
    <br />
    <a href="https://docs.onflow.org/fcl/"><strong>Read the docs»</strong></a>
    <br />
    <br />
    <a href="https://docs.onflow.org/fcl/tutorials/flow-app-quickstart/">Quickstart</a>
    ·
    <a href="https://github.com/onflow/fcl-js/issues">Report Bug</a>
    ·
    <a href="https://github.com/onflow/fcl-js/blob/master/CONTRIBUTING.md">Contribute</a>

  </p>
</p>

## What is FCL?

The Flow Client Library (FCL) JS is a package used to interact with user wallets and the Flow blockchain. When using FCL for authentication, dapps are able to support all FCL-compatible wallets on Flow and their users without any custom integrations or changes needed to the dapp code.

It was created to make developing applications that connect to the Flow blockchain easy and secure. It defines a standardized set of communication patterns between wallets, applications, and users that is used to perform a wide variety of actions for your dapp. FCL also offers a full featured SDK and utilities to interact with the Flow blockchain.

While FCL itself is a concept and standard, FCL JS is the javascript implementation of FCL and can be used in both browser and server environments. All functionality for connecting and communicating with wallet providers is restricted to the browser. We also have FCL Swift implementation for iOS, see [FCL Swift](https://github.com/zed-io/fcl-swift) contributed by [@lmcmz](https://github.com/lmcmz).

---
## Getting Started

### Requirements
-  Node version `v12.0.0 or higher`.

### Installation

To use the FCL JS in your application, install using **yarn** or **npm**

```shell
npm i -S @onflow/fcl
```

```shell
yarn add @onflow/fcl
```
#### Importing

**ES6**
```js
import * as fcl from "@onflow/fcl";
```
**Node.js**
```js
const fcl = require("@onflow/fcl");
```
---

## Support

Notice an problem or want to request a feature? [Add an issue](https://github.com/onflow/flow-js-sdk/issues).

Discuss FCL with the community on the [forum](https://forum.onflow.org/c/developer-tools/flow-fcl/22).

Join the Flow community on [Discord](https://discord.gg/k6cZ7QC) to keep up to date and to talk to the team.
