import {Interaction} from "@onflow/typedefs"
import {log} from "@onflow/util-logger"
import {pipe, Ok, makeGetBlock} from "../interaction/interaction"

/**
 * @description - A builder function that returns the interaction to get the latest block
 * @param isSealed - Whether or not the block should be sealed
 * @returns A function that processes an interaction object
 */
export function getLatestBlock(
  isSealed: boolean = false
): (ix: Interaction) => Promise<Interaction> {
  log.deprecate({
    pkg: "FCL/SDK",
    subject: "The getLatestBlock builder",
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0006-deprecate-get-latest-block-builder",
  })

  return pipe([
    makeGetBlock,
    ix => {
      ix.block.isSealed = isSealed
      return Ok(ix)
    },
  ])
}
