---
"@onflow/fcl-react-native": minor
"@onflow/fcl-core": minor
"@onflow/fcl": minor
"@onflow/sdk": minor
---

Default to soft-finality for all queries (get account, get block, get block header, execute script).  Developers can manually override this setting on a per-query basis if required.

Because developers can now query against un-sealed blocks, it is now recommended to switch to waiting for soft-finality ("executed" status) when awaiting for transaction results whenever possible for significant latency improvements (~2.5x faster).

This can be done by switching from `fcl.tx(...).onceSealed()` to `fcl.tx(...).onceExecuted()` or updating listeners passed to `fcl.tx(...).subscribe()`.