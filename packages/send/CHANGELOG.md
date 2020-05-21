### Unreleased

- YYYY-MM-DD **BREAKING?** -- description
- 2020-05-20 -- Updates address padding
- 2020-05-07 -- Allow authorizer proposer and payer to be the same account

### 0.0.10 -- 2020-05-06

- 2020-05-06 -- VSN `@onflow/interaction` 0.0.6 -> 0.0.7

### 0.0.9 -- 2020-05-04

- 2020-05-04 **BREAKING** -- VSN `@onflow/interaction` 0.0.5 -> 0.0.6 Breaking Change
- 2020-05-04 **BREAKING** -- Updates send according to the updated interaction ADT
- 2020-04-27 **BREAKING** -- Parses JSON-CDC payloads in `sendGetTransactionStatus`
- 2020-04-23 **BREAKING** -- Parses JSON-CDC payloads before putting them in a response.

### 0.0.8 -- 2020-04-20

- 2020-04-20 -- sendTransaction response transactionHash -> transactionId
- 2020-04-20 -- Fix critical bug in gettransactionStatus

### 0.0.7 -- 2020-04-20

- 2020-04-20 -- VSN `@onflow/interaction` 0.0.3 -> 0.0.5

### 0.0.6 -- 2020-04-20

- 2020-04-20 -- Removed `@onflow/bytes`
- 2020-04-19 **BREAKING** -- Updates `sendGetTransaction` to `sendGetTransactionStatus`. Updates internal functionality of `sendTransaction` and `sendGetEvents` according to the latest AccessAPI spec.

### 0.0.5 -- 2020-04-18

- 2020-04-18 **BREAKING** -- Updated `send-transaction.js` response to use `transactionId` instead of `transactionHash`
- 2020-04-18 -- VSN response 0.0.1 -> 0.0.2 breaking
  - Removed `decodeInstructions`
  - Removed `ping`
  - `transactionHash` -> `transactionId`
- 2020-04-18 -- VSN bytes 0.0.1 -> 0.0.2
- 2020-04-18 -- VSN jest 25.1.0 -> 25.3.0
- 2020-04-18 -- VSN microbundle 0.11.0 -> 0.12.0-next.8
- 2020-04-17 **BREAKING** -- Updates `sendGetTransaction(...)` to `sendGetTransactionStatus(...)` in accordance to the updated AccessAPI spec.

### 0.0.4 -- 2020-04-17

- Pre Changelog
