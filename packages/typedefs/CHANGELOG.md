# @onflow/typedefs

## 1.8.0

### Minor Changes

- [#2638](https://github.com/onflow/fcl-js/pull/2638) [`d9d994cdaca8fe82cce0a3bcf48b5b4f7d3dc960`](https://github.com/onflow/fcl-js/commit/d9d994cdaca8fe82cce0a3bcf48b5b4f7d3dc960) Thanks [@jribbink](https://github.com/jribbink)! - Adds support for signature extension data introduced by [FLIP 264](https://github.com/onflow/flips/blob/main/protocol/20250203-webauthn-credential-support.md).

  Users can now include signature extension data in their transactions by returning an additional `extensionData` property in their signing functions.

  ```typescript
  const authz = (ix: Interaction) => {
    return {
      addr: "0x1234567890abcdef",
      keyId: 0,
      signingFunction: (signable: Signable) => ({
        signature: "1234",
        extensionData: "1234",
      }),
    }
  }
  ```

## 1.7.1

### Patch Changes

- [#2634](https://github.com/onflow/fcl-js/pull/2634) [`d5f242b217426f125610f8043aea1a70e143a94a`](https://github.com/onflow/fcl-js/commit/d5f242b217426f125610f8043aea1a70e143a94a) Thanks [@jribbink](https://github.com/jribbink)! - Update dependencies

## 1.7.0

### Minor Changes

- [#2534](https://github.com/onflow/fcl-js/pull/2534) [`8b5086024e0295649bb4266aa0cafbcb2e4171b7`](https://github.com/onflow/fcl-js/commit/8b5086024e0295649bb4266aa0cafbcb2e4171b7) Thanks [@mfbz](https://github.com/mfbz)! - Refactored fcl-core package to TypeScript

- [#2535](https://github.com/onflow/fcl-js/pull/2535) [`e8293cb2c752b340793d2342450a022d79c14edc`](https://github.com/onflow/fcl-js/commit/e8293cb2c752b340793d2342450a022d79c14edc) Thanks [@mfbz](https://github.com/mfbz)! - Refactored fcl package to TypeScript

- [#2536](https://github.com/onflow/fcl-js/pull/2536) [`14ff4a2f04362d7b8a10b444321ffd0c17b20f76`](https://github.com/onflow/fcl-js/commit/14ff4a2f04362d7b8a10b444321ffd0c17b20f76) Thanks [@mfbz](https://github.com/mfbz)! - Refactored fcl-react-native package to TypeScript

## 1.7.0-alpha.0

### Minor Changes

- [#2534](https://github.com/onflow/fcl-js/pull/2534) [`8b5086024e0295649bb4266aa0cafbcb2e4171b7`](https://github.com/onflow/fcl-js/commit/8b5086024e0295649bb4266aa0cafbcb2e4171b7) Thanks [@mfbz](https://github.com/mfbz)! - Refactored fcl-core package to TypeScript

- [#2535](https://github.com/onflow/fcl-js/pull/2535) [`e8293cb2c752b340793d2342450a022d79c14edc`](https://github.com/onflow/fcl-js/commit/e8293cb2c752b340793d2342450a022d79c14edc) Thanks [@mfbz](https://github.com/mfbz)! - Refactored fcl package to TypeScript

- [#2536](https://github.com/onflow/fcl-js/pull/2536) [`14ff4a2f04362d7b8a10b444321ffd0c17b20f76`](https://github.com/onflow/fcl-js/commit/14ff4a2f04362d7b8a10b444321ffd0c17b20f76) Thanks [@mfbz](https://github.com/mfbz)! - Refactored fcl-react-native package to TypeScript

## 1.6.0

### Minor Changes

- [#2201](https://github.com/onflow/fcl-js/pull/2201) [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab) Thanks [@jribbink](https://github.com/jribbink)! - Add typedefs for streaming API

- [#2352](https://github.com/onflow/fcl-js/pull/2352) [`4d3bb084c1442552d6a1de1f53435d1aa3f600b0`](https://github.com/onflow/fcl-js/commit/4d3bb084c1442552d6a1de1f53435d1aa3f600b0) Thanks [@mfbz](https://github.com/mfbz)! - Refactored onflow/sdk package to improve TypeScript support

## 1.6.0-alpha.0

### Minor Changes

- [#2201](https://github.com/onflow/fcl-js/pull/2201) [`b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab`](https://github.com/onflow/fcl-js/commit/b9c4ed3b95c2dc73698e45f353a6ef9a48f23cab) Thanks [@jribbink](https://github.com/jribbink)! - Add typedefs for streaming API

- [#2352](https://github.com/onflow/fcl-js/pull/2352) [`4d3bb084c1442552d6a1de1f53435d1aa3f600b0`](https://github.com/onflow/fcl-js/commit/4d3bb084c1442552d6a1de1f53435d1aa3f600b0) Thanks [@mfbz](https://github.com/mfbz)! - Refactored onflow/sdk package to improve TypeScript support

## 1.5.0

### Minor Changes

- [#2393](https://github.com/onflow/fcl-js/pull/2393) [`e10f1db63a8a9cc86a56e312d7d7e3a2089d4a3a`](https://github.com/onflow/fcl-js/commit/e10f1db63a8a9cc86a56e312d7d7e3a2089d4a3a) Thanks [@mfbz](https://github.com/mfbz)! - Changed typedefs types to interfaces for code standardization

## 1.4.1

### Patch Changes

- [#2216](https://github.com/onflow/fcl-js/pull/2216) [`ae0ddb755a4c099df1558900192d395543ffccec`](https://github.com/onflow/fcl-js/commit/ae0ddb755a4c099df1558900192d395543ffccec) Thanks [@jribbink](https://github.com/jribbink)! - Expose all available arguments to `EventFilter` type (`startBlockId`, `startBlockHeight`, `heartbeatInterval`)

## 1.4.0

### Minor Changes

- [#1893](https://github.com/onflow/fcl-js/pull/1893) [`b9f49494d5b3faed1bc24005adc6ba312f653a21`](https://github.com/onflow/fcl-js/commit/b9f49494d5b3faed1bc24005adc6ba312f653a21) Thanks [@jribbink](https://github.com/jribbink)! - Add missing field to TransactionStatus type

- [#1893](https://github.com/onflow/fcl-js/pull/1893) [`b9f49494d5b3faed1bc24005adc6ba312f653a21`](https://github.com/onflow/fcl-js/commit/b9f49494d5b3faed1bc24005adc6ba312f653a21) Thanks [@jribbink](https://github.com/jribbink)! - Add FvmErrorCode enum for categorizing transaction/script execution errors

- [#1981](https://github.com/onflow/fcl-js/pull/1981) [`dda32df052801ee5e70b703a19c246f36bbd31c2`](https://github.com/onflow/fcl-js/commit/dda32df052801ee5e70b703a19c246f36bbd31c2) Thanks [@jribbink](https://github.com/jribbink)! - Add missing fields to Provider type

### Patch Changes

- [#1970](https://github.com/onflow/fcl-js/pull/1970) [`3b31f1c02b78bf178502627e5ca1de81bdfe8f26`](https://github.com/onflow/fcl-js/commit/3b31f1c02b78bf178502627e5ca1de81bdfe8f26) Thanks [@jribbink](https://github.com/jribbink)! - Fix CurrentUser services type

- [#1983](https://github.com/onflow/fcl-js/pull/1983) [`18d24c8bad7efa0d8741d74f0cf299f89b3622c7`](https://github.com/onflow/fcl-js/commit/18d24c8bad7efa0d8741d74f0cf299f89b3622c7) Thanks [@jribbink](https://github.com/jribbink)! - Update dependencies

## 1.4.0-alpha.2

### Patch Changes

- [#1970](https://github.com/onflow/fcl-js/pull/1970) [`3b31f1c02b78bf178502627e5ca1de81bdfe8f26`](https://github.com/onflow/fcl-js/commit/3b31f1c02b78bf178502627e5ca1de81bdfe8f26) Thanks [@jribbink](https://github.com/jribbink)! - Fix CurrentUser services type

## 1.4.0-alpha.1

### Minor Changes

- [#1893](https://github.com/onflow/fcl-js/pull/1893) [`b9f49494d5b3faed1bc24005adc6ba312f653a21`](https://github.com/onflow/fcl-js/commit/b9f49494d5b3faed1bc24005adc6ba312f653a21) Thanks [@jribbink](https://github.com/jribbink)! - Add missing field to TransactionStatus type

- [#1893](https://github.com/onflow/fcl-js/pull/1893) [`b9f49494d5b3faed1bc24005adc6ba312f653a21`](https://github.com/onflow/fcl-js/commit/b9f49494d5b3faed1bc24005adc6ba312f653a21) Thanks [@jribbink](https://github.com/jribbink)! - Add FvmErrorCode enum for categorizing transaction/script execution errors

## 1.4.0-alpha.0

### Minor Changes

- [#1981](https://github.com/onflow/fcl-js/pull/1981) [`dda32df052801ee5e70b703a19c246f36bbd31c2`](https://github.com/onflow/fcl-js/commit/dda32df052801ee5e70b703a19c246f36bbd31c2) Thanks [@jribbink](https://github.com/jribbink)! - Add missing fields to Provider type

### Patch Changes

- [#1983](https://github.com/onflow/fcl-js/pull/1983) [`18d24c8bad7efa0d8741d74f0cf299f89b3622c7`](https://github.com/onflow/fcl-js/commit/18d24c8bad7efa0d8741d74f0cf299f89b3622c7) Thanks [@jribbink](https://github.com/jribbink)! - Update dependencies

## 1.3.1

### Patch Changes

- [#1918](https://github.com/onflow/fcl-js/pull/1918) [`bc78da0c`](https://github.com/onflow/fcl-js/commit/bc78da0c283ba0fef2680f040eb69b46e8923fa5) Thanks [@jribbink](https://github.com/jribbink)! - Miscellaneous TypeScript fixes

## 1.3.1-alpha.0

### Patch Changes

- [#1918](https://github.com/onflow/fcl-js/pull/1918) [`bc78da0c`](https://github.com/onflow/fcl-js/commit/bc78da0c283ba0fef2680f040eb69b46e8923fa5) Thanks [@jribbink](https://github.com/jribbink)! - Miscellaneous TypeScript fixes

## 1.3.0

### Minor Changes

- [#1802](https://github.com/onflow/fcl-js/pull/1802) [`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259) Thanks [@nialexsan](https://github.com/nialexsan)! - Typescript improvements

- [#1855](https://github.com/onflow/fcl-js/pull/1855) [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88) Thanks [@jribbink](https://github.com/jribbink)! - Add GetNodeVersionInfo SDK Interaction

- [#1794](https://github.com/onflow/fcl-js/pull/1794) [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d) Thanks [@jribbink](https://github.com/jribbink)! - Add types for general stream connections & event streaming API

### Patch Changes

- [#1859](https://github.com/onflow/fcl-js/pull/1859) [`7ed491c5`](https://github.com/onflow/fcl-js/commit/7ed491c5d2335fbbff04444d41f1f1580763d8d3) Thanks [@jribbink](https://github.com/jribbink)! - TypeScript Fixes

- [#1821](https://github.com/onflow/fcl-js/pull/1821) [`b9c078ce`](https://github.com/onflow/fcl-js/commit/b9c078ce87869c2b41dff07b861cea09a294c6a1) Thanks [@nialexsan](https://github.com/nialexsan)! - Split packages into `@onflow/fcl`, `@onflow/fcl-core`, and `@onflow/fcl-react-native`.

- [#1827](https://github.com/onflow/fcl-js/pull/1827) [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a) Thanks [@nialexsan](https://github.com/nialexsan)! - Pin internal dependencies to exact versions

- [#1814](https://github.com/onflow/fcl-js/pull/1814) [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4) Thanks [@jribbink](https://github.com/jribbink)! - Fix type declarations not fully being generated

## 1.3.0-alpha.4

### Patch Changes

- [#1859](https://github.com/onflow/fcl-js/pull/1859) [`7ed491c5`](https://github.com/onflow/fcl-js/commit/7ed491c5d2335fbbff04444d41f1f1580763d8d3) Thanks [@jribbink](https://github.com/jribbink)! - TypeScript Fixes

## 1.3.0-alpha.3

### Minor Changes

- [#1855](https://github.com/onflow/fcl-js/pull/1855) [`80db8166`](https://github.com/onflow/fcl-js/commit/80db816620d7643c35a0fca7149c15de92f7bc88) Thanks [@jribbink](https://github.com/jribbink)! - Add GetNodeVersionInfo SDK Interaction

## 1.3.0-alpha.2

### Patch Changes

- [#1827](https://github.com/onflow/fcl-js/pull/1827) [`e74c4a60`](https://github.com/onflow/fcl-js/commit/e74c4a60f38f366874aa1391ca1c890a7ad3a42a) Thanks [@nialexsan](https://github.com/nialexsan)! - pin versions

## 1.3.0-alpha.1

### Minor Changes

- [#1802](https://github.com/onflow/fcl-js/pull/1802) [`699303cf`](https://github.com/onflow/fcl-js/commit/699303cfd5e0545267632c9236f8c91833ce1259) Thanks [@nialexsan](https://github.com/nialexsan)! - TS conversion

- [#1794](https://github.com/onflow/fcl-js/pull/1794) [`acf90a78`](https://github.com/onflow/fcl-js/commit/acf90a7841f843227d5d9edb450ef08322c77c4d) Thanks [@jribbink](https://github.com/jribbink)! - Add types for general stream connections & event streaming API

### Patch Changes

- [#1814](https://github.com/onflow/fcl-js/pull/1814) [`0d09d838`](https://github.com/onflow/fcl-js/commit/0d09d8386c2fc472833df7152467d477f36dddc4) Thanks [@jribbink](https://github.com/jribbink)! - Fix type declarations not fully being generated

## 1.2.1

### Patch Changes

- [#1807](https://github.com/onflow/fcl-js/pull/1807) [`9430d723`](https://github.com/onflow/fcl-js/commit/9430d7232c272f4acb55f5bcff7be82cef9704d9) Thanks [@jribbink](https://github.com/jribbink)! - Fix versioning & actor bug

## 1.2.0

### Minor Changes

- [#1801](https://github.com/onflow/fcl-js/pull/1801) [`8881394b`](https://github.com/onflow/fcl-js/commit/8881394bc11fea507e330a4c507ef304fe456c42) Thanks [@nialexsan](https://github.com/nialexsan)! - TS build

## 1.1.1

### Patch Changes

- [#1666](https://github.com/onflow/fcl-js/pull/1666) [`090963f3`](https://github.com/onflow/fcl-js/commit/090963f3ff6d4557f90a451a1ff5a723656f87dd) Thanks [@nialexsan](https://github.com/nialexsan)! - React Native support

- [#1724](https://github.com/onflow/fcl-js/pull/1724) [`f3f0288a`](https://github.com/onflow/fcl-js/commit/f3f0288a9ba7a363140c2eb92c84483c4719684a) Thanks [@jribbink](https://github.com/jribbink)! - Fix statusString typedef

## 1.1.1-alpha.1

### Patch Changes

- [#1724](https://github.com/onflow/fcl-js/pull/1724) [`f3f0288a`](https://github.com/onflow/fcl-js/commit/f3f0288a9ba7a363140c2eb92c84483c4719684a) Thanks [@jribbink](https://github.com/jribbink)! - Fix statusString typedef

## 1.1.1-alpha.0

### Patch Changes

- [#1666](https://github.com/onflow/fcl-js/pull/1666) [`090963f3`](https://github.com/onflow/fcl-js/commit/090963f3ff6d4557f90a451a1ff5a723656f87dd) Thanks [@nialexsan](https://github.com/nialexsan)! - React Native support

## 1.1.0

### Minor Changes

- [#1639](https://github.com/onflow/fcl-js/pull/1639) [`434c2f48`](https://github.com/onflow/fcl-js/commit/434c2f4887c7d8fd0101ff79cc901d0c66795065) Thanks [@chasefleming](https://github.com/chasefleming)! - Add types for fcl.tx

- [#1591](https://github.com/onflow/fcl-js/pull/1591) [`7b122a49`](https://github.com/onflow/fcl-js/commit/7b122a49b47b2f261e67d4b08d0d8d32d35d3a72) Thanks [@chasefleming](https://github.com/chasefleming)! - Create typedefs package for JSDoc typedefs and TypeScript types

### Patch Changes

- [#1658](https://github.com/onflow/fcl-js/pull/1658) [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106) Thanks [@nialexsan](https://github.com/nialexsan)! - Align jest version

- [#1644](https://github.com/onflow/fcl-js/pull/1644) [`a669ea39`](https://github.com/onflow/fcl-js/commit/a669ea39570044f692d064af7d4c7e7fff766ccb) Thanks [@nialexsan](https://github.com/nialexsan)! - fixed signUserMessage return type

## 1.1.0-alpha.6

### Patch Changes

- [#1658](https://github.com/onflow/fcl-js/pull/1658) [`2512b5c5`](https://github.com/onflow/fcl-js/commit/2512b5c53dff708fca97cd8afdbb1f4a46b2f106) Thanks [@nialexsan](https://github.com/nialexsan)! - Align jest version

## 1.1.0-alpha.5

### Minor Changes

- [#1639](https://github.com/onflow/fcl-js/pull/1639) [`434c2f48`](https://github.com/onflow/fcl-js/commit/434c2f4887c7d8fd0101ff79cc901d0c66795065) Thanks [@chasefleming](https://github.com/chasefleming)! - Add types for fcl.tx

### Patch Changes

- [#1644](https://github.com/onflow/fcl-js/pull/1644) [`a669ea39`](https://github.com/onflow/fcl-js/commit/a669ea39570044f692d064af7d4c7e7fff766ccb) Thanks [@nialexsan](https://github.com/nialexsan)! - fixed signUserMessage return type

## 1.1.0-alpha.4

### Minor Changes

- [#1591](https://github.com/onflow/fcl-js/pull/1591) [`7b122a49`](https://github.com/onflow/fcl-js/commit/7b122a49b47b2f261e67d4b08d0d8d32d35d3a72) Thanks [@chasefleming](https://github.com/chasefleming)! - Create typedefs package for JSDoc typedefs and TypeScript types

## 1.1.0-alpha.3
