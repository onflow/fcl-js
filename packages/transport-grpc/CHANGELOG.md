## Unreleased

- 2022-04-05 -- **BREAKING** [@chasefleming](https://github.com/chasefleming): Remove the following from block response:

  - `block.collectionGuarantees.signatures`
  - `block.blockSeals.executionReceiptSignatures`
  - `block.blockSeals.resultApprovalSignatures`
  - `block.signatures`
- 2022-04-05 -- **BREAKING** [@JeffreyDoyle](https://github.com/JeffreyDoyle): Remove getLatestBlock send method
- 2022-04-05 -- **BREAKING** [@JeffreyDoyle](https://github.com/JeffreyDoyle): Remove getBlockById send method
- 2022-04-05 -- **BREAKING** [@JeffreyDoyle](https://github.com/JeffreyDoyle): Remove getBlockByHeight send method

## 1.0.0-alpha.1

### Major Changes

- Release 1.0.0 alpha

### Patch Changes

- Updated dependencies [7469c5c3]
- Updated dependencies

  - @onflow/util-address@1.0.0-alpha.0
  - @onflow/util-invariant@1.0.0-alpha.0
  - @onflow/protobuf@1.0.0-alpha.0
  - @onflow/rlp@1.0.0-alpha.0
  - @onflow/util-template@1.0.0-alpha.0

- 2022-03-16 -- [@bthaile](https://github.com/bthaile) Payer can now be an array.
- 2022-02-11 -- Uses Buffer as provided by context injection

## 0.0.2 -- 2022-02-02

- 2022-02-02 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Adds statusString lookup based off of status field.

## 0.0.1 -- 2022-01-13

- 2022-01-13 -- [@JeffreyDoyle](https://github.com/JeffreyDoyle): Initial Implementation.
