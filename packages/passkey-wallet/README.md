## Passkey Wallet (IFRAME/RPC)

A minimal hosted wallet webpage implementing the FCL wallet provider protocol over IFRAME/RPC, using WebAuthn (passkeys) for authentication and authorization.

What it does:
- Implements FCL postMessage protocol: `FCL:VIEW:READY`, receives `FCL:VIEW:READY:RESPONSE`, replies with `FCL:VIEW:RESPONSE` PollingResponses
- Returns an `AuthnResponse` containing services for `authn` (DATA) and `authz` (IFRAME/RPC)
- For `authz`, receives a `Signable` and returns a `CompositeSignature` built from a WebAuthn assertion

Notes:
- No FCL imports are used in the wallet. Local helpers mirror the spec for voucher encoding and account-proof encoding.
- Signature extension fields for WebAuthn are sketched and can be attached when the full extension wiring is finalized.

Dev
```bash
npm install
npm run dev
```

Build
```bash
npm run build
npm run serve
```

Integrate in an app by setting `discovery.wallet` to the hosted `index.html` URL and `discovery.wallet.method` to `IFRAME/RPC`.
