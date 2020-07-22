# Warnings

## 0001 Current User Data

- **Date:** July 22nd 2020
- **Issue:** [#180](https://github.com/onflow/flow-js-sdk/issues/180)
- **Type:** Deprecation of Certain Fields on Object

In the case of `userData` in the following:`fcl.currentUser().subscribe(userData)` and `var userData = await fcl.currentUser().snapshot()`, most fields will cease to exist.

Please limit your use of the data within `userData` to `cid` and `loggedIn`.
