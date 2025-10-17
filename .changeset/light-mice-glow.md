---
"@onflow/react-sdk": minor
---

Added `useFlowAuthz` hook for handling Flow transaction authorization. This hook returns an authorization function that can be used when sending a transaction, defaulting to the current user's wallet authorization when no custom authorization is provided.
