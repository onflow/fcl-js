# Dev Handshake Service

A service that enables Wallet Provider Discovery used in local development and testing.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Low

The external facing aspect of this package is fairly locked in, and already service its purpose.
That being said, this package is under active development and isnt really anywhere near its final form.
It still has a long ways to go.
It does currently work as long as all the values line up with its internal hardcoded values and nothing onchain matters.
Since this entire project is about things onchain being important, not being able to work with onchain data really needs to be addressed, which will be happening shortly.

Known Upcoming Changes:

- Currently the wallet providers are hardcoded. These will be moved to onchain.

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
