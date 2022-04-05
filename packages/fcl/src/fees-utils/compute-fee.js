import { send as sdkSend, decode as sdkDecode, script, args, arg, config } from "@onflow/sdk"
import * as types from "@onflow/types"
import { invariant } from "@onflow/util-invariant"
import {isRequired, isObject} from "../exec/utils/is"

const getFlowFeesAddress = async () => 
  (await config.get("env")) === "testnet"
    ? "0x912d5440f7e3769e"
    : "0xf919ee77447b7497"

const prepareComputeFeesScript = async () => {
    const flowFeesAddress = await getFlowFeesAddress()

    return `
      import FlowFees from ${flowFeesAddress}

      pub fun main(
        inclusionEffort: UFix64, 
        executionEffort: UFix64
      ): UFix64 {
        return FlowFees.computeFees(inclusionEffort: inclusionEffort, executionEffort: executionEffort)
      }
    `
}

export const computeFee = async (opts) => {
  invariant(isRequired(opts), "computeFees(opts) -- opts is required")
  invariant(isObject(opts), "computeFees(opts) -- opts must be an object")
  invariant(isRequired(opts?.inclusionEffort), "computeFees({ inclusionEffort }) -- inclusionEffort is required")
  invariant(isRequired(opts?.executionEffort), "computeFees({ executionEffort }) -- executionEffort is required")

  const { inclusionEffort, executionEffort } = opts

  const send = opts?.send || sdkSend
  const decode = opts?.decode || sdkDecode

  return send([
      script((await prepareComputeFeesScript())),
      args([ arg(inclusionEffort, types.UFix64), arg(executionEffort, types.UFix64) ])
  ]).then(decode)
}
