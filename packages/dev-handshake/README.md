# Dev Handshake Service

## API

### GET /authenticate

> Displays a list of possible providers for the user to choose from. Upon selection of provider redirects to them including the `l6n`, `nonce` and `redirect`

**Accepted Query Params**

- `l6n` _required_ - location (origin) of dApp
- `nonce` _required_ - random string
- `provider` - a preferred provider (value is provider flow acct number)
- `force` - forces provider if no previous provider detected (value is boolean defaults to false)
- `scope` - additional values for the provider to expose in provider hooks
- `redirect` _future_ - where the provider redirects to after an authentication

If `redirect` is not present in the query params, then the provider will need to do a JavaScript `postMessage` scoped to the `l6n`.

example:
`/authenticate/?l6n=http%3A%2F%2Fdapp.com&nonce=foo&provider=asdf8703&force&scope=email+sms`

![diagram showing current fcl authn and authz flow](../dev-wallet/assets/fcl-ars-auth-v3.2.png)
