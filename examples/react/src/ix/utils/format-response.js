import * as sdk from "@onflow/sdk"

export const formatResponse = response => {
  if (sdk.isNope(response)) console.error(sdk.getError(response))

  return sdk.isOk(response)
    ? sdk.getValue(response)
    : {
        ___: "ERROR",
        reason: sdk.getReason(response),
        error: sdk.getError(response).message,
      }
}
