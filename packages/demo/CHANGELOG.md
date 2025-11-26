# @onflow/demo

## 1.2.0

### Minor Changes

- [#2677](https://github.com/onflow/fcl-js/pull/2677) [`58f953381ee0826bfeb6d068c28bf8853b470915`](https://github.com/onflow/fcl-js/commit/58f953381ee0826bfeb6d068c28bf8853b470915) Thanks [@mfbz](https://github.com/mfbz)! - Added `NftCard` component for displaying NFT metadata. The component automatically fetches and renders NFT information including image, name, description, collection details, traits, and external links. Features loading states, error handling, dark mode support and optional display of traits and additional metadata through `showTraits` and `showExtra` props.

- [#2685](https://github.com/onflow/fcl-js/pull/2685) [`f47dd3bd1efce2498b3ab731ca08da2326604f5f`](https://github.com/onflow/fcl-js/commit/f47dd3bd1efce2498b3ab731ca08da2326604f5f) Thanks [@mfbz](https://github.com/mfbz)! - Added standalone Profile component for displaying wallet information. The Profile component has been extracted from the Connect component modal to provide a reusable profile display that can be used independently. The component automatically detects connection state, showing a compact "No connected wallet" message when disconnected and full profile information when connected (including address, balance with cross-VM support, multi-token selector, copy/disconnect actions, and optional scheduled transactions).

- [#2679](https://github.com/onflow/fcl-js/pull/2679) [`8ef9cc6933f61c45e32a69c9d723ab669a7757ec`](https://github.com/onflow/fcl-js/commit/8ef9cc6933f61c45e32a69c9d723ab669a7757ec) Thanks [@mfbz](https://github.com/mfbz)! - Added `ScheduledTransactionList` component, a scrollable list that displays scheduled transactions for a Flow account with support for MetadataViews.Display (thumbnails, names, descriptions), transaction cancellation, automatic refresh, responsive design and dark mode. Each card shows the scheduled execution time, fee, priority, and effort with an optional cancel button for pending transactions.

  Enhanced `Connect` component to display scheduled transactions in the profile modal. The modal now shows the user's scheduled transactions below their account info with a configurable `modalConfig` prop to control visibility.

- [#2673](https://github.com/onflow/fcl-js/pull/2673) [`e4e921a552caa78a8ef02b50a3e8431faee6764a`](https://github.com/onflow/fcl-js/commit/e4e921a552caa78a8ef02b50a3e8431faee6764a) Thanks [@mfbz](https://github.com/mfbz)! - Added flow-react-sdk-starter banner.

- [#2681](https://github.com/onflow/fcl-js/pull/2681) [`3d6d1ab75898ff3b2d151ee2d1bd5923461f8b51`](https://github.com/onflow/fcl-js/commit/3d6d1ab75898ff3b2d151ee2d1bd5923461f8b51) Thanks [@mfbz](https://github.com/mfbz)! - Optimized hot reload for demo running locally

## 1.1.0

### Minor Changes

- [#2592](https://github.com/onflow/fcl-js/pull/2592) [`52688c33eb41862a5daa4226e2fdfa98afab79a4`](https://github.com/onflow/fcl-js/commit/52688c33eb41862a5daa4226e2fdfa98afab79a4) Thanks [@mfbz](https://github.com/mfbz)! - Added `useCrossVmBridgeTokenFromEvm` hook for bridging fungible tokens from Flow EVM to Cadence. This hook withdraws tokens from the signer's Cadence-Owned Account (COA) in EVM and deposits them into their Cadence vault, automatically configuring the vault if needed.

- [#2663](https://github.com/onflow/fcl-js/pull/2663) [`8ea4051b2a80024ade40bd58227c81f476011299`](https://github.com/onflow/fcl-js/commit/8ea4051b2a80024ade40bd58227c81f476011299) Thanks [@mfbz](https://github.com/mfbz)! - Added improved Google Analytics tracking for hash anchors

- [#2624](https://github.com/onflow/fcl-js/pull/2624) [`7963d7aa2984e4fd0ad94182a65c8c4065f1d98c`](https://github.com/onflow/fcl-js/commit/7963d7aa2984e4fd0ad94182a65c8c4065f1d98c) Thanks [@mfbz](https://github.com/mfbz)! - Added `useCrossVmBridgeNftFromEvm` hook for bridging NFTs from Flow EVM to Cadence. This hook withdraws an NFT from the signer's Cadence-Owned Account (COA) in EVM and deposits it into their Cadence collection, automatically configuring the collection if needed.

- [#2661](https://github.com/onflow/fcl-js/pull/2661) [`e651d625af8e516d935e74d885524eca741dd9e6`](https://github.com/onflow/fcl-js/commit/e651d625af8e516d935e74d885524eca741dd9e6) Thanks [@mfbz](https://github.com/mfbz)! - Add `useFlowNftMetadata` hook to fetch NFT metadata including name, description, thumbnail, traits, and collection information from Flow blockchain accounts.

- [#2657](https://github.com/onflow/fcl-js/pull/2657) [`5a0e093c5078253266b90cfc01884f532e0bd41e`](https://github.com/onflow/fcl-js/commit/5a0e093c5078253266b90cfc01884f532e0bd41e) Thanks [@mfbz](https://github.com/mfbz)! - Updated playground adding anchoring support and full responsive mode for mobile and tablet

- [#2662](https://github.com/onflow/fcl-js/pull/2662) [`5e88787e5b387bdc7289ff84b8d3e74f355b9ea8`](https://github.com/onflow/fcl-js/commit/5e88787e5b387bdc7289ff84b8d3e74f355b9ea8) Thanks [@mfbz](https://github.com/mfbz)! - Added Google Analytics and SEO improvements
