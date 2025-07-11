# @onflow/fcl-react-native

## 1.12.1

### Patch Changes

- Updated dependencies [[`6076b0bfc95bcbe07a734c0c10c32d81ecb1dd2d`](https://github.com/onflow/fcl-js/commit/6076b0bfc95bcbe07a734c0c10c32d81ecb1dd2d)]:
  - @onflow/fcl-core@1.20.0

## 1.12.0

### Minor Changes

- [#2201](https://github.com/onflow/fcl-js/pull/2201) [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab) Thanks [@jribbink](https://github.com/jribbink)! - Add real-time streaming methods `subscribe` and `subscribeRaw`.

  These are only available when using a REST API endpoint and not supported by the deprecated GRPC trasnport.

  The following topics are now available:

  - `blocks`
  - `block_headers`
  - `block_digests`
  - `transaction_statues`
  - `events`
  - `account_statuses`

  Developers using `fcl.tx` and `fcl.events` will not need to make any changes to their existing app to realize the latency improvements of this change and will automatically benefit by upgrading to this version.

  Please see the [Flow Developer Documentation](https://developers.flow.com/clients/fcl-js/) for more details on how to use these new methods.

### Patch Changes

- Updated dependencies [[`3ac616d64c9abcda32f0c450119f22fa479d5e89`](https://github.com/onflow/fcl-js/commit/3ac616d64c9abcda32f0c450119f22fa479d5e89), [`0b83658f62a428a70074d33875f264fbd48aff1e`](https://github.com/onflow/fcl-js/commit/0b83658f62a428a70074d33875f264fbd48aff1e), [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab), [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab), [`2637889fdb47a2294ad2db9d06a16fac1d805a12`](https://github.com/onflow/fcl-js/commit/2637889fdb47a2294ad2db9d06a16fac1d805a12), [`4d3bb084c1442552d6a1de1f53435d1aa3f600b0`](https://github.com/onflow/fcl-js/commit/4d3bb084c1442552d6a1de1f53435d1aa3f600b0)]:
  - @onflow/sdk@1.9.0
  - @onflow/fcl-core@1.19.0

## 1.12.0-alpha.2

### Patch Changes

- Updated dependencies [[`2637889fdb47a2294ad2db9d06a16fac1d805a12`](https://github.com/onflow/fcl-js/commit/2637889fdb47a2294ad2db9d06a16fac1d805a12)]:
  - @onflow/fcl-core@1.19.0-alpha.2

## 1.12.0-alpha.1

### Patch Changes

- Updated dependencies [[`3ac616d64c9abcda32f0c450119f22fa479d5e89`](https://github.com/onflow/fcl-js/commit/3ac616d64c9abcda32f0c450119f22fa479d5e89)]:
  - @onflow/sdk@1.9.0-alpha.1
  - @onflow/fcl-core@1.19.0-alpha.1

## 1.12.0-alpha.0

### Minor Changes

- [#2201](https://github.com/onflow/fcl-js/pull/2201) [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab) Thanks [@jribbink](https://github.com/jribbink)! - Add real-time streaming methods `subscribe` and `subscribeRaw`.

  These are only available when using a REST API endpoint and not supported by the deprecated GRPC trasnport.

  The following topics are now available:

  - `blocks`
  - `block_headers`
  - `block_digests`
  - `transaction_statues`
  - `events`
  - `account_statuses`

  Developers using `fcl.tx` and `fcl.events` will not need to make any changes to their existing app to realize the latency improvements of this change and will automatically benefit by upgrading to this version.

  Please see the [Flow Developer Documentation](https://developers.flow.com/clients/fcl-js/) for more details on how to use these new methods.

### Patch Changes

- Updated dependencies [[`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab), [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab), [`4d3bb084c1442552d6a1de1f53435d1aa3f600b0`](https://github.com/onflow/fcl-js/commit/4d3bb084c1442552d6a1de1f53435d1aa3f600b0)]:
  - @onflow/fcl-core@1.19.0-alpha.0
  - @onflow/sdk@1.9.0-alpha.0

## 1.11.0

### Minor Changes

- [#2384](https://github.com/onflow/fcl-js/pull/2384) [`f86b71357696826a5ad7b8e578de76ecebcd2e29`](https://github.com/onflow/fcl-js/commit/f86b71357696826a5ad7b8e578de76ecebcd2e29) Thanks [@jribbink](https://github.com/jribbink)! - Include origin information in `onMessageFromFcl` function

### Patch Changes

- Updated dependencies [[`f86b71357696826a5ad7b8e578de76ecebcd2e29`](https://github.com/onflow/fcl-js/commit/f86b71357696826a5ad7b8e578de76ecebcd2e29), [`094ed6dd38cae9ae39183f5ead8d59f9276f8f5d`](https://github.com/onflow/fcl-js/commit/094ed6dd38cae9ae39183f5ead8d59f9276f8f5d)]:
  - @onflow/fcl-core@1.18.0
  - @onflow/sdk@1.8.1

## 1.10.1

### Patch Changes

- Updated dependencies [[`ade292589a0355891f8d684103849c52305b2a8b`](https://github.com/onflow/fcl-js/commit/ade292589a0355891f8d684103849c52305b2a8b), [`6c4d6c3df669883e34951bc1d26edb95441f124d`](https://github.com/onflow/fcl-js/commit/6c4d6c3df669883e34951bc1d26edb95441f124d), [`f2721d7fffec1f5b8e0f9faac6b633c6d9b86c01`](https://github.com/onflow/fcl-js/commit/f2721d7fffec1f5b8e0f9faac6b633c6d9b86c01)]:
  - @onflow/fcl-core@1.17.0
  - @onflow/sdk@1.8.0
  - @onflow/config@1.5.2

## 1.10.0

### Minor Changes

- [#2252](https://github.com/onflow/fcl-js/pull/2252) [`329ef42ddafde4c624f71dedf639e38c6ba31714`](https://github.com/onflow/fcl-js/commit/329ef42ddafde4c624f71dedf639e38c6ba31714) Thanks [@jribbink](https://github.com/jribbink)! - Default to soft-finality for all queries (get account, get block, get block header, execute script). Developers can manually override this setting on a per-query basis if required.

  Because developers can now query against un-sealed blocks, it is now recommended to switch to waiting for soft-finality ("executed" status) when awaiting for transaction results whenever possible for significant latency improvements (~2.5x faster).

  This can be done by switching from `fcl.tx(...).onceSealed()` to `fcl.tx(...).onceExecuted()` or updating listeners passed to `fcl.tx(...).subscribe()`.

### Patch Changes

- Updated dependencies [[`329ef42ddafde4c624f71dedf639e38c6ba31714`](https://github.com/onflow/fcl-js/commit/329ef42ddafde4c624f71dedf639e38c6ba31714)]:
  - @onflow/fcl-core@1.16.0
  - @onflow/sdk@1.7.0

## 1.9.16

### Patch Changes

- [#2245](https://github.com/onflow/fcl-js/pull/2245) [`b361069e8b42a4752c2614b1c6908af9749729ac`](https://github.com/onflow/fcl-js/commit/b361069e8b42a4752c2614b1c6908af9749729ac) Thanks [@jribbink](https://github.com/jribbink)! - Fix regression in `account` query at latest block

- Updated dependencies [[`b361069e8b42a4752c2614b1c6908af9749729ac`](https://github.com/onflow/fcl-js/commit/b361069e8b42a4752c2614b1c6908af9749729ac)]:
  - @onflow/fcl-core@1.15.1
  - @onflow/sdk@1.6.1

## 1.9.15

### Patch Changes

- Updated dependencies [[`5b76b111ddb16ed607dc218714fdc51c21fdcdc8`](https://github.com/onflow/fcl-js/commit/5b76b111ddb16ed607dc218714fdc51c21fdcdc8), [`5b76b111ddb16ed607dc218714fdc51c21fdcdc8`](https://github.com/onflow/fcl-js/commit/5b76b111ddb16ed607dc218714fdc51c21fdcdc8), [`5b76b111ddb16ed607dc218714fdc51c21fdcdc8`](https://github.com/onflow/fcl-js/commit/5b76b111ddb16ed607dc218714fdc51c21fdcdc8)]:
  - @onflow/fcl-core@1.15.0
  - @onflow/sdk@1.6.0

## 1.9.14

### Patch Changes

- Updated dependencies [[`ae0ddb755a4c099df1558900192d395543ffccec`](https://github.com/onflow/fcl-js/commit/ae0ddb755a4c099df1558900192d395543ffccec)]:
  - @onflow/sdk@1.5.7
  - @onflow/fcl-core@1.14.1

## 1.9.13

### Patch Changes

- Updated dependencies [[`68cf725a4d618cc963f31a758998ad14a7a43716`](https://github.com/onflow/fcl-js/commit/68cf725a4d618cc963f31a758998ad14a7a43716)]:
  - @onflow/fcl-core@1.14.0

## 1.9.12

### Patch Changes

- Updated dependencies [[`3fccbef7bbf985f19d9a9bae2638e538f126f754`](https://github.com/onflow/fcl-js/commit/3fccbef7bbf985f19d9a9bae2638e538f126f754)]:
  - @onflow/fcl-core@1.13.5

## 1.9.11

### Patch Changes

- Updated dependencies []:
  - @onflow/fcl-core@1.13.4
  - @onflow/sdk@1.5.6

## 1.9.10

### Patch Changes

- Updated dependencies [[`c88f170ab2342f5382dead9a2270e72ce9c6d68a`](https://github.com/onflow/fcl-js/commit/c88f170ab2342f5382dead9a2270e72ce9c6d68a)]:
  - @onflow/fcl-core@1.13.3

## 1.9.9

### Patch Changes

- [#2043](https://github.com/onflow/fcl-js/pull/2043) [`c0fceb12e3108265e4442ad81817a4cb12f79b0f`](https://github.com/onflow/fcl-js/commit/c0fceb12e3108265e4442ad81817a4cb12f79b0f) Thanks [@jribbink](https://github.com/jribbink)! - Export `TransactionError`

- Updated dependencies [[`c0fceb12e3108265e4442ad81817a4cb12f79b0f`](https://github.com/onflow/fcl-js/commit/c0fceb12e3108265e4442ad81817a4cb12f79b0f)]:
  - @onflow/fcl-core@1.13.2

## 1.9.8

### Patch Changes

- [#2039](https://github.com/onflow/fcl-js/pull/2039) [`bc47345ddfc44f0108672f91d8c948eb8e357e3d`](https://github.com/onflow/fcl-js/commit/bc47345ddfc44f0108672f91d8c948eb8e357e3d) Thanks [@jribbink](https://github.com/jribbink)! - Update cross-fetch to v4

- Updated dependencies [[`bc47345ddfc44f0108672f91d8c948eb8e357e3d`](https://github.com/onflow/fcl-js/commit/bc47345ddfc44f0108672f91d8c948eb8e357e3d)]:
  - @onflow/fcl-core@1.13.1
  - @onflow/sdk@1.5.5

## 1.9.7

### Patch Changes

- [#1983](https://github.com/onflow/fcl-js/pull/1983) [`18d24c8bad7efa0d8741d74f0cf299f89b3622c7`](https://github.com/onflow/fcl-js/commit/18d24c8bad7efa0d8741d74f0cf299f89b3622c7) Thanks [@jribbink](https://github.com/jribbink)! - Update dependencies

- [#2001](https://github.com/onflow/fcl-js/pull/2001) [`bac8c54db1b6821a2158923544aa537885d5a0e7`](https://github.com/onflow/fcl-js/commit/bac8c54db1b6821a2158923544aa537885d5a0e7) Thanks [@jribbink](https://github.com/jribbink)! - Pass getStorageProvider to currentUser configuration

- Updated dependencies [[`bac8c54db1b6821a2158923544aa537885d5a0e7`](https://github.com/onflow/fcl-js/commit/bac8c54db1b6821a2158923544aa537885d5a0e7), [`8a5f8e9874980c40c1feb3eac915c6e8570abbf3`](https://github.com/onflow/fcl-js/commit/8a5f8e9874980c40c1feb3eac915c6e8570abbf3), [`3b31f1c02b78bf178502627e5ca1de81bdfe8f26`](https://github.com/onflow/fcl-js/commit/3b31f1c02b78bf178502627e5ca1de81bdfe8f26), [`b7860a388960f3d2220c5f85a820a33e41915f35`](https://github.com/onflow/fcl-js/commit/b7860a388960f3d2220c5f85a820a33e41915f35), [`c14746a9e4dbde10d6204697a68e6f2de6e83dd1`](https://github.com/onflow/fcl-js/commit/c14746a9e4dbde10d6204697a68e6f2de6e83dd1), [`18d24c8bad7efa0d8741d74f0cf299f89b3622c7`](https://github.com/onflow/fcl-js/commit/18d24c8bad7efa0d8741d74f0cf299f89b3622c7), [`b9f49494d5b3faed1bc24005adc6ba312f653a21`](https://github.com/onflow/fcl-js/commit/b9f49494d5b3faed1bc24005adc6ba312f653a21)]:
  - @onflow/fcl-core@1.13.0
  - @onflow/sdk@1.5.4
  - @onflow/util-invariant@1.2.4
  - @onflow/util-template@1.2.3
  - @onflow/util-address@1.2.3
  - @onflow/util-logger@1.3.3
  - @onflow/util-semver@1.0.3
  - @onflow/util-actor@1.3.4
  - @onflow/util-uid@1.2.3
  - @onflow/config@1.5.1
  - @onflow/types@1.4.1
  - @onflow/rlp@1.2.3

## 1.9.7-alpha.6

### Patch Changes

- Updated dependencies [[`b7860a388960f3d2220c5f85a820a33e41915f35`](https://github.com/onflow/fcl-js/commit/b7860a388960f3d2220c5f85a820a33e41915f35)]:
  - @onflow/sdk@1.5.4-alpha.3
  - @onflow/fcl-core@1.13.0-alpha.6

## 1.9.7-alpha.5

### Patch Changes

- Updated dependencies [[`3b31f1c02b78bf178502627e5ca1de81bdfe8f26`](https://github.com/onflow/fcl-js/commit/3b31f1c02b78bf178502627e5ca1de81bdfe8f26)]:
  - @onflow/fcl-core@1.13.0-alpha.5
  - @onflow/sdk@1.5.4-alpha.2

## 1.9.7-alpha.4

### Patch Changes

- [#2001](https://github.com/onflow/fcl-js/pull/2001) [`bac8c54db1b6821a2158923544aa537885d5a0e7`](https://github.com/onflow/fcl-js/commit/bac8c54db1b6821a2158923544aa537885d5a0e7) Thanks [@jribbink](https://github.com/jribbink)! - Pass getStorageProvider to currentUser configuration

- Updated dependencies [[`bac8c54db1b6821a2158923544aa537885d5a0e7`](https://github.com/onflow/fcl-js/commit/bac8c54db1b6821a2158923544aa537885d5a0e7)]:
  - @onflow/fcl-core@1.13.0-alpha.4

## 1.9.7-alpha.3

### Patch Changes

- Updated dependencies [[`c14746a9e4dbde10d6204697a68e6f2de6e83dd1`](https://github.com/onflow/fcl-js/commit/c14746a9e4dbde10d6204697a68e6f2de6e83dd1)]:
  - @onflow/fcl-core@1.13.0-alpha.3

## 1.9.7-alpha.2

### Patch Changes

- Updated dependencies [[`8a5f8e9874980c40c1feb3eac915c6e8570abbf3`](https://github.com/onflow/fcl-js/commit/8a5f8e9874980c40c1feb3eac915c6e8570abbf3)]:
  - @onflow/fcl-core@1.13.0-alpha.2

## 1.9.7-alpha.1

### Patch Changes

- Updated dependencies [[`b9f49494d5b3faed1bc24005adc6ba312f653a21`](https://github.com/onflow/fcl-js/commit/b9f49494d5b3faed1bc24005adc6ba312f653a21)]:
  - @onflow/fcl-core@1.13.0-alpha.1
  - @onflow/sdk@1.5.4-alpha.1

## 1.9.7-alpha.0

### Patch Changes

- [#1983](https://github.com/onflow/fcl-js/pull/1983) [`18d24c8bad7efa0d8741d74f0cf299f89b3622c7`](https://github.com/onflow/fcl-js/commit/18d24c8bad7efa0d8741d74f0cf299f89b3622c7) Thanks [@jribbink](https://github.com/jribbink)! - Update dependencies

- Updated dependencies [[`18d24c8bad7efa0d8741d74f0cf299f89b3622c7`](https://github.com/onflow/fcl-js/commit/18d24c8bad7efa0d8741d74f0cf299f89b3622c7)]:
  - @onflow/util-invariant@1.2.4-alpha.0
  - @onflow/util-template@1.2.3-alpha.0
  - @onflow/util-address@1.2.3-alpha.0
  - @onflow/util-logger@1.3.3-alpha.0
  - @onflow/util-semver@1.0.3-alpha.0
  - @onflow/util-actor@1.3.4-alpha.0
  - @onflow/fcl-core@1.12.1-alpha.0
  - @onflow/util-uid@1.2.3-alpha.0
  - @onflow/config@1.5.1-alpha.0
  - @onflow/types@1.4.1-alpha.0
  - @onflow/rlp@1.2.3-alpha.0
  - @onflow/sdk@1.5.4-alpha.0

## 1.9.6

### Patch Changes

- Updated dependencies [[`f2831107`](https://github.com/onflow/fcl-js/commit/f283110707d5edc166bbe05e5482d38fa29de29e)]:
  - @onflow/fcl-core@1.12.0

## 1.9.5

### Patch Changes

- Updated dependencies []:
  - @onflow/sdk@1.5.3
  - @onflow/fcl-core@1.11.1

## 1.9.4

### Patch Changes

- Updated dependencies [[`e70a215c`](https://github.com/onflow/fcl-js/commit/e70a215c47d7db6f4e1ddab747be3968abc09c05), [`9c787314`](https://github.com/onflow/fcl-js/commit/9c7873140015c9d1e28712aed93c56654f656639), [`266fda58`](https://github.com/onflow/fcl-js/commit/266fda5817900a943925f9a4cbfc69dbcdb98d99), [`e97e8d2f`](https://github.com/onflow/fcl-js/commit/e97e8d2f5197aecf793f26ba82771fd4f7ebc757), [`266fda58`](https://github.com/onflow/fcl-js/commit/266fda5817900a943925f9a4cbfc69dbcdb98d99), [`b8a2a26e`](https://github.com/onflow/fcl-js/commit/b8a2a26e382d543e5058cc1a628b437c3305b13c), [`bc78da0c`](https://github.com/onflow/fcl-js/commit/bc78da0c283ba0fef2680f040eb69b46e8923fa5), [`cd234798`](https://github.com/onflow/fcl-js/commit/cd234798008868df13447ea97654b7e278dd746f), [`6ca1353e`](https://github.com/onflow/fcl-js/commit/6ca1353e2d0c6ad760b7a03da99c8b2b56b48807), [`3a89c39c`](https://github.com/onflow/fcl-js/commit/3a89c39ca5033af6b0ff4e606095507753e17de7), [`c0b3becf`](https://github.com/onflow/fcl-js/commit/c0b3becfcfb284e2182d6b4b6d809ff67406fc24), [`95c63f26`](https://github.com/onflow/fcl-js/commit/95c63f26c5b21787ba9dddc52c7111183b0983ec)]:
  - @onflow/fcl-core@1.11.0
  - @onflow/sdk@1.5.2
  - @onflow/config@1.5.0

## 1.9.4-alpha.4

### Patch Changes

- Updated dependencies [[`cd234798`](https://github.com/onflow/fcl-js/commit/cd234798008868df13447ea97654b7e278dd746f)]:
  - @onflow/config@1.5.0-alpha.0
  - @onflow/fcl-core@1.11.0-alpha.4
  - @onflow/sdk@1.5.2-alpha.3

## 1.9.4-alpha.3

### Patch Changes

- Updated dependencies [[`b8a2a26e`](https://github.com/onflow/fcl-js/commit/b8a2a26e382d543e5058cc1a628b437c3305b13c)]:
  - @onflow/fcl-core@1.11.0-alpha.3

## 1.9.4-alpha.2

### Patch Changes

- Updated dependencies [[`e70a215c`](https://github.com/onflow/fcl-js/commit/e70a215c47d7db6f4e1ddab747be3968abc09c05), [`3a89c39c`](https://github.com/onflow/fcl-js/commit/3a89c39ca5033af6b0ff4e606095507753e17de7), [`95c63f26`](https://github.com/onflow/fcl-js/commit/95c63f26c5b21787ba9dddc52c7111183b0983ec)]:
  - @onflow/fcl-core@1.11.0-alpha.2
  - @onflow/sdk@1.5.2-alpha.2

## 1.9.4-alpha.1

### Patch Changes

- Updated dependencies [[`c0b3becf`](https://github.com/onflow/fcl-js/commit/c0b3becfcfb284e2182d6b4b6d809ff67406fc24)]:
  - @onflow/sdk@1.5.2-alpha.1
  - @onflow/fcl-core@1.11.0-alpha.1

## 1.9.4-alpha.0

### Patch Changes

- Updated dependencies [[`9c787314`](https://github.com/onflow/fcl-js/commit/9c7873140015c9d1e28712aed93c56654f656639), [`266fda58`](https://github.com/onflow/fcl-js/commit/266fda5817900a943925f9a4cbfc69dbcdb98d99), [`266fda58`](https://github.com/onflow/fcl-js/commit/266fda5817900a943925f9a4cbfc69dbcdb98d99), [`bc78da0c`](https://github.com/onflow/fcl-js/commit/bc78da0c283ba0fef2680f040eb69b46e8923fa5), [`6ca1353e`](https://github.com/onflow/fcl-js/commit/6ca1353e2d0c6ad760b7a03da99c8b2b56b48807)]:
  - @onflow/sdk@1.5.2-alpha.0
  - @onflow/fcl-core@1.11.0-alpha.0

## 1.9.3

### Patch Changes

- Updated dependencies [[`5428fca4`](https://github.com/onflow/fcl-js/commit/5428fca4cdc1b37526d429cb646a72bea577a29b)]:
  - @onflow/fcl-core@1.10.0

## 1.9.2

### Patch Changes

- Updated dependencies [[`fe5e1b3d`](https://github.com/onflow/fcl-js/commit/fe5e1b3d330b7734740cceb9a873d1b680f28175), [`38607662`](https://github.com/onflow/fcl-js/commit/38607662dbfc54f268c40488e7a6a89bedd169d8)]:
  - @onflow/util-actor@1.3.3
  - @onflow/fcl-core@1.9.2
  - @onflow/config@1.4.1
  - @onflow/sdk@1.5.1

## 1.9.1

### Patch Changes

- Updated dependencies [[`7ef7edf1`](https://github.com/onflow/fcl-js/commit/7ef7edf1e134041da944f24f49e661caadcc7074), [`6c635f9f`](https://github.com/onflow/fcl-js/commit/6c635f9ff340284845ffe1196965ced7c748294f), [`8fb453b5`](https://github.com/onflow/fcl-js/commit/8fb453b5ff3a00285d91a5432972afbe9e779706), [`ad089fe7`](https://github.com/onflow/fcl-js/commit/ad089fe7556767e1fae96f3f2e98fd76c49bba88)]:
  - @onflow/sdk@1.5.0
  - @onflow/types@1.4.0
  - @onflow/util-invariant@1.2.3
  - @onflow/config@1.4.0
  - @onflow/fcl-core@1.9.1

## 1.9.0

### Minor Changes

- [#1821](https://github.com/onflow/fcl-js/pull/1821) [`b9c078ce`](https://github.com/onflow/fcl-js/commit/b9c078ce87869c2b41dff07b861cea09a294c6a1) Thanks [@nialexsan](https://github.com/nialexsan)! - Split packages into `@onflow/fcl`, `@onflow/fcl-core`, and `@onflow/fcl-react-native`.

- [#1855](https://github.com/onflow/fcl-js/pull/1855) [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88) Thanks [@jribbink](https://github.com/jribbink)! - Add GetNodeVersionInfo SDK Interaction

### Patch Changes

- [#1825](https://github.com/onflow/fcl-js/pull/1825) [`e689325c`](https://github.com/onflow/fcl-js/commit/e689325c579a76c9e76e4bb62f72c40d6ad15bd1) Thanks [@nialexsan](https://github.com/nialexsan)! - bump react native version

- [#1827](https://github.com/onflow/fcl-js/pull/1827) [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a) Thanks [@nialexsan](https://github.com/nialexsan)! - pin versions

- Updated dependencies [[`8ffd3f50`](https://github.com/onflow/fcl-js/commit/8ffd3f5040db314bc1358f05946780af1c03df1a), [`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259), [`7ed491c5`](https://github.com/onflow/fcl-js/commit/7ed491c5d2335fbbff04444d41f1f1580763d8d3), [`45d3c30c`](https://github.com/onflow/fcl-js/commit/45d3c30c8965512dde41f10d1c64c813811c3c0f), [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d), [`b9c078ce`](https://github.com/onflow/fcl-js/commit/b9c078ce87869c2b41dff07b861cea09a294c6a1), [`151a2290`](https://github.com/onflow/fcl-js/commit/151a2290e92fbcb399052476004c7f20ceda5c2d), [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a), [`037dc2f9`](https://github.com/onflow/fcl-js/commit/037dc2f9db9c22185e3c048c65e23e0efa70085f), [`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0), [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88), [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4), [`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0), [`fdd52c45`](https://github.com/onflow/fcl-js/commit/fdd52c45b3a64210c5f716e13aa4d08d3796370c)]:
  - @onflow/fcl-core@1.9.0
  - @onflow/types@1.3.0
  - @onflow/sdk@1.4.0
  - @onflow/util-address@1.2.2
  - @onflow/util-invariant@1.2.2
  - @onflow/util-template@1.2.2
  - @onflow/util-logger@1.3.2
  - @onflow/util-actor@1.3.2
  - @onflow/util-uid@1.2.2
  - @onflow/config@1.3.0
  - @onflow/rlp@1.2.2
  - @onflow/util-semver@1.0.2

## 1.9.0-alpha.11

### Patch Changes

- Updated dependencies [[`7ed491c5`](https://github.com/onflow/fcl-js/commit/7ed491c5d2335fbbff04444d41f1f1580763d8d3)]:
  - @onflow/util-address@1.2.2-alpha.3
  - @onflow/sdk@1.4.0-alpha.9
  - @onflow/fcl-core@1.9.0-alpha.8

## 1.9.0-alpha.10

### Minor Changes

- [#1855](https://github.com/onflow/fcl-js/pull/1855) [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88) Thanks [@jribbink](https://github.com/jribbink)! - Add GetNodeVersionInfo SDK Interaction

### Patch Changes

- Updated dependencies [[`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88)]:
  - @onflow/fcl-core@1.9.0-alpha.7
  - @onflow/sdk@1.4.0-alpha.8

## 1.9.0-alpha.9

### Patch Changes

- Updated dependencies [[`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0), [`b2c73354`](https://github.com/onflow/fcl-js/commit/b2c733545a3904dcff959a2e12b4cf90383bdac0)]:
  - @onflow/sdk@1.4.0-alpha.7
  - @onflow/fcl-core@1.9.0-alpha.6

## 1.9.0-alpha.8

### Patch Changes

- Updated dependencies [[`fdd52c45`](https://github.com/onflow/fcl-js/commit/fdd52c45b3a64210c5f716e13aa4d08d3796370c)]:
  - @onflow/config@1.3.0-alpha.3
  - @onflow/fcl-core@1.9.0-alpha.5
  - @onflow/sdk@1.4.0-alpha.6

## 1.9.0-alpha.7

### Patch Changes

- Updated dependencies [[`8ffd3f50`](https://github.com/onflow/fcl-js/commit/8ffd3f5040db314bc1358f05946780af1c03df1a)]:
  - @onflow/fcl-core@1.9.0-alpha.4

## 1.9.0-alpha.6

### Patch Changes

- Updated dependencies [[`151a2290`](https://github.com/onflow/fcl-js/commit/151a2290e92fbcb399052476004c7f20ceda5c2d)]:
  - @onflow/sdk@1.4.0-alpha.5
  - @onflow/fcl-core@1.8.2-alpha.3

## 1.9.0-alpha.5

### Patch Changes

- Updated dependencies [[`45d3c30c`](https://github.com/onflow/fcl-js/commit/45d3c30c8965512dde41f10d1c64c813811c3c0f)]:
  - @onflow/types@1.3.0-alpha.3
  - @onflow/fcl-core@1.8.2-alpha.2

## 1.9.0-alpha.4

### Patch Changes

- Updated dependencies [[`037dc2f9`](https://github.com/onflow/fcl-js/commit/037dc2f9db9c22185e3c048c65e23e0efa70085f)]:
  - @onflow/fcl-core@1.8.2-alpha.1
  - @onflow/sdk@1.4.0-alpha.4

## 1.9.0-alpha.3

### Patch Changes

- [#1827](https://github.com/onflow/fcl-js/pull/1827) [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a) Thanks [@nialexsan](https://github.com/nialexsan)! - pin versions

- Updated dependencies [[`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a)]:
  - @onflow/util-invariant@1.2.2-alpha.2
  - @onflow/util-template@1.2.2-alpha.2
  - @onflow/util-address@1.2.2-alpha.2
  - @onflow/util-logger@1.3.2-alpha.2
  - @onflow/util-semver@1.0.2-alpha.0
  - @onflow/util-actor@1.3.2-alpha.2
  - @onflow/fcl-core@1.8.2-alpha.0
  - @onflow/util-uid@1.2.2-alpha.2
  - @onflow/config@1.2.2-alpha.2
  - @onflow/types@1.3.0-alpha.2
  - @onflow/rlp@1.2.2-alpha.2
  - @onflow/sdk@1.4.0-alpha.3

## 1.9.0-alpha.2

### Patch Changes

- [#1825](https://github.com/onflow/fcl-js/pull/1825) [`e689325c`](https://github.com/onflow/fcl-js/commit/e689325c579a76c9e76e4bb62f72c40d6ad15bd1) Thanks [@nialexsan](https://github.com/nialexsan)! - bump react native version
