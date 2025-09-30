---
"@onflow/transport-http": patch
---

Renamed misnamed `startHeight` argument to `startBlockHeight` for event subscriptions.  Type definitions will be broken to reflect this change, however the `startHeight` argument will still be accepted for backward compatibility.