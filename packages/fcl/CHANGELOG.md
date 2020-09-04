### Unreleased

- YYYY-MM-DD **BREAKING?** -- description

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
