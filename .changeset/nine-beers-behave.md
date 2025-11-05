---
"@onflow/react-sdk": minor
"@onflow/demo": minor
---

Added standalone Profile component for displaying wallet information. The Profile component has been extracted from the Connect component modal to provide a reusable profile display that can be used independently. The component automatically detects connection state, showing a compact "No connected wallet" message when disconnected and full profile information when connected (including address, balance with cross-VM support, multi-token selector, copy/disconnect actions, and optional scheduled transactions).
