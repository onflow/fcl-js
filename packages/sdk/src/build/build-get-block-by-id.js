import {pipe, Ok, makeGetBlockById} from "../interaction/interaction.js"

export function getBlockById(id) {

  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================

    The getBlockById builder has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0004-deprecate-get-block-by-id-builder

    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )

  return pipe([
    makeGetBlockById,
    ix => {
      ix.block.ids = [id]
      return Ok(ix)
    }
  ])
}
