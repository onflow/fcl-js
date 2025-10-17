---
"@onflow/transport-http": minor
"@onflow/sdk": minor
---

Add optional `blockId` field to `GetTransactionResult`. This is used to disambiguate system transactions sharing IDs between blocks and is not applicable to most developers.
