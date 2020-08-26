### Unreleased

- YYYY-MM-DD **BREAKING?** -- description

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
