# @onflow/kit

## 0.3.1

### Patch Changes

- [#2491](https://github.com/onflow/fcl-js/pull/2491) [`ff07e0ea38845f188f0bbbcb9a365cad96cfb8b7`](https://github.com/onflow/fcl-js/commit/ff07e0ea38845f188f0bbbcb9a365cad96cfb8b7) Thanks [@jribbink](https://github.com/jribbink)! - Export `useCrossVmTokenBalance` hook

## 0.3.0

### Minor Changes

- [#2398](https://github.com/onflow/fcl-js/pull/2398) [`99510059485ffb2d741407a573f3be076c77e044`](https://github.com/onflow/fcl-js/commit/99510059485ffb2d741407a573f3be076c77e044) Thanks [@jribbink](https://github.com/jribbink)! - Add `useCrossVmTokenBalance` hook to get full token balance across both Cadence and EVM accounts

### Patch Changes

- [#2486](https://github.com/onflow/fcl-js/pull/2486) [`3f5d5037882d2da03713ece0ff4f6b7e9d3693b2`](https://github.com/onflow/fcl-js/commit/3f5d5037882d2da03713ece0ff4f6b7e9d3693b2) Thanks [@jribbink](https://github.com/jribbink)! - Switch `contractIdentifier` to `vaultIdentifier` in `useCrossVmTokenBalance` hook

## 0.2.1

### Patch Changes

- [#2433](https://github.com/onflow/fcl-js/pull/2433) [`9f9e18b5381d455ef4546b6521ea37c5eef3063c`](https://github.com/onflow/fcl-js/commit/9f9e18b5381d455ef4546b6521ea37c5eef3063c) Thanks [@jribbink](https://github.com/jribbink)! - Fix script args query key

## 0.2.0

### Minor Changes

- [#2439](https://github.com/onflow/fcl-js/pull/2439) [`a36d78ee5283ceb9a2f411e6da9ddf0373777c24`](https://github.com/onflow/fcl-js/commit/a36d78ee5283ceb9a2f411e6da9ddf0373777c24) Thanks [@jribbink](https://github.com/jribbink)! - Make `txId` optional for `useFlowTransactionStatus`

- [#2368](https://github.com/onflow/fcl-js/pull/2368) [`eca4617c2d4d10d85bad0324f6c6064489c3d1c3`](https://github.com/onflow/fcl-js/commit/eca4617c2d4d10d85bad0324f6c6064489c3d1c3) Thanks [@jribbink](https://github.com/jribbink)! - Add `useCrossVmBatchTransaction` function

- [#2414](https://github.com/onflow/fcl-js/pull/2414) [`605f66c7a78f9ff1474a18b70298956b92f90bc1`](https://github.com/onflow/fcl-js/commit/605f66c7a78f9ff1474a18b70298956b92f90bc1) Thanks [@chasefleming](https://github.com/chasefleming)! - **BREAKING**: Rename `useFlowTransaction` as `useFlowTransactionStatus`

- [#2367](https://github.com/onflow/fcl-js/pull/2367) [`9595af75eeffb0c91f9bb94b70fb0adf4db40eec`](https://github.com/onflow/fcl-js/commit/9595af75eeffb0c91f9bb94b70fb0adf4db40eec) Thanks [@jribbink](https://github.com/jribbink)! - Add `useFlowChainId` hook to the `@onflow/kit` package.

### Patch Changes

- [#2419](https://github.com/onflow/fcl-js/pull/2419) [`f498aa9fdb0739aef8905593bdbd05af9db3267a`](https://github.com/onflow/fcl-js/commit/f498aa9fdb0739aef8905593bdbd05af9db3267a) Thanks [@chasefleming](https://github.com/chasefleming)! - Update readme with `useFlowRevertibleRandom` hook

- [#2417](https://github.com/onflow/fcl-js/pull/2417) [`8608416f4d26e40d3bfa464da7e988c8beb35336`](https://github.com/onflow/fcl-js/commit/8608416f4d26e40d3bfa464da7e988c8beb35336) Thanks [@jribbink](https://github.com/jribbink)! - Fix `useFlowRevertibleRandom` range

- Updated dependencies [[`0b83658f62a428a70074d33875f264fbd48aff1e`](https://github.com/onflow/fcl-js/commit/0b83658f62a428a70074d33875f264fbd48aff1e), [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab)]:
  - @onflow/fcl@1.18.0

## 0.2.0-alpha.1

### Minor Changes

- [#2439](https://github.com/onflow/fcl-js/pull/2439) [`a36d78ee5283ceb9a2f411e6da9ddf0373777c24`](https://github.com/onflow/fcl-js/commit/a36d78ee5283ceb9a2f411e6da9ddf0373777c24) Thanks [@jribbink](https://github.com/jribbink)! - Make `txId` optional for `useFlowTransactionStatus`

### Patch Changes

- Updated dependencies []:
  - @onflow/fcl@1.18.0-alpha.1

## 0.2.0-alpha.0

### Minor Changes

- [#2368](https://github.com/onflow/fcl-js/pull/2368) [`eca4617c2d4d10d85bad0324f6c6064489c3d1c3`](https://github.com/onflow/fcl-js/commit/eca4617c2d4d10d85bad0324f6c6064489c3d1c3) Thanks [@jribbink](https://github.com/jribbink)! - Add `useCrossVmBatchTransaction` function

- [#2414](https://github.com/onflow/fcl-js/pull/2414) [`605f66c7a78f9ff1474a18b70298956b92f90bc1`](https://github.com/onflow/fcl-js/commit/605f66c7a78f9ff1474a18b70298956b92f90bc1) Thanks [@chasefleming](https://github.com/chasefleming)! - **BREAKING**: Rename `useFlowTransaction` as `useFlowTransactionStatus`

- [#2367](https://github.com/onflow/fcl-js/pull/2367) [`9595af75eeffb0c91f9bb94b70fb0adf4db40eec`](https://github.com/onflow/fcl-js/commit/9595af75eeffb0c91f9bb94b70fb0adf4db40eec) Thanks [@jribbink](https://github.com/jribbink)! - Add `useFlowChainId` hook to the `@onflow/kit` package.

### Patch Changes

- [#2419](https://github.com/onflow/fcl-js/pull/2419) [`f498aa9fdb0739aef8905593bdbd05af9db3267a`](https://github.com/onflow/fcl-js/commit/f498aa9fdb0739aef8905593bdbd05af9db3267a) Thanks [@chasefleming](https://github.com/chasefleming)! - Update readme with `useFlowRevertibleRandom` hook

- [#2417](https://github.com/onflow/fcl-js/pull/2417) [`8608416f4d26e40d3bfa464da7e988c8beb35336`](https://github.com/onflow/fcl-js/commit/8608416f4d26e40d3bfa464da7e988c8beb35336) Thanks [@jribbink](https://github.com/jribbink)! - Fix `useFlowRevertibleRandom` range

- Updated dependencies [[`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab)]:
  - @onflow/fcl@1.18.0-alpha.0

## 0.1.0

### Minor Changes

- [#2384](https://github.com/onflow/fcl-js/pull/2365) [`24e2a5c160531b6973a4137e569ce127a9e7e590`](https://github.com/onflow/fcl-js/commit/24e2a5c160531b6973a4137e569ce127a9e7e590) Thanks [@chasefleming](https://github.com/chasefleming)! - Add `useFlowRevertibleRandom` hook

### Patch Changes

- Updated dependencies [[`f86b71357696826a5ad7b8e578de76ecebcd2e29`](https://github.com/onflow/fcl-js/commit/f86b71357696826a5ad7b8e578de76ecebcd2e29)]:
  - @onflow/fcl@1.17.0

## 0.0.2

### Patch Changes

- [#2359](https://github.com/onflow/fcl-js/pull/2359) [`67a302d72e217f16720a6fb38eb3d097fc98bcd6`](https://github.com/onflow/fcl-js/commit/67a302d72e217f16720a6fb38eb3d097fc98bcd6) Thanks [@chasefleming](https://github.com/chasefleming)! - Remove alpha message

## 0.0.1

Initial release of the FCL Kit Library. Built on top of FCL-JS, this library provides easy-to-use React bindings for building frontend applications that interact with Flow blockchain. It includes a set of components and hooks that simplify the process of connecting to Flow wallets, managing user sessions, querying on-chain data, and handling transactions.

See more on the official [Flow Developer Documentation](https://developers.flow.com/tools/kit).
