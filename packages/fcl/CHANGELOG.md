### Unreleased

- YYYY-MM-DD **BREAKING?** -- description

### 0.0.67 - 2021-01-14

- 2021-01-14 -- General Cleanup

### 0.0.67-alpha.43 - 2020-12-11

- 2020-12-11 -- Disables setting keyId in fetch signatures

### 0.0.67-alpha.42 - 2020-12-11

- 2020-12-11 -- VSN `@onflow/sdk-send` 0.0.9 -> 0.0.10
- 2020-12-11 -- VSN `@onflow/sdk-resolve` 0.0.9 -> 0.0.10
- 2020-12-11 -- VSN `@onflow/sdk-account` 0.0.7 -> 0.0.8

### 0.0.67-alpha.41 - 2020-12-08

- 2020-12-08 -- FIX: issue with multi-sig from same account (@boczeraturl)

### 0.0.67-alpha.[36..40] - 2020-12-03

- 2020-12-03 -- Updates `@onflow/send` -- This includes some fixes involving how signatures are added to transaction rpc calls
- 2020-12-03 -- FIX: `fcl.serialize` respects injected resolver propoerly.
- 2020-12-03 -- Prep for Resolver extraction.

### 0.0.67-alpha.[19..35] - 2020-11-26

- 2020-11-26 -- `pre-authz` golden path tested on testnet with dapper
- 2020-11-26 -- Early exit `HTTP/POST` so that it can work like an `HTTP/RPC`
- 2020-11-26 -- added an alias from `HTTP/RPC` to `HTTP/POST`
- 2020-11-26 -- additional `pre-authz` debuging in current user
- 2020-11-26 -- service-endpoint includes `l6n` as `window.location.origin`

### 0.0.67-alpha.18 - 2020-11-26

- 2020-11-26 -- `pre-authz` flatmaps exec-services response

### 0.0.67-alpha.17 - 2020-11-23

- 2020-11-23 -- `pre-authz` flow executed
- 2020-11-23 -- `fcl.serialize` now accepts custom resolver

### 0.0.67-alpha.16 - 2020-11-20

- 2020-11-20 -- Rough in pre-authz flow

### 0.0.67-alpha.[7..15] - 2020-11-19

- 2020-11-19 -- Experimental IFRAME/RPC strategy

### 0.0.67-alpha.6 - 2020-11-19

- 2020-11-19 -- IFRAMES can be closed with an `{type: "FCL:FRAME:CLOSE"}` postMessage

### 0.0.67-alpha.5 - 2020-11-19

- 2020-11-19 -- Auto replace known cadence addresses
- 2020-11-17 -- Auto resolve sequence number for proposer if its not there

> Example references this contract: [Testnet Profile Contract](https://flow-view-source.com/testnet/account/0x1d007d755706c469)

```javascript
// Config fcl with contract addresses
// Their config key must start with `0x`
fcl.config()
  .put("env", "testnet")
  .put("0xProfile", "0x1d007d755506c469")

// Your transactions can now look like this
await fcl.send([
  fcl.proposer(fcl.authz),
  fcl.authorizations([fcl.authz])
  fcl.payer(fcl.authz),
  fcl.limit(35),
  fcl.args([
    fcl.arg("Bob", t.String),
  ]),
  fcl.transaction`
    import Profile from 0xProfile

    transaction(displayName: String) {
      prepare(account: AuthAccount) {
        account
          .borrow<&{Profile.Owner}>(from: Profile.privatePath)!
          .setDisplayName(displayName)
      }
    }
  `
])

// Your scripts can now look like this
await fcl.send([
  fcl.args([
    fcl.arg("0xba1132bc08f82fe2", t.Address),
  ]),
  fcl.script`
    import Profile from 0xProfile

    pub fun main(address: Address): Profile.ReadOnly? {
      return Profile.fetchProfile(address)
    }
  `,
]).then(fcl.decode)
```

### 0.0.67-alpha.4 - 2020-11-17

- 2020-11-17 -- Fix small issues involving NPM

### 0.0.67-alpha.3 - 2020-11-17

- 2020-11-17 -- Fix issue where validation for composite signature for keyId of zero was counted as false

### 0.0.67-alpha.2 - 2020-11-17

- 2020-11-17 -- Injected in a custom resolver in prep for pre-authz service

### 0.0.67-alpha.1 - 2020-11-17

- 2020-11-17 -- Added `fcl.account`
- 2020-11-17 -- Added `fcl.reauthenticate`
- 2020-11-17 -- Added `fcl.authz`
- 2020-11-17 -- Added `fcl.signUp`
- 2020-11-17 -- Added `fcl.logIn`

```javascript
// fcl.account - A convenience function for fetching an account
/* old */ await fcl.send([fcl.getAccount("0x1d007d755706c469")])
/* new */ await fcl.account("0x1d007d755706c469")

// fcl.reauthenticate - Logs the current user out before attempting to authenticate again
await fcl.reauthenticate()

// fcl.authz - alias for fcl.currentUser().authorization
await fcl.send([
  fcl.transaction(txCode),
  fcl.proposer(fcl.authz),
  fcl.payer(fcl.authz),
  fcl.authorizations([fcl.authz]),
])

// fcl.signUp and fcl.logIn - Currently these alias fcl.authenticate, eventually they will pass additional context to the wallets
await fcl.signUp()
await fcl.logIn()
```

### 0.0.67-alpha.0 - 2020-11-17

- 2020-11-17 -- VSN @onflow/sdk-latest-block 0.0.2 -> 0.0.3
- 2020-11-17 -- VSN @onflow/sdk-account 0.0.2 -> 0.0.3
- 2020-11-17 -- VSN @onflow/sdk-send 0.0.3 -> 0.0.5

### 0.0.66 - 2020-11-09

- 2020-11-09 -- Adds a handshake mechanism to exec-authz-service to allow clients to request signable message when ready

### 0.0.65 - 2020-11-04

- 2020-11-05 -- sansPrefix required addresses

### 0.0.64 - 2020-11-04

- 2020-11-04 -- VSN `@onflow/sdk-send` 0.0.2 -> 0.0.3

### 0.0.63 - 2020-11-04

- 2020-11-04 -- VSN `@onflow/sdk-resolve` 0.0.3 -> 0.0.4

### 0.0.62 - 2020-10-29

- 2020-10-29 -- Fixed an issue regarding fetching transaction statuses

### 0.0.61 - 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-decode` 0.0.0 -> 0.0.1
- 2020-10-28 -- VSN `@onflow/sdk-build-authorizations` 0.0.0 -> 0.0.1
- 2020-10-28 -- VSN `@onflow/sdk-latest-block` 0.0.0 -> 0.0.2
- 2020-10-28 -- VSN `@onflow/sdk-account` 0.0.0 -> 0.0.2
- 2020-10-28 -- VSN `@onflow/sdk-send` 0.0.0 -> 0.0.2
- 2020-10-28 -- VSN `@onflow/sdk-resolve` 0.0.0 -> 0.0.3
- 2020-10-28 -- Added in `persistSession` config flag (defaults to true)

### 0.0.61-alpha.5 - 2020-10-08

- 2020-10-08 -- ADD PROXY `latestBlock` exports directly to `@onflow/sdk-latest-block`
- 2020-10-08 -- ADD PROXY `account` exports directly to `@onflow/sdk-account`
- 2020-10-08 -- PROXY `send` export directly to `@onflow/sdk-send`
- 2020-10-08 -- PROXY `decode` export directly to `@onflow/sdk-decode`
- 2020-10-08 -- VSN `@onflow/decode` 0.0.7 -> 0.0.8
- 2020-10-08 -- VSN `@onflow/sdk-build-get-account` 0.0.0 -> 0.0.1

### 0.0.61-alpha.4 - 2020-10-07

- 2020-10-07 -- remove resolvers and replace with @onflow/sdk-resolve

### 0.0.61-alpha.3 - 2020-10-07

- 2020-10-07 -- remove use of sdk
- 2020-10-07 -- use `@onflow/sdk-resolve-ref-block-id` package directly

### 0.0.61-alpha.2 - 2020-10-07

- 2020-10-07 -- VSN `@onflow/sdk-resolve-signatures` 0.0.0 -> 0.0.1
- 2020-10-07 -- VSN `@onflow/sdk` 0.0.35 -> 0.0.37

### 0.0.61-alpha.1 - 2020-10-07

- 2020-10-07 -- proxy to packages directly instead of via sdk
- 2020-10-07 -- allow for authn iframe to be closed by content

### 0.0.60 -- 2020-10-05

- 2020-10-05 -- iframe feature policy allows usb on all contexts

### 0.0.59 -- 2020-09-29

- 2020-09-29 -- VSN `@onflow/sdk` 0.0.31 -> 0.0.35
- 2020-09-29 -- use `@onflow/sdk-resolve-validators` package directly
- 2020-09-29 -- use `@onflow/sdk-resolve-signatures` package directly
- 2020-09-29 -- use `@onflow/sdk-resolve-accounts` package directly

### 0.0.58 -- 2020-09-29

- 2020-09-29 -- use `@onflow/sdk-resolve-arguments` package directly

### 0.0.57 -- 2020-09-29

- 2020-09-29 -- add a z-index value to service frame
- 2020-09-29 -- resolveParams -> resolveCadence

### 0.0.56 -- 2020-09-04

- 2020-09-04 -- Fixed some issues involving FCL talking to iframes

### 0.0.55 -- 2020-09-04

- 2020-09-04 -- Wallet Provider Services

### 0.0.54 -- 2020-09-03

- 2020-09-03 -- Authn and Authz iframes allow usb feature policy.

### 0.0.53 -- 2020-08-26

- 2020-08-26 -- `@onflow/sdk` VSN `0.0.30` -> `0.0.31`
- 2020-08-20 -- Adds Authorization Function Documentation

### 0.0.52 -- 2020-08-18

- 2020-08-18 -- Authorization persists using local storage (this isnt the final solution, but creates the experience we want for now)
- 2020-08-18 -- authn and authz iframes are now full width and height
- 2020-08-18 -- Fixed an issue where unauthenticating the currentUser wasnt clearning the address on the user
- 2020-08-18 -- Added two new util functions `fcl.withPrefix` and `fcl.sansPrefix`

### 0.0.51 -- 2020-08-14

- 2020-08-14 -- `fcl.tx(resp).once*` throw errors when statusCode is non-zero, errors can be suppressed (previous behaviour) py passing `{suppress: true}` to the `.once*` function.
- 2020-08-14 -- `fcl.tx(resp).subscribe(callback)` callback will only be called when the status is different to what it was before.

### 0.0.50 -- 2020-08-14

- 2020-08-14 -- Fixeds some small bugs due to typos

### 0.0.49 -- 2020-08-13

- 2020-08-13 -- Adds export of `fcl.events(eventKey).subscribe(callback)`

### 0.0.48 -- 2020-08-13

- 2020-08-13 -- Removed `resolveSequenceNumber` from default resolver

### 0.0.47 -- 2020-08-13

- 2020-08-13 -- `@onflow/config` VSN `0.0.1` -> `0.0.2`
- 2020-08-13 -- `@onflow/util-actor` VSN `0.0.1` -> `0.0.2`
- 2020-08-07 -- Adds resolvers `resolveRefBlockId` and `resolveProposerSequenceNumber` to fcl resolve.

### 0.0.46 -- 2020-07-27

- 2020-07-27 -- VSN `@onflow/sdk` 0.0.28 -> 0.0.30

### 0.0.45 -- 2020-07-22

- 2020-07-22 -- deprecate fields on CurrentUser data structure

### 0.0.44 -- 2020-07-22

- 2020-07-22 -- added `tx(r).onceFinalized()` and `tx(r).onceExecuted`.
- 2020-07-22 -- added `tx.isFinalized(txStatus)` and `tx.isExecuted(txStatus)`.

### 0.0.43 -- 2020-07-21

- 2020-07-21 -- VSN `@onflow/sdk` 0.0.27 -> 0.0.28

### 0.0.42 -- 2020-07-20

- 2020-07-20 -- Convert config and actor to use external `@onflow/confg` and `@onflow/util-actor`

### 0.0.41 -- 2020-07-13

- 2020-07-13 -- VSN `@onflow/sdk` 0.0.26 -> 0.0.27

### 0.0.40 -- 2020-07-09

- 2020-07-09 -- Bring in resolveSignatures fix from SDK that passes arguments to the encoder function

### 0.0.39 -- 2020-07-09

- 2020-07-09 -- Expose `fcl.args` and `fcl.arg`
- 2020-07-09 -- Bring in resolveSignatures fix from SDK that deals with signatures better
- 2020-07-08 -- Updates FCL's resolve implementation according to the new resolvers available in the SDK.
- 2020-07-08 -- VSN `@onflow/sdk` 0.0.23 -> 0.0.24

### 0.0.38

- 2020-06-23 -- Added `fcl.serialize`

### 0.0.37 -- 2020-06-04

- 2020-06-04 -- VSN `@onflow/sdk` 0.0.22 -> 0.0.23

### 0.0.36 -- 2020-06-03

- 2020-06-03 -- VSN `@onflow/sdk` 0.0.21 -> 0.0.22

### 0.0.35 -- 2020-05-15

- Rerelease because funky build

### 0.0.34 -- 2020-05-15

- 2020-05-15 -- VSN `@onflow/sdk` 0.0.20 -> 0.0.21

### 0.0.33 -- 2020-05-07

- 2020-05-07 -- VSN `@onflow/sdk` 0.0.19 -> 0.0.20

### 0.0.32 -- 2020-05-07

- 2020-05-07 -- add .npmignore with src/

### 0.0.31 -- 2020-05-07

- 2020-05-07 -- VSN `@onflow/sdk` 0.0.17 -> 0.0.19

### 0.0.30 -- 2020-05-07

- 2020-05-07 -- Created and exposed a top level `tx` function
- 2020-05-07 -- actor spawn now excepts an object of handlers
- 2020-05-07 -- Moved common actor logic into actor (where, all)
- 2020-05-07 -- Exposed fcls actor registry to window

### 0.0.29 -- 2020-05-06

- 2020-05-06 -- Fixed an issue with custom decoders
- 2020-05-06 -- Leverage named imports to enable better tree shaking
- 2020-05-06 -- Proxy `@onflow/sdk` through fcl to enable single import
- 2020-05-06 -- VSN `@onflow/sdk` 0.0.16 -> 0.0.17
- 2020-05-05 -- VSN `@onflow/sdk` 0.0.15 -> 0.0.16
- 2020-05-05 -- Update resolvers based on sdk update
- 2020-05-05 -- VSN `@onflow/sdk` 0.0.14 -> 0.0.15 Breaking Change
- 2020-04-29 -- authn challenge response no longer locks to handshake origin
- 2020-04-28 -- `fcl.user(addr).info()` does a `send([getAccount(addr)])` returning the `account`
- 2020-04-23 -- `fcl.authenticate()` renders iframe for config: `challenge.handshake`

### 0.0.28 -- 2020-04-20

- 2020-04-20 -- VSN `@onflow/sdk` 0.0.12 -> 0.0.14
- 2020-04-20 -- Remove `@onflow/send` in favour of `@onflow/sdk`

### 0.0.27 -- 2020-04-18

- 2020-04-18 -- VSN sdk 0.0.4 -> 0.0.5
- 2020-04-18 -- VSN sdk 0.0.11 -> 0.0.12
- 2020-04-18 -- VSN jest 25.1.0 -> 25.3.0
- 2020-04-18 -- VSN microbundle 0.11.0 -> 0.12.0-next.8

### 0.0.26 -- 2020-04-17

- Pre Changelog
