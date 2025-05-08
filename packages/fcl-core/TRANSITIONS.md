# Transitions

## 0001 Deprecate `env` config key
- **Date:** May 26th 2022
- **Type:** Deprecation of `env` in config

When specifying which flow network for FCL to use, use the `flow.network` config key instead of `env` (e.g. `fcl.config.put("flow.network", "testnet")`).  Permitted values are currently `local`, `canarynet`, `testnet`, `mainnet`.

FCL currently falls back to `env` for the `flow.network` field but this will be removed in a future update.

## 0002 Deprecate `flow.network` config key
- **Date:** September 26th 2022
- **Type:** Deprecation of `flow.network` in config

FCL now has a built-in utility to get which flow network to use. Manual specification in config is no longer required

FCL currently falls back to `flow.network` in case of failure but this will be removed in a future update.

## 0003 Deprecate `appIdentifier` field in account proof resolver

- **Date:** May 7th 2025
- **Type:** Deprecation of `appIdentifier` in account proof resolver

The `appIdentifier` field in the account proof resolver is deprecated. The `appIdentifier` field is no longer required to be passed in the account proof resolver. The `appIdentifier` field will be removed in a future update.

FCL will manually set the `appIdentifier` field to the origin of the current page.  This is done to prevent phishing attacks and allow wallets to verify the origin of the request to restrict the domain of account proof requests to only those associated with the application's trusted [RFC 6454](https://www.rfc-editor.org/rfc/rfc6454.html) origin.

Application developers migrating to this new configuration should update their backend systems accordingly to validate against trusted origins instead of the arbitrary `appIdentifier` field.

The previous configuration will remain backward-compatible, however, it is strongly recommended that all application and wallet developers migrate to this new scheme as soon as possible to offer the best security to users.