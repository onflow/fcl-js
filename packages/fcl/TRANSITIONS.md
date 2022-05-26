# Transitions

## 0002 Deprecate `env` config key
- **Date:** May 26th 2022
- **Type:** Deprecation of `env` in config

When specifying which flow network for FCL to use, use the `flow.network` config key instead of `env` (e.g. `fcl.config.put("flow.network", "testnet")`).  Permitted values are currently `local`, `canarynet`, `testnet`, `mainnet`.

FCL currently falls back to `env` for the `flow.network` field but this will be removed in a future update.

## 0001 Current User Data

- **Date:** July 22nd 2020
- **Issue:** [#180](https://github.com/onflow/flow-js-sdk/issues/180)
- **Type:** Deprecation of Certain Fields on Object

In the case of `userData` in the following:`fcl.currentUser().subscribe(userData)` and `var userData = await fcl.currentUser().snapshot()`, most fields will cease to exist.

Please limit your use of the data within `userData` to `cid` and `loggedIn`.
