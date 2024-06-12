---
"@onflow/fcl": minor
---

Inject FCL WalletConnect Plugin by default.  All developers are expected to configure a WalletConnect project ID in their FCL configuration.  The relate configuration values are as follows:

```typescript
{
    // Required
    "walletconnect.projectId": "YOUR_PROJECT_ID",

    // Optional
    "app.detail.icon": "https://example.com/icon.png",
    "app.detail.name": "Example App",
    "app.detail.description": "Example App Description",
    "app.detail.url": "https://example.com",
}
```

These values are used to configure the WalletConnect client.  To obtain a project ID, please go to [WalletConnect's official website](https://walletconnect.com/).  Metadata is optional, but recommended (FCL will use default values if not provided).