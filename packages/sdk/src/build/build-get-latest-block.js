import {log} from "@onflow/util-logger"
import {pipe, Ok, makeGetLatestBlock} from "../interaction/interaction.js"

export function getLatestBlock(isSealed = false) {
  log.deprecate({
    pkg: "FCL/SDK",
    subject: "The getLatestBlock builder",
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0006-deprecate-get-latest-block-builder",
  })

  return pipe([
    makeGetLatestBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
