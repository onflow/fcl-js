---
"@onflow/react-sdk": minor
"@onflow/demo": minor
---

Added `ScheduledTransactionList` component, a scrollable list that displays scheduled transactions for a Flow account with support for MetadataViews.Display (thumbnails, names, descriptions), transaction cancellation, automatic refresh, responsive design and dark mode. Each card shows the scheduled execution time, fee, priority, and effort with an optional cancel button for pending transactions.

Enhanced `Connect` component to display scheduled transactions in the profile modal. The modal now shows the user's scheduled transactions below their account info with a configurable `modalConfig` prop to control visibility.
