---
"@onflow/fcl": minor
---

Make errors accessible to subscribers from fcl.tx polling (txStatus.error) and throw for onceSealed, onceExecuted, onceFinalized.  Remove retried polling requests as they are a redundancy already implemented by @onflow/transport-http
