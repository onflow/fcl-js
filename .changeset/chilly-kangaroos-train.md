---
"@onflow/react-sdk": minor
"@onflow/demo": minor
---

Added `useCrossVmBridgeTokenFromEvm` hook for bridging fungible tokens from Flow EVM to Cadence. This hook withdraws tokens from the signer's Cadence-Owned Account (COA) in EVM and deposits them into their Cadence vault, automatically configuring the vault if needed.
