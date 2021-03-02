### Unreleased

- YYYY-MM-DD **BREAKING?** -- description

### 0.0.45-alpha.10 -- 2022-03-02

- 2022-03-02 -- Fixed issue where `ExecuteScript*` interactions were not being sent in correct GRPC request type
- 2022-03-02 -- Fixed issue where `GetAccount*` interactions were not being sent in correct GRPC request type

### 0.0.45-alpha.[4-6] -- 2022-02-02

- 2022-02-18 -- Merged `@onflow/send` into `@onflow/sdk`
- 2022-02-18 -- Merged `@onflow/decode` into `@onflow/sdk`
- 2022-02-18 -- Merged `@onflow/encode` into `@onflow/sdk`
- 2022-02-18 -- Merged `@onflow/interaction` into `@onflow/sdk`
- 2022-02-18 -- Merged `@onflow/response` into `@onflow/sdk`
- 2022-02-18 -- Merged all `@onflow/resolve-*` into `@onflow/sdk`
- 2022-02-18 -- Merged all `@onflow/build-*` into `@onflow/sdk`

### 0.0.45-alpha.[1-3] -- 2022-02-02

- 2022-02-02 -- Adds support for new `GetEvents`, `GetBlockHeader`, `GetBlock` interactions.

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
