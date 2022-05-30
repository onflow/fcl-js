# Transitions

## 0001 Deprecate `env` config key
- **Date:** May 26th 2022
- **Type:** Deprecation of `env` in config

When specifying which flow network for FCL to use, use the `flow.network` config key instead of `env` (e.g. `fcl.config.put("flow.network", "testnet")`).  Permitted values are currently `local`, `canarynet`, `testnet`, `mainnet`.

FCL currently falls back to `env` for the `flow.network` field but this will be removed in a future update.