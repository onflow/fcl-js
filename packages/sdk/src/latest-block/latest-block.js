import {send} from "../send/send.js"
import {getBlock} from "../build/build-get-block"
import {decodeResponse as decode} from "../decode/decode.js"

export function latestBlock(...args) {
  let opts = args[1] || (typeof args[0] === "object" ? args[0] : undefined)
  let isSealed = typeof args[0] === "boolean" ? args[0] : undefined

  if (typeof args[0] === "object") {
    console.warn(
      `
      %cFCL/SDK Deprecation Notice
      ============================
  
      Passing options as the first arguement to the latestBlock function has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.
      You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0007-deprecate-opts-first-arg-latest-block
  
      ============================
    `,
      "font-weight:bold;font-family:monospace;"
    )
  }

  return send([getBlock(isSealed)], opts).then(decode)
}
