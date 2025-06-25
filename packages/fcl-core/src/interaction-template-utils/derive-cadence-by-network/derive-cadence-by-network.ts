import {invariant} from "@onflow/util-invariant"
import {deriveCadenceByNetwork100} from "./derive-cadence-by-network-1.0.0"
import {deriveCadenceByNetwork110} from "./derive-cadence-by-network-1.1.0"
import type {InteractionTemplate} from "../interaction-template"

export interface DeriveCadenceByNetworkParams {
  network: string
  template: InteractionTemplate
}

/**
 * @description Fills import addresses in Cadence for network
 *
 * @param params
 * @param params.network Network to derive Cadence for
 * @param params.template Interaction Template to derive Cadence from
 * @returns Promise that resolves with the derived Cadence code
 */
export async function deriveCadenceByNetwork({
  network,
  template,
}: DeriveCadenceByNetworkParams): Promise<string> {
  invariant(
    network != undefined,
    "deriveCadenceByNetwork({ network }) -- network must be defined"
  )
  invariant(
    typeof network === "string",
    "deriveCadenceByNetwork({ network }) -- network must be a string"
  )

  invariant(
    template != undefined,
    "deriveCadenceByNetwork({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "deriveCadenceByNetwork({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "deriveCadenceByNetwork({ template }) -- template must be an InteractionTemplate"
  )

  switch (template.f_version) {
    case "1.1.0":
      return await deriveCadenceByNetwork110({network, template})
    case "1.0.0":
      return await deriveCadenceByNetwork100({network, template})
    default:
      throw new Error(
        "deriveCadenceByNetwork Error: Unsupported template version"
      )
  }
}
