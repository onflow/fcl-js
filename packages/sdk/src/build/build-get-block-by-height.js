import {pipe, Ok, makeGetBlockByHeight} from "../interaction/interaction.js"

export function getBlockByHeight(height) {

  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================

    The getBlockByHeight builder has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0003-deprecate-get-block-by-height-builder

    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )

  return pipe([
    makeGetBlockByHeight,
    ix => {
      ix.block.height = height
      return Ok(ix)
    }
  ])
}
