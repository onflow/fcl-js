---
"@onflow/kit": minor
---

**BREAKING** Update `useCrossVmBatchTransaction` result data to the Cadence transaction ID instead of waiting for the EVM transaction hash.

This change ensures consistency with the existing `useFlowMutate` response format and latencies, as waiting for the transaction execution for EVM results adds unnecessary delays and harms user experience.

Developers should instead manually subscribe to the Cadence transaction status to track execution status and determine the EVM transaction results.