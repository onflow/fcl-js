# @onflow/react-sdk

## 1.0.0

### Patch Changes

- Updated dependencies [[`afab3d34cf05b000a80eaed217ef8ec772ecc32d`](https://github.com/onflow/fcl-js/commit/afab3d34cf05b000a80eaed217ef8ec772ecc32d)]:
  - @onflow/fcl@1.21.0

## 0.12.1

### Patch Changes

- [#2696](https://github.com/onflow/fcl-js/pull/2696) [`3bf349056b623cdd19ca5f135120250814bcf810`](https://github.com/onflow/fcl-js/commit/3bf349056b623cdd19ca5f135120250814bcf810) Thanks [@jribbink](https://github.com/jribbink)! - Add support for `discoveryAuthnExclude` configuration option in React SDK. This allows users to exclude specific wallet providers from the discovery service, complementing the existing `discoveryAuthnInclude` option.

- Updated dependencies [[`3bf349056b623cdd19ca5f135120250814bcf810`](https://github.com/onflow/fcl-js/commit/3bf349056b623cdd19ca5f135120250814bcf810), [`a5e84666b0482547fe9411064f4821e8067e5238`](https://github.com/onflow/fcl-js/commit/a5e84666b0482547fe9411064f4821e8067e5238)]:
  - @onflow/fcl@1.20.5

## 0.12.0

### Minor Changes

- [#2677](https://github.com/onflow/fcl-js/pull/2677) [`58f953381ee0826bfeb6d068c28bf8853b470915`](https://github.com/onflow/fcl-js/commit/58f953381ee0826bfeb6d068c28bf8853b470915) Thanks [@mfbz](https://github.com/mfbz)! - Added `NftCard` component for displaying NFT metadata. The component automatically fetches and renders NFT information including image, name, description, collection details, traits, and external links. Features loading states, error handling, dark mode support and optional display of traits and additional metadata through `showTraits` and `showExtra` props.

- [#2685](https://github.com/onflow/fcl-js/pull/2685) [`f47dd3bd1efce2498b3ab731ca08da2326604f5f`](https://github.com/onflow/fcl-js/commit/f47dd3bd1efce2498b3ab731ca08da2326604f5f) Thanks [@mfbz](https://github.com/mfbz)! - Added standalone Profile component for displaying wallet information. The Profile component has been extracted from the Connect component modal to provide a reusable profile display that can be used independently. The component automatically detects connection state, showing a compact "No connected wallet" message when disconnected and full profile information when connected (including address, balance with cross-VM support, multi-token selector, copy/disconnect actions, and optional scheduled transactions).

- [#2679](https://github.com/onflow/fcl-js/pull/2679) [`8ef9cc6933f61c45e32a69c9d723ab669a7757ec`](https://github.com/onflow/fcl-js/commit/8ef9cc6933f61c45e32a69c9d723ab669a7757ec) Thanks [@mfbz](https://github.com/mfbz)! - Added `ScheduledTransactionList` component, a scrollable list that displays scheduled transactions for a Flow account with support for MetadataViews.Display (thumbnails, names, descriptions), transaction cancellation, automatic refresh, responsive design and dark mode. Each card shows the scheduled execution time, fee, priority, and effort with an optional cancel button for pending transactions.

  Enhanced `Connect` component to display scheduled transactions in the profile modal. The modal now shows the user's scheduled transactions below their account info with a configurable `modalConfig` prop to control visibility.

- [#2680](https://github.com/onflow/fcl-js/pull/2680) [`b7d73c709f009b192bed02f476edcc997538213d`](https://github.com/onflow/fcl-js/commit/b7d73c709f009b192bed02f476edcc997538213d) Thanks [@mfbz](https://github.com/mfbz)! - Enhanced the Connect component to enable visualizing different tokens like USDC and other stablecoins within the Connect modal.

### Patch Changes

- Updated dependencies []:
  - @onflow/fcl@1.20.4

## 0.11.0

### Minor Changes

- [#2592](https://github.com/onflow/fcl-js/pull/2592) [`52688c33eb41862a5daa4226e2fdfa98afab79a4`](https://github.com/onflow/fcl-js/commit/52688c33eb41862a5daa4226e2fdfa98afab79a4) Thanks [@mfbz](https://github.com/mfbz)! - Added `useCrossVmBridgeTokenFromEvm` hook for bridging fungible tokens from Flow EVM to Cadence. This hook withdraws tokens from the signer's Cadence-Owned Account (COA) in EVM and deposits them into their Cadence vault, automatically configuring the vault if needed.

- [#2652](https://github.com/onflow/fcl-js/pull/2652) [`879ae914da9f4cffa3bccffddef462ffbe8ed8c7`](https://github.com/onflow/fcl-js/commit/879ae914da9f4cffa3bccffddef462ffbe8ed8c7) Thanks [@mfbz](https://github.com/mfbz)! - Added `useFlowAuthz` hook for handling Flow transaction authorization. This hook returns an authorization function that can be used when sending a transaction, defaulting to the current user's wallet authorization when no custom authorization is provided.

- [#2624](https://github.com/onflow/fcl-js/pull/2624) [`7963d7aa2984e4fd0ad94182a65c8c4065f1d98c`](https://github.com/onflow/fcl-js/commit/7963d7aa2984e4fd0ad94182a65c8c4065f1d98c) Thanks [@mfbz](https://github.com/mfbz)! - Added `useCrossVmBridgeNftFromEvm` hook for bridging NFTs from Flow EVM to Cadence. This hook withdraws an NFT from the signer's Cadence-Owned Account (COA) in EVM and deposits it into their Cadence collection, automatically configuring the collection if needed.

- [#2661](https://github.com/onflow/fcl-js/pull/2661) [`e651d625af8e516d935e74d885524eca741dd9e6`](https://github.com/onflow/fcl-js/commit/e651d625af8e516d935e74d885524eca741dd9e6) Thanks [@mfbz](https://github.com/mfbz)! - Add `useFlowNftMetadata` hook to fetch NFT metadata including name, description, thumbnail, traits, and collection information from Flow blockchain accounts.

- [#2653](https://github.com/onflow/fcl-js/pull/2653) [`9ff0f852c5f350e41996c7b8b62e9feb9dd1ee89`](https://github.com/onflow/fcl-js/commit/9ff0f852c5f350e41996c7b8b62e9feb9dd1ee89) Thanks [@mfbz](https://github.com/mfbz)! - Added `useFlowSchedule` hook for managing scheduled transactions. This hook provides methods to list, get, setup, and cancel scheduled transactions with support for handler data resolution and transaction status tracking.

- [#2660](https://github.com/onflow/fcl-js/pull/2660) [`54672e6b16234d33fa33889d2b48451697fc8f8e`](https://github.com/onflow/fcl-js/commit/54672e6b16234d33fa33889d2b48451697fc8f8e) Thanks [@mfbz](https://github.com/mfbz)! - Fixed transaction management so that it clears up transaction state on error

### Patch Changes

- Updated dependencies []:
  - @onflow/fcl@1.20.3

## 0.10.3

### Patch Changes

- [#2647](https://github.com/onflow/fcl-js/pull/2647) [`6a9b141a51c563663f1030504a1537cf8a0d76df`](https://github.com/onflow/fcl-js/commit/6a9b141a51c563663f1030504a1537cf8a0d76df) Thanks [@jribbink](https://github.com/jribbink)! - Export `useFlowClient` from Flow React SDK

## 0.10.2

### Patch Changes

- [#2634](https://github.com/onflow/fcl-js/pull/2634) [`d5f242b217426f125610f8043aea1a70e143a94a`](https://github.com/onflow/fcl-js/commit/d5f242b217426f125610f8043aea1a70e143a94a) Thanks [@jribbink](https://github.com/jribbink)! - Update dependencies

- Updated dependencies [[`d5f242b217426f125610f8043aea1a70e143a94a`](https://github.com/onflow/fcl-js/commit/d5f242b217426f125610f8043aea1a70e143a94a)]:
  - @onflow/fcl@1.20.1

## 0.10.1

### Patch Changes

- [#2620](https://github.com/onflow/fcl-js/pull/2620) [`f02d080abc695f339e0a27bfeba01b8b085faad2`](https://github.com/onflow/fcl-js/commit/f02d080abc695f339e0a27bfeba01b8b085faad2) Thanks [@jribbink](https://github.com/jribbink)! - Fix animation for `TransactionDialog`

## 0.10.0

### Minor Changes

- [#2579](https://github.com/onflow/fcl-js/pull/2579) [`77f4cbaa5c73b5fccbc6e76414293debfe167659`](https://github.com/onflow/fcl-js/commit/77f4cbaa5c73b5fccbc6e76414293debfe167659) Thanks [@jribbink](https://github.com/jribbink)! - Decoupled React SDK from the global state and include a `FlowClient` instance within the `FlowProvider` context.

  This allows for better modularity and helps support multiple FCL instances in the same application. Additionally, this is part of a larger effort to move towards a cleaner lifecycle less reliant on asynchronous state management prone to race conditions and frequent bugs.

  Moving forward, developers wishing to interact directly with the Flow Client (FCL Instance) should use the `useFlowClient` hook provided by the React SDK instead of relying on globally exported functions from the FCL package.

- [#2582](https://github.com/onflow/fcl-js/pull/2582) [`90f0728bd34fb1d1ce52a08c24f1a4fbcf5db455`](https://github.com/onflow/fcl-js/commit/90f0728bd34fb1d1ce52a08c24f1a4fbcf5db455) Thanks [@jribbink](https://github.com/jribbink)! - Update with latest changes on `master` branch

- [#2558](https://github.com/onflow/fcl-js/pull/2558) [`11c6830ae99d2daba54276854157b6fc234dd6ef`](https://github.com/onflow/fcl-js/commit/11c6830ae99d2daba54276854157b6fc234dd6ef) Thanks [@jribbink](https://github.com/jribbink)! - Add `<TransactionButton />` component

- [#2559](https://github.com/onflow/fcl-js/pull/2559) [`b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1`](https://github.com/onflow/fcl-js/commit/b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1) Thanks [@jribbink](https://github.com/jribbink)! - Add component theming options

- [#2609](https://github.com/onflow/fcl-js/pull/2609) [`4be1b361150c557f5c5a747b461558e35e1d3c38`](https://github.com/onflow/fcl-js/commit/4be1b361150c557f5c5a747b461558e35e1d3c38) Thanks [@mfbz](https://github.com/mfbz)! - Added tailwind prefix for style isolation

- [#2559](https://github.com/onflow/fcl-js/pull/2559) [`b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1`](https://github.com/onflow/fcl-js/commit/b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1) Thanks [@jribbink](https://github.com/jribbink)! - Add `<TransactionLink />` component

- [#2559](https://github.com/onflow/fcl-js/pull/2559) [`b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1`](https://github.com/onflow/fcl-js/commit/b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1) Thanks [@jribbink](https://github.com/jribbink)! - Add `<Connect />` component

- [#2579](https://github.com/onflow/fcl-js/pull/2579) [`77f4cbaa5c73b5fccbc6e76414293debfe167659`](https://github.com/onflow/fcl-js/commit/77f4cbaa5c73b5fccbc6e76414293debfe167659) Thanks [@jribbink](https://github.com/jribbink)! - Removed deprecated `useCurrentFlowUser` hook in favor of `useFlowCurrentUser` hook for better clarity and consistency in naming conventions.

- [#2604](https://github.com/onflow/fcl-js/pull/2604) [`aea5df931cbc7f664aaf6730cac8c270166a2abd`](https://github.com/onflow/fcl-js/commit/aea5df931cbc7f664aaf6730cac8c270166a2abd) Thanks [@jribbink](https://github.com/jribbink)! - Add missing config key for `discoveryAuthnInclude`.

### Patch Changes

- [#2589](https://github.com/onflow/fcl-js/pull/2589) [`43751a02a0052f2f77915e527afb0edd21097b79`](https://github.com/onflow/fcl-js/commit/43751a02a0052f2f77915e527afb0edd21097b79) Thanks [@mfbz](https://github.com/mfbz)! - Updated transaction button pending state

- Updated dependencies [[`305763aadbd906d3355aab2ba2ba6aa3aae1cb7b`](https://github.com/onflow/fcl-js/commit/305763aadbd906d3355aab2ba2ba6aa3aae1cb7b), [`e8293cb2c752b340793d2342450a022d79c14edc`](https://github.com/onflow/fcl-js/commit/e8293cb2c752b340793d2342450a022d79c14edc), [`c5191ab2f51204dac26f099c071ed02913b616ff`](https://github.com/onflow/fcl-js/commit/c5191ab2f51204dac26f099c071ed02913b616ff)]:
  - @onflow/fcl@1.20.0

## 0.10.0-alpha.3

### Patch Changes

- Updated dependencies [[`c5191ab2f51204dac26f099c071ed02913b616ff`](https://github.com/onflow/fcl-js/commit/c5191ab2f51204dac26f099c071ed02913b616ff)]:
  - @onflow/fcl@1.20.0-alpha.2

## 0.10.0-alpha.2

### Minor Changes

- [#2579](https://github.com/onflow/fcl-js/pull/2579) [`77f4cbaa5c73b5fccbc6e76414293debfe167659`](https://github.com/onflow/fcl-js/commit/77f4cbaa5c73b5fccbc6e76414293debfe167659) Thanks [@jribbink](https://github.com/jribbink)! - Decoupled React SDK from the global state and include a `FlowClient` instance within the `FlowProvider` context.

  This allows for better modularity and helps support multiple FCL instances in the same application. Additionally, this is part of a larger effort to move towards a cleaner lifecycle less reliant on asynchronous state management prone to race conditions and frequent bugs.

  Moving forward, developers wishing to interact directly with the Flow Client (FCL Instance) should use the `useFlowClient` hook provided by the React SDK instead of relying on globally exported functions from the FCL package.

- [#2609](https://github.com/onflow/fcl-js/pull/2609) [`4be1b361150c557f5c5a747b461558e35e1d3c38`](https://github.com/onflow/fcl-js/commit/4be1b361150c557f5c5a747b461558e35e1d3c38) Thanks [@mfbz](https://github.com/mfbz)! - Added tailwind prefix for style isolation

- [#2604](https://github.com/onflow/fcl-js/pull/2604) [`aea5df931cbc7f664aaf6730cac8c270166a2abd`](https://github.com/onflow/fcl-js/commit/aea5df931cbc7f664aaf6730cac8c270166a2abd) Thanks [@jribbink](https://github.com/jribbink)! - Add missing config key for `discoveryAuthnInclude`.

## 0.10.0-alpha.1

### Patch Changes

- [#2589](https://github.com/onflow/fcl-js/pull/2589) [`43751a02a0052f2f77915e527afb0edd21097b79`](https://github.com/onflow/fcl-js/commit/43751a02a0052f2f77915e527afb0edd21097b79) Thanks [@mfbz](https://github.com/mfbz)! - Updated transaction button pending state

## 0.10.0-alpha.0

### Minor Changes

- [#2582](https://github.com/onflow/fcl-js/pull/2582) [`90f0728bd34fb1d1ce52a08c24f1a4fbcf5db455`](https://github.com/onflow/fcl-js/commit/90f0728bd34fb1d1ce52a08c24f1a4fbcf5db455) Thanks [@jribbink](https://github.com/jribbink)! - Update with latest changes on `master` branch

### Patch Changes

- Update to latest changes on master branch

## 0.9.0

### Minor Changes

- [#2533](https://github.com/onflow/fcl-js/pull/2533) [`ad8989cd3d994df2835cff2c24e19aa73fdbd0d5`](https://github.com/onflow/fcl-js/commit/ad8989cd3d994df2835cff2c24e19aa73fdbd0d5) Thanks [@jribbink](https://github.com/jribbink)! - Add emulator support for Cross VM hooks

## 0.8.0

### Minor Changes

- [#2568](https://github.com/onflow/fcl-js/pull/2568) [`8c707acc270bfb6f6cd592a4cd061d105aea56f9`](https://github.com/onflow/fcl-js/commit/8c707acc270bfb6f6cd592a4cd061d105aea56f9) Thanks [@chasefleming](https://github.com/chasefleming)! - Add `discoveryAuthnEndpoint` to config options

## 0.8.0-alpha.0

### Minor Changes

- [#2558](https://github.com/onflow/fcl-js/pull/2558) [`11c6830ae99d2daba54276854157b6fc234dd6ef`](https://github.com/onflow/fcl-js/commit/11c6830ae99d2daba54276854157b6fc234dd6ef) Thanks [@jribbink](https://github.com/jribbink)! - Add `<TransactionButton />` component

- [#2559](https://github.com/onflow/fcl-js/pull/2559) [`b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1`](https://github.com/onflow/fcl-js/commit/b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1) Thanks [@jribbink](https://github.com/jribbink)! - Add component theming options

- [#2559](https://github.com/onflow/fcl-js/pull/2559) [`b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1`](https://github.com/onflow/fcl-js/commit/b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1) Thanks [@jribbink](https://github.com/jribbink)! - Add `<TransactionLink />` component

- [#2559](https://github.com/onflow/fcl-js/pull/2559) [`b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1`](https://github.com/onflow/fcl-js/commit/b1bcc0a7b2bbfd952b0fa93ac79c35fcd7dccae1) Thanks [@jribbink](https://github.com/jribbink)! - Add `<Connect />` component

### Patch Changes

- Updated dependencies [[`e8293cb2c752b340793d2342450a022d79c14edc`](https://github.com/onflow/fcl-js/commit/e8293cb2c752b340793d2342450a022d79c14edc)]:
  - @onflow/fcl@1.20.0-alpha.0

## 0.7.0

### Minor Changes

- [#2551](https://github.com/onflow/fcl-js/pull/2551) [`32db6b4e909d92aa66d969990ae2c21f93c52b38`](https://github.com/onflow/fcl-js/commit/32db6b4e909d92aa66d969990ae2c21f93c52b38) Thanks [@chasefleming](https://github.com/chasefleming)! - Rename `useCurrentFlowUser` to `useFlowCurrentUser`

## 0.6.0

### Minor Changes

- [#2542](https://github.com/onflow/fcl-js/pull/2542) [`aacae504fbc568d5629211c28c55849074ed696b`](https://github.com/onflow/fcl-js/commit/aacae504fbc568d5629211c28c55849074ed696b) Thanks [@chasefleming](https://github.com/chasefleming)! - Add `useFlowTransaction` hook

## 0.5.0

### Minor Changes

- [#2514](https://github.com/onflow/fcl-js/pull/2514) [`fcab03fe88078a0b8a1ae5e252377903c6187c5a`](https://github.com/onflow/fcl-js/commit/fcab03fe88078a0b8a1ae5e252377903c6187c5a) Thanks [@jribbink](https://github.com/jribbink)! - Add `useCrossVmTransactionStatus` hook

- [#2523](https://github.com/onflow/fcl-js/pull/2523) [`6076b0bfc95bcbe07a734c0c10c32d81ecb1dd2d`](https://github.com/onflow/fcl-js/commit/6076b0bfc95bcbe07a734c0c10c32d81ecb1dd2d) Thanks [@mfbz](https://github.com/mfbz)! - Added `useFlowQueryRaw` hook to execute a query and get non-decoded data as result.

### Patch Changes

- [#2506](https://github.com/onflow/fcl-js/pull/2506) [`3263a098d32d8d4f73224f3d1facebd1a824c53b`](https://github.com/onflow/fcl-js/commit/3263a098d32d8d4f73224f3d1facebd1a824c53b) Thanks [@jribbink](https://github.com/jribbink)! - Make `useFlowChainId` args consistent with other hooks

- [#2529](https://github.com/onflow/fcl-js/pull/2529) [`27a6b4f346eb26af63522aa25f7734c7b232bbef`](https://github.com/onflow/fcl-js/commit/27a6b4f346eb26af63522aa25f7734c7b232bbef) Thanks [@jribbink](https://github.com/jribbink)! - Export `useFlowChainId`

- Updated dependencies [[`6076b0bfc95bcbe07a734c0c10c32d81ecb1dd2d`](https://github.com/onflow/fcl-js/commit/6076b0bfc95bcbe07a734c0c10c32d81ecb1dd2d)]:
  - @onflow/fcl@1.19.0

## 0.4.0

### Minor Changes

- [#2503](https://github.com/onflow/fcl-js/pull/2503) [`29a2c99b08d6f5a427bef5362e5d4e7ada9d51e7`](https://github.com/onflow/fcl-js/commit/29a2c99b08d6f5a427bef5362e5d4e7ada9d51e7) Thanks [@jribbink](https://github.com/jribbink)! - **BREAKING** Update `useCrossVmBatchTransaction` result data to the Cadence transaction ID instead of waiting for the EVM transaction hash.

  This change ensures consistency with the existing `useFlowMutate` response format and latencies, as waiting for the transaction execution for EVM results adds unnecessary delays and harms user experience.

  Developers should instead manually subscribe to the Cadence transaction status to track execution status and determine the EVM transaction results.

- [#2460](https://github.com/onflow/fcl-js/pull/2460) [`d7b673e2ea97f6ab5ec2b81d2186b3e9799460cf`](https://github.com/onflow/fcl-js/commit/d7b673e2ea97f6ab5ec2b81d2186b3e9799460cf) Thanks [@jribbink](https://github.com/jribbink)! - Add `useCrossVmSpendNft` hook

- [#2503](https://github.com/onflow/fcl-js/pull/2503) [`f1a7eeab04a46e78b34a7a19aa4d8d93f3add452`](https://github.com/onflow/fcl-js/commit/f1a7eeab04a46e78b34a7a19aa4d8d93f3add452) Thanks [@jribbink](https://github.com/jribbink)! - Add `useCrossVmSpendToken` hook

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

- [#2367](https://github.com/onflow/fcl-js/pull/2367) [`9595af75eeffb0c91f9bb94b70fb0adf4db40eec`](https://github.com/onflow/fcl-js/commit/9595af75eeffb0c91f9bb94b70fb0adf4db40eec) Thanks [@jribbink](https://github.com/jribbink)! - Add `useFlowChainId` hook to the `@onflow/react-sdk` package.

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

- [#2367](https://github.com/onflow/fcl-js/pull/2367) [`9595af75eeffb0c91f9bb94b70fb0adf4db40eec`](https://github.com/onflow/fcl-js/commit/9595af75eeffb0c91f9bb94b70fb0adf4db40eec) Thanks [@jribbink](https://github.com/jribbink)! - Add `useFlowChainId` hook to the `@onflow/react-sdk` package.

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
