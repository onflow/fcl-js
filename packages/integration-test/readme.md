---
title: FCL integration tests
description: A collection of integration tests run against a local instance of Flow emulator
---

## FCL Integration tests

This is a suite of tests run against a local instance of Flow emulator to quickly identify regression problems on new changes.

### Dependencies

The suite requires Flow CLI (installation guide [here](https://developers.flow.com/tools/flow-cli/install)) to perform tasks such as booting up the emulator and creating accounts.

### Usage

First, `npm install` to install any dependencies.

`npm test` will run the test suite. Make sure to build all packages first to test the latest changes. This test commands runs on 2 transports: `http` and `grpc`. To test them individually run `npm run test:http` and `npm run test:grpc` respectively.

### Development guide

The test suite utilizes global setup and global teardown functionalities from `jest` as seen in the `jest` config [file](./jest.config.json). These are all in the `setup` directory. As of this moment these global setups and teardown files deal with the locally run Flow emulator using the Flow CLI.

There are also setup files for `grpc` and `http`. They configure `fcl` to use the appropriate transport for testing.

The `commonsetup` file is used for initializing an `authz` function for transactions. This uses [freshmint](https://github.com/dapperlabs/freshmint).

There is also an util directory to store utility functions used during testing.