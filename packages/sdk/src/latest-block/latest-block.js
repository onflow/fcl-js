import {send} from "../send/send.js"
import {getBlock} from "../build/build-get-block"
import {decodeResponse as decode} from "../decode/decode.js"

export function latestBlock(isSealed, opts) {
  console.warn(
    `
      %cFCL/SDK Deprecation Notice
      ============================
  
      "latestBlock()" is deprecated, please use "block()" for this and future versions of FCL
      You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0008-deprecate-latest-block-method
  
      ============================
    `,
      "font-weight:bold;font-family:monospace;"
  ) 

  return send([getBlock(isSealed)], opts).then(decode)
}
