### Unreleased

- YYYY-MM-DD **BREAKING?** -- Who: description

## 0.0.54 -- 2021-07-23

- 2021-07-22 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds support for decoding `Enum` and `Capability` JSON-CDC payloads.

## 0.0.53 -- 2021-07-21

- 2021-07-21 -- Full version bump
- 2021-07-21 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Corrects error in send-get-account where account address was not supplied to GRPC request object.

## 0.0.52 -- 2021-07-21

- 2021-07-21 -- Full version bump
- 2021-07-21 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds support for decoding `Type` and `Path` JSON-CDC payloads.
- 2021-07-14 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Refactors Send Functions to prevent and mitigate cases where the expected request type cannot be determined.

## 0.0.51 -- 2021-07-20

- 2021-07-20 -- Full version bump

## 0.0.51-alpha.2 -- 2021-07-19

- 2021-07-14 -- Update `createSignableVoucher` to return `payloadSigs` and `envelopeSigs`. Addresses CORS bug.

## 0.0.51-alpha.1 -- 2021-07-13

- 2021-07-13 -- [@orodio](https://github.com/orodio): Top level now exposes `TestUtils`
- 2021-07-13 -- [@orodio](https://github.com/orodio): Config now exposes an `overload` function. `config.overload(otps, callback)`
- 2021-07-13 -- [@orodio](https://github.com/orodio): Config now exposes a `first` function. `config.first(["A", "B"], "FALLBACK")`
- 2021-07-13 -- [@orodo](https://github.com/orodio): Config functions can now be written like `config.get("foo")` instead of `config().get("foo")`
- 2021-07-13 -- [@orodio](https://github.com/orodio): Config now exposes an `all` function. `config().all()`
- 2021-06-24 -- [@gregsantos](https://github.com/gregsantos): Added `payer` signature to `payloadSigs` on `voucher`.

### Example Updates to config.

```javascript
import {config} from "@onflow/sdk"

expect(await config.all()).toEqual({})

config({
  "foo.bar": "baz",
})
config.put("bob", "pat")

expect(await config.all()).toEqual({
  "foo.bar": "baz",
  bob: "pat",
})

var ret = await config.overload({bob: "bill"}, async () => {
  expect(await config.all()).toEqual({
    "foo.bar": "baz",
    bob: "bill",
  })
  return "woot"
})

expect(ret).toBe("woot")

expect(await config.all()).toEqual({
  "foo.bar": "baz",
  bob: "pat",
})

expect(await config.first(["bax", "foo.bar"], "FALLBACK")).toBe("baz")
expect(await config.first(["nope", "oh-no"], "FALLBACK")).toBe("FALLBACK")
```

### Example of TestUtils.

```javascript
import {config, TestUtils} from "@onflow/sdk"
import * as sdk from "@onflow/sdk"

test("single account/key pair for all three signatory roles", async () => {
  await config.overload(
    {
      // mockSend -- Mocks the internal send calls used in resolve
      // can pass in a function that will be used as the return value of sdk.transport (Response)
      "sdk.transport": TestUtils.mockSend(),
    },
    async () => {
      const SIGNATORY = {addr: "0x1111222233334444", keyId: 1}
      const idof = acct => `${acct.addr}-${acct.keyId}`

      // authzFn -- stubs out an authorization function from a signatory
      const authz = TestUtils.authzFn(SIGNATORY)

      // run -- builds and resolves the transaction // sets a reference block
      var ix = await run([
        sdk.transaction`CODE`,
        sdk.proposer(authz),
        sdk.payer(authz),
        sdk.authorizations([authz]),
      ])

      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[TestUtils.idof(SIGNATORY)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(SIGNATORY))
      expect(ix.payer).toBe(TestUtils.idof(SIGNATORY))
      expect(ix.authorizations).toEqual([TestUtils.idof(SIGNATORY)])
    }
  )
})
```

## 0.0.50 - 2021-06-17

- 2021-06-16 -- [@orodio](https://github.com/orodio): General dep clean up. And force internal usage of config.

## 0.0.49 - 2021-06-16

- 2021-06-16 -- [@orodio](https://github.com/orodio): Pulled `@onflow/config` functionality into `@onflow/sdk`
- 2021-06-16 -- [@orodio](https://github.com/orodio): Added the ability to set configuration values in `sdk.config` from initializer.

```javascript
import {config} from "@onflow/sdk"

config({
  "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xFUSD": "0xe223d8a629e49c68",
})

// -- is equivalent to --

config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xFUSD", "0xe223d8a629e49c68")
```

## 0.0.48 - 2021-06-16

- 2021-06-16 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds ability to specify optional grpc metadata to requests sent to an Access API. To specity grpc metadata, use config like such:

```javascript
import {config} from "@onflow/config"

fcl.config().put("grpc.metadata", {headerkey1: "headervalue1"})
```

- 2021-06-16 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds encode signable wallet utility function.

## 0.0.47 - 2021-06-04

- 2021-04-27 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Full VSN Release `@onflow/sdk` 0.0.47-alpha.1 -> 0.0.47

## 0.0.47-alpha.1 - 2021-05-27

- 2021-05-27 -- [@gregsantos](https://github.com/gregsantos): Exposes `createSignableVoucher`

## 0.0.46 - 2021-05-10

- 2021-05-05 -- [@gregsantos](https://github.com/gregsantos): Renames `createVoucher` to `createSignableVoucher` and moves to `resolve-signatures`. Internal only.
- 2021-04-27 -- [@gregsantos](https://github.com/gregsantos): Removes `resolveParams`, Updates `resolvers` exported from `sdk`

## 0.0.46-alpha.1 - 2021-05-05

- 2021-05-05 **BREAKING** -- Prepends a transaction domain tag to encoded payload and envelope messages. Transaction domain tags allow signers to identify which messages are intended to represent encoded transactions, and which are not. The Flow protocol has been updated (as of May 5th 2021) to both accept signatures produced from messages prepended with a transaction domain tag, and from messages that are not. The next spork (time and date of next spork are TBD) will _strictly require_ all signatures for transnactions to have been produced from messages prepended with a transaction domain tag. This breaking change requires _all_ users of Flow Client Library and the Flow JavaScript SDK to update their versions to a version greater than or equal to the verison that this change was included in.
- 2021-05-03 -- Decodes signatures in block responses from a byte array to a hex string
- 2021-05-03 -- Updates shape of response ADT

## 0.0.45 - 2021-04-27

- 2021-04-27 -- Full VSN Release `@onflow/sdk` 0.0.45-alpha.20 -> 0.0.45
- 2021-04-23 -- Moves type check utils to `/utils`
- 2021-04-23 -- Move `createVoucher` to `/utils` to resolve circular dependency in `interaction`
- 2021-04-22 -- Adds `wallet-utils` `validateSignableTransaction` support for wallets to validate Signable payload
- 2021-04-20 -- Removes **Deprecated** `params`, `buildParams`
- 2021-04-21 -- Updates encoding naming of `gasLimit` and `script` to `computeLimit` and `cadence`. Internal only.

### 0.0.45-alpha.20 -- 2021-04-21

- 2021-04-21 -- **BREAKING** The experimental feature `sdk.meta` which allowed for a transaction to send along meta data to an authorization function has been removed because of the unprovable nature of its data and our strict trustless requirements. We believe this removal is in the best interest for js-sdk/fcl end users and will be looking into alternative approaches that provide the same functionality but in a more provable/trustless way. We have no ETA on this features replacement.

### 0.0.45-alpha.19 -- 2021-04-16

- 2021-04-15 -- Adds `createSignableVoucher` for message payload verification by wallet, pass as `voucher` to `PreSignable` and `Signable`
- 2021-04-15 -- Exposes `config` from SDK.
- 2021-04-15 -- Removes use of `TextDecoder` from `send-get-account`.
- 2021-04-13 -- Adds `makeVoucher` for message verification by wallet, pass as `voucher` to `PreSignable` and `Signable`
- 2021-04-09 -- Internal only - Added `prepAccount` to `interaction`. Update `authorizations`, `payer`, `proposer` builders.

### 0.0.45-alpha.18 -- 2021-04-09

- 2021-04-08 -- Adds `GetCollection` interaction, build, send and decode support.
- 2021-04-08 -- - Implements Transaction Metadata for media rich wallet transactions
- 2021-04-08 -- Implements Transaction Metadata for media rich wallet transactions
  - Adds `metadata` field to `interaction` and provides `meta` builder to include optional metadata with the transaction.
  - `meta()` accepts the optional fields `title`, `description`, `price`, and `image` as Strings. Invalid types will `throw`. Unsupport fields will be scrubbed.

```js
sdk.build([
  sdk.transaction(TRANSFER_NFT),
  sdk.meta({
    title: 'Kitty Kangol',
    description: 'A cool cat hat',
    price: '10',
    image: 'https://i.imgur.com/Ol2zPax.png',
  }),
])

type Metadata {
  title: String
  description: String
  price: String
  image: String
}
```

- 2021-04-08 -- Added validation to `metadata` builder.
- 2021-04-07 -- Internal only. Update `build-limit`
- 2021-04-07 -- Added `metadata` field to `Signable` in resolve-signatures.
- 2021-04-06 -- Added `metadata` field to `preSignable` in resolve-accounts. Export `meta` builder from `sdk.js`
- 2021-04-02 -- Updated `interaction` with metadata object. Added `meta` builder function and test.

### 0.0.45-alpha.16 -- 2021-03-28

- 2021-03-28 -- Added new test suits for `build` and `send`.

### 0.0.45-alpha.15 -- 2021-03-22

- 2021-03-22 -- Fixed an issue where `send-get-block-header` interactions were not able to be sent correctly.

### 0.0.45-alpha.14 -- 2021-03-19

- 2021-03-19 -- Fixed an issue in `send-get-block` and `send-get-block-header` where timestamps were not being decoded to ISO strings properly.

### 0.0.45-alpha.13 -- 2021-03-17

- 2021-03-17 -- Fixed an issue in `send-get-events` where block IDs were not being decoded to strings properly.

### 0.0.45-alpha.12 -- 2021-03-12

- 2021-03-16 -- Fixed issue in `interaction` where `isNumber` did not correctly check if a value is a number or not
- 2021-03-12 -- Fixed issue where `GetEvents*` interactions were not being sent in correct GRPC request type

### 0.0.45-alpha.10 -- 2021-03-02

- 2021-03-02 -- Fixed issue where `ExecuteScript*` interactions were not being sent in correct GRPC request type
- 2021-03-02 -- Fixed issue where `GetAccount*` interactions were not being sent in correct GRPC request type

### 0.0.45-alpha.[4-6] -- 2021-02-02

- 2021-02-18 -- Merged `@onflow/send` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/decode` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/encode` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/interaction` into `@onflow/sdk`
- 2021-02-18 -- Merged `@onflow/response` into `@onflow/sdk`
- 2021-02-18 -- Merged all `@onflow/resolve-*` into `@onflow/sdk`
- 2021-02-18 -- Merged all `@onflow/build-*` into `@onflow/sdk`

### 0.0.45-alpha.[1-3] -- 2021-02-02

- 2021-02-02 -- Adds support for new `GetEvents`, `GetBlockHeader`, `GetBlock` interactions.

### 0.0.44 -- 2020-12-11

- 2020-12-11 -- VSN `@onflow/sdk-resolve-ref-block-id` 0.0.0 -> 0.0.7
- 2020-12-11 -- VSN `@onflow/decode` 0.0.9 -> 0.0.10
- 2020-12-11 -- VSN `@onflow/send` 0.0.34 -> 0.0.34

### 0.0.43 -- 2020-10-28

- 2020-11-04 -- VSN `@onflow/sdk-resolve-signatures` 0.0.4 -> 0.0.5

### 0.0.42 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/decode` 0.0.8 -> 0.0.9
- 2020-10-28 -- VSN `@onflow/sdk-build-authorizations` 0.0.0 -> 0.0.1
- 2020-10-28 -- VSN `@onflow/sdk-resolve-ref-block-id` 0.0.0 -> 0.0.3
- 2020-10-28 -- VSN `@onflow/sdk-resolve-signatures` 0.0.3 -> 0.0.4

### 0.0.41 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-resolve-signatures` 0.0.2 -> 0.0.3

### 0.0.40 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-resolve-signatures` 0.0.1 -> 0.0.2

### 0.0.39 -- 2020-10-08

- 2020-10-08 -- VSN `@onflow/decode` 0.0.7 -> 0.0.8
- 2020-10-08 -- VSN `@onflow/sdk-build-get-account` 0.0.0 -> 0.0.1

### 0.0.38 -- 2020-10-07

- 2020-10-07 -- Proxy `@onflow/sdk-resolve-ref-block-id` at the top level
- 2020-10-07 -- Removed export of resolveProposerSequenceNumber (it never worked anyways)

### 0.0.37 -- 2020-10-07

- 2020-10-07 -- VSN `@onflow/sdk-resolve-signatures` 0.0.0 -> 0.0.1

### 0.0.36 -- 2020-10-07

- 2020-10-07 -- Proxy `@onflow/sdk-build-authorizations` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-account` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-events` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-latest-block` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-block-by-id` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-get-block-by-height` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-transaction-status` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-limit` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-params` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-arguments` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-proposer` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-payer` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-ping` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-ref` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-script` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-transaction` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-validator` at the top level
- 2020-10-07 -- Proxy `@onflow/sdk-build-invariant` at the top level

### 0.0.35 -- 2020-09-29

- 2020-09-29 -- Proxy @onflow/sdk-resolve-validators at the top level
- 2020-09-29 -- Proxy @onflow/sdk-resolve-signatures at the top level
- 2020-09-29 -- Proxy @onflow/sdk-resolve-accounts at the top level
- 2020-09-29 -- Proxy @onflow/sdk-resolve-arguments at the top level
- 2020-09-29 -- VSN `@onflow/send` 0.0.21 -> 0.0.22

### 0.0.34 - 2020-09-29

- 2020-09-29 -- VSN `@onflow/send` 0.0.20 -> 0.0.21

### 0.0.33 - 2020-09-29

- 2020-09-29 -- Proxy sdk.resolveArguments to `@onflow/sdk-resolve-arguments`
- 2020-09-29 -- VSN `@onflow/sdk-resolve-cadence` 0.0.0 -> 0.0.1

### 0.0.32 -- 2020-09-29

- 2020-09-29 -- Deprecate resolverParams

### 0.0.31 -- 2020-08-25

- 2020-08-25 -- VSN `@onflow/send` 0.0.17 -> 0.0.20
- 2020-08-25 -- VSN `@onflow/interaction` 0.0.9 -> 0.0.10
- 2020-08-25 -- VSN `@onflow/decode` 0.0.6 -> 0.0.7
- 2020-08-24 -- Implements GetBlockByHeight and GetBlockById interaction builders.
- 2020-08-13 -- Updates Readme with an overview of the JS-SDK
- 2020-08-10 -- Updates Readme

### 0.0.30 -- 2020-7-27

- 2020-07-27 -- VSN `@onflow/send` 0.0.16 -> 0.0.17

### 0.0.29 -- 2020-7-27

- 2020-07-27 -- VSN `@onflow/send` 0.0.15 -> 0.0.16

### 0.0.28 -- 2020-7-13

- 2020-07-13 -- VSN `@onflow/send` 0.0.14 -> 0.0.15
- 2020-07-20 -- Adds resolveProposerSequenceNumber resolve to resolve proposer sequence numbers where they are unspecified.
- 2020-07-20 -- Adds resolveRefBlockId resolver to resolve reference block ids on transactions where they are unspecified.

### 0.0.27 -- 2020-7-13

- 2020-07-13 -- VSN `@onflow/send` 0.0.13 -> 0.0.14

### 0.0.26 -- 2020-07-09

- 2020-07-09 -- FIX: resolveSignatures now passes arguments to encoder

### 0.0.25 -- 2020-07-09

- 2020-07-09 -- FIX: no longer lose signatures sometimes
- 2020-07-07 -- Updates to Readme

### 0.0.24 -- 2020-07-07

- 2020-06-30 -- Update dependency versions
- 2020-06-22 -- Adds arguments to signature resolver
- 2020-06-19 -- Adds argument resolver
- 2020-06-19 -- Adds argument builder
- 2020-06-08 -- Added validator builder

### 0.0.23 -- 2020-06-04

- 2020-06-04 -- VSN `@onflow/encode` 0.0.2 -> 0.0.3

### 0.0.22 -- 2020-06-03

- 2020-06-03 -- VSN `@onflow/encode` 0.0.2 -> 0.0.3
- 2020-06-03 -- VSN `@onflow/send` 0.0.11 -> 0.0.12

### 0.0.21 -- 2020-05-15

- 2020-05-15 -- VSN `@qvvg/templar` 0.0.0 -> 0.0.1

### 0.0.20 -- 2020-05-07

- 2020-05-07 **BREAKING** -- Proposers accept authorization object

### 0.0.19 -- 2020-05-07

- Same as 0.0.18 but the package-lock was updated

### 0.0.18 -- 2020-05-07

- 2020-05-07 -- Params resolver parses params correctly
- 2020-05-07 -- Allows authorizer payer and proposer to be the same

### 0.0.17 -- 2020-05-06

- 2020-05-06 -- VSN `@onflow/send` 0.0.9 -> 0.0.10
- 2020-05-06 -- VSN `@onflow/interaction` 0.0.6 -> 0.0.7
- 2020-05-05 -- Allows params to accept async resolver functions that return a param

### 0.0.16 -- 2020-05-05

- 2020-05-05 -- Fix bug where `resolveAccounts` was mutating a copy of an account instead of the original account

### 0.0.15 -- 2020-05-05

- 2020-05-05 -- VSN `@onflow/send` 0.0.8 -> 0.0.9
- 2020-05-05 -- VSN `@onflow/interaction` 0.0.5 -> 0.0.6
- 2020-05-05 -- VSN `@onflow/decode` 0.0.5 -> 0.0.6
- 2020-05-04 **BREAKING** -- Updates sdk according to updated interaction ADT

### 0.0.14 -- 2020-04-20

- 2020-04-20 -- VSN `@onflow/send` 0.0.7 -> 0.0.8

### 0.0.13 -- 2020-04-20

- 2020-04-20 -- Updates proposer to set only on the top level proposer field on the ix and updates tests.
- 2020-04-20 -- VSN `@onflow/send` 0.0.5 -> 0.0.7
- 2020-04-20 -- VSN `@onflow/interaction` 0.0.4 -> 0.0.5
- 2020-04-20 -- VSN `@onflow/decode` 0.0.4 -> 0.0.5
- 2020-04-20 -- VSN `@onflow/encode` 0.0.1 -> 0.0.2
- 2020-04-20 -- VSN `@onflow/interaction` 0.0.3 -> 0.0.4
- 2020-04-20 **BREAKING** -- No longer exporting `nonce`
- 2020-04-20 **BREAKING** -- No longer exporting `resolvePayload`
- 2020-04-20 -- Remove dep `rlp`
- 2020-04-20 -- Remove dep `@onflow/bytes`
- 2020-04-20 -- Add dep `@onflow/encode` 0.0.1
- 2020-04-19 **BREAKING** Updates `resolveAuthorizations()` according to the signing requirements of the latest AccessAPI spec. Adds `payer` builder.

### 0.0.12 -- 2020-04-18

- 2020-04-18 -- VSN send 0.0.4 -> 0.0.5
- 2020-04-18 -- VSN bytes 0.0.1 -> 0.0.2
- 2020-04-18 -- VSN decode 0.0.1 -> 0.0.4
- 2020-04-18 -- VSN jest 25.1.0 -> 25.3.0
- 2020-04-18 -- VSN microbundle 0.11.0 -> 0.12.0-next.8
- 2020-04-18 **BREAKING** -- Changes `getTransaction(txId)` to `getTransactionStatus(txId)` in accordance to the updated AccessAPI spec.
- 2020-04-17 -- Adds `proposer` builder to add a proposer to a transaction interaction.

### 0.0.11 -- 2020-04-17

- Pre Changelog
