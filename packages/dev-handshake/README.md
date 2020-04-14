# Dev Handshake Service

## API

### GET /authenticate

> Displays a list of possible providers for the user to choose from. Upon selection of provider redirects to them including the `l6n`, `nonce` and `redirect`

**Accepted Query Params**
- `l6n` *required* - location (origin) of dApp
- `nonce` *required* - random string
- `provider` - a preferred provider (value is provider flow acct number)
- `force` - forces provider if no previous provider detected (value is boolean defaults to false)
- `redirect` *future* - used in eventual redirect flow

### GET /callback

> Receives query params and emits a `window.postMessage` event to the parent of the iframe (scoped to the `l6n`).

**Accepted Query Params**
- `acct` - flow acct of user if it exists
- `pacct` - flow acct of provider (used to look up onChain details of provider)
- `code` - a token fcl will include in provider hooks request
- `exp` - when the `code` expires (epoch)
- `hks` - a url where fcl can request the users provider hooks
- `nonce` - the nonce provided in the /authenticate request
- `l6n` - the location (origin) provided in the /authenticate request
- `redirect`

![diagram showing current fcl authn and authz flow](../dev-wallet/assets/FCL-AUTHN-AUTHZ-FLOWS-v1.png)
