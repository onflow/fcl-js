import * as sdk from "@onflow/sdk"

export async function fetchChainId(opts = {}) {
  const response = await sdk
    .send([sdk.getNetworkParameters()], opts)
    .then(sdk.decode)
  return response.chainId
}
