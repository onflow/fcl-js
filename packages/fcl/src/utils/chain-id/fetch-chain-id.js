export async function fetchChainId() {
  const response = await sdk
    .send([sdk.getNetworkParameters()], {enableRequestLogging: false})
    .then(sdk.decode)
  return response.chainId
}
