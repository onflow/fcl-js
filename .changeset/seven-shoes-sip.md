---
"@onflow/fcl": minor
---

Make errors accessible to subscribers from fcl.tx polling (second argument of callback) and throw error for onceSealed, onceExecuted, onceFinalized promises.  Also removed retried polling requests as they are a redundancy already implemented by @onflow/transport-http
