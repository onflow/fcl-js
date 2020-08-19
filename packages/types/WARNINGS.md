# Warnings

## 0001 [U]Fix64 as Number

- **Date:** August 19 2020
- **Issue:** [#283](https://github.com/onflow/flow-js-sdk/issues/283)
- **Type:** Deprecation of acceping JavaScript numbers as values for Fix64 and UFix64 types.

Fix64 and UFix64 types will no longer accept numbers as values for them in the near future.

Please pass only strings as values for Fix64 and UFix64 types. 
