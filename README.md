[![Build Status](https://travis-ci.com/onflow/flow-js-sdk.svg?branch=master)](https://travis-ci.com/onflow/flow-js-sdk)

# Flow Javascript SDK

Enabling developers to create dApps on the Flow blockchain using Javascript

A quick start guide can be found [Here](./packages/fcl#quick-start)

# Status

**EARLY PUBLIC ALPHA**

- **Last Updated:** April 21st 2020

We are currently confident in how to consume most of the things in this repository, but most of the modules are in active development and their underlying implementations are subject to change.

All changes to a module will be reflected in the modules version number (including breaking changes) as a patch, until we are confident the module is working and stable, at which point we will release a `v1.0.0`. After a `v1.0.0` release of a module we will strictly follow SemVer.

# What is Flow?

Flow is a new blockchain for open worlds. Read more about it [here](https://onflow.org).

# Getting Started

A quick start guide can be found [Here](./packages/fcl#quick-start).

- The Flow CLIs [emulator](https://github.com/onflow/flow/blob/master/docs/emulator.md) can be used to develop against locally.
- We have a [React Example](./examples/react-simple) application for you to poke around too. If you want to run it locally, you will need the emulator running with [this config](./flow.json).

# Overview

- Higher Level

  - [x] [`@onflow/fcl`](./packages/fcl) _(mvp)_ -- A high level dapp framework built on top an opinionated use of the sdk.
  - [x] [`@onflow/sdk`](./packages/sdk) _(mvp)_ -- Tools that enable developers to [build](./packages/sdk/src/build), [resolve](./packages/sdk/src/resolve), [send](./packages/send) and [decode](./packages/decode) interactions with the Flow blockchain.
  - [ ] [`@onflow/types`](./packages/types) _(early wip)_ -- Type casting interaction params to cadence compatible values.
  - [x] [`@onflow/send`](./packages/send) _(mvp)_ -- Send [interactions](./packages/interaction) to the Flow blockchain get [responses](./packages/response) back.
  - [x] [`@onflow/decode`](./packages/decode) _(mvp)_ -- Decodes [responses](./packages/response) return values into Javascript (No need for an ABI).

- Lower Level

  - [x] [`@onflow/protobuf`](./packages/protobuf) _(mvp)_ -- Dependency of [send](./packages/protobuf). Provides transport between the browser and the Flow blockchain.
  - [x] [`@onflow/interaction`](./packages/interaction) _(mvp)_ -- A data structure that can be [built](./packages/sdk/src/build), [resolved](./packages/sdk/src/resolve) and [sent](./packages/send) to the Flow blockchain.
  - [x] [`@onflow/response`](./packages/response) _(mvp)_ -- A data structure that represents a response from the Flow blockchain. If the interaction returns something, it can be [decoded](./package/decode) without something like an ABI.
  - [x] [`@onflow/encode`](./packages/encode) _(mvp)_ -- Transactions needs signatures, this module knows how to create the values that get signed.

- Development Tools
  - [x] [`@onflow/dev-wallet`](./packages/dev-wallet) _(mvp)_ -- A local fcl wallet provider for local development and testing.
