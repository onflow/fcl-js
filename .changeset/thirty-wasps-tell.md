---
"@onflow/transport-http": minor
"@onflow/fcl-core": minor
"@onflow/typedefs": minor
"@onflow/sdk": minor
---

Adds support for signature extension data introduced by [FLIP 264](https://github.com/onflow/flips/blob/main/protocol/20250203-webauthn-credential-support.md).

Users can now include signature extension data in their transactions by returning an additional `extensionData` property in their signing functions.

```typescript
const authz = (ix: Interaction) => {
  return {
    addr: "0x1234567890abcdef",
    keyId: 0,
    signingFunction: (signable: Signable) => ({
      signature: "1234",
      extensionData: "1234"
    }),
  }
}
```