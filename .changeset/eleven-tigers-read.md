---
"@onflow/types": minor
"@onflow/sdk": patch
---

Added support for UFix128 and Fix128 types to @onflow/types package and decoder support to @onflow/sdk package. These fixed-point number types have been added to the Flow protocol and are now available for use in Cadence transactions and scripts. UFix128 and Fix128 support up to 24 decimal places of precision.

The decoder in @onflow/sdk now properly handles UFix128 and Fix128 values when decoding responses from Flow scripts and transactions.
