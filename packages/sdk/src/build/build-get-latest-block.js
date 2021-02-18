import {pipe, Ok, makeGetLatestBlock} from "../interaction/interaction.js"

export function getLatestBlock(isSealed = false) {

  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================

    The getLatestBlock builder has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0006-deprecate-get-latest-block-builder

    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )

  return pipe([
    makeGetLatestBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    }
  ])
}
