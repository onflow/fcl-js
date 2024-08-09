---
"@onflow/fcl-core": minor
---

Changes to `execStrategy`:
 - `execStrategy` now exported from `@onflow/fcl-core`
 - Allow overriding `execStrategy` for FCL Discovery when initializing `currentUser`.
 - `execStrategy` now takes additional arguments
    - `customRpc` - a custom RPC client to communicate with the VIEW, if supported
    - `abortSignal` - an AbortSignal to cancel the request (and close any open views)