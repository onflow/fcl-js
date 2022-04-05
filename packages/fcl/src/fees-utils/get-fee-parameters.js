import { send as sdkSend, decode as sdkDecode, script, config } from "@onflow/sdk"

const getFlowFeesAddress = async () => 
  (await config.get("env")) === "testnet"
    ? "0x912d5440f7e3769e"
    : "0xf919ee77447b7497"

const prepareGetFlowFeeParametersScript = async () => {
    const flowFeesAddress = await getFlowFeesAddress()

    return `
      import FlowFees from ${flowFeesAddress}

      pub fun main(): FlowFees.FeeParameters {
        return FlowFees.getFeeParameters()
      }
    `
}

export const getFeeParameters = async (opts) => {
  const send = opts?.send || sdkSend
  const decode = opts?.decode || sdkDecode

  return send([
      script((await prepareGetFlowFeeParametersScript()))
  ]).then(decode)
}
