# Warnings

## 0001 Deprecating latestBlock field

- **Date:** August 25th 2020
- **Issue:** [#300](https://github.com/onflow/flow-js-sdk/issues/300)
- **Type:** Deprecation of `latestBlock` field on interaction object.
  
New interaction types have been included for use throughout the Flow JS-SDK. These include GetBlockByHeight and GetBlockById. To generalize how data for each interaction type is included in the interaction object, a new field `block` with subfields for each specific get block interaction type was added.

Please refrain from setting data inside the `latestBlock` field. Operations that depend on data set to `latestBlock` will cease to work in the future.
