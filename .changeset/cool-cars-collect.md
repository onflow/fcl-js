---
"@onflow/transport-http": minor
---

- Adds support for retrying requests when an ETIMEDOUT error occurs.
- Adds a default 30 second timeout to all requests, after which they will be retried.
