import {resolveCadence} from "./resolve-cadence.js"

export function resolveParams (ix) {
  console.error(
      `
      %cFCL/SDK Deprecation Notice
      ============================

      The resolver sdk.resolveParams is being replaced with the package @onflow/sdk-resolve-cadence
      You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0002-deprecate-resolve-params-resolver

      ============================
    `,
      "font-weight:bold;font-family:monospace;"
    )

  return resolveCadence(ix)
}
