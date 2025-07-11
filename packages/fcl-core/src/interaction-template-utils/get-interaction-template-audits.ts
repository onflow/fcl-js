import {config, invariant} from "@onflow/sdk"
import {log, LEVELS} from "@onflow/util-logger"
import {query} from "../exec/query"
import {generateTemplateId} from "./generate-template-id/generate-template-id"
import {getChainId} from "../utils"
import type {InteractionTemplate} from "./interaction-template"

export interface GetInteractionTemplateAuditsParams {
  template: InteractionTemplate
  auditors?: string[]
}

export interface GetInteractionTemplateAuditsOpts {
  flowInteractionAuditContract?: string
}

/**
 * @description Checks whether a set of auditors have audited a given Interaction Template on the Flow
 * blockchain. This function validates that the provided interaction template has been properly audited
 * for security by trusted auditors before execution. It queries the Flow blockchain's audit contract
 * to verify audit status.
 *
 * @param params
 * @param params.template The Interaction Template to check audits for. Must be
 * a valid InteractionTemplate object with f_type "InteractionTemplate"
 * @param params.auditors Array of auditor addresses to check. If not provided, will use
 * auditors from configuration 'flow.auditors'
 * @param opts Optional configuration parameters
 * @param opts.flowInteractionAuditContract Override address for the FlowInteractionAudit
 * contract if not using network defaults
 *
 * @returns Promise that resolves to an object mapping auditor
 * addresses to boolean values indicating whether they have audited the template
 *
 * @throws If template is invalid, template ID cannot be recomputed, network is unsupported,
 * or required configuration is missing
 *
 * @example
 * // Check if template has been audited by specific auditors
 * import * as fcl from "@onflow/fcl"
 *
 * const template = {
 *   f_type: "InteractionTemplate",
 *   f_version: "1.1.0",
 *   id: "template-id-123",
 *   data: {
 *     type: "transaction",
 *     interface: "...",
 *     cadence: "transaction { ... }"
 *   }
 * }
 *
 * const auditorAddresses = [
 *   "0x1234567890abcdef",
 *   "0xabcdef1234567890"
 * ]
 *
 * const auditResults = await fcl.InteractionTemplateUtils.getInteractionTemplateAudits({
 *   template,
 *   auditors: auditorAddresses
 * })
 *
 * console.log(auditResults)
 * // { "0x1234567890abcdef": true, "0xabcdef1234567890": false }
 */
export async function getInteractionTemplateAudits(
  {template, auditors}: GetInteractionTemplateAuditsParams,
  opts: GetInteractionTemplateAuditsOpts = {}
): Promise<Record<string, boolean>> {
  invariant(
    template != undefined,
    "getInteractionTemplateAudits({ template }) -- template must be defined"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "getInteractionTemplateAudits({ template }) -- template must be an InteractionTemplate"
  )

  // Recompute ID to be sure it matches
  let recomputedTemplateID = await generateTemplateId({template})

  if (recomputedTemplateID !== template.id) {
    log({
      title: "getInteractionTemplateAudits Debug Error",
      message: `Could not recompute and match template ID
                computed: ${recomputedTemplateID}
                template: ${template.id}
            `,
      level: LEVELS.debug,
    })
    throw new Error(
      "getInteractionTemplateAudits Error: Could not recompute and match template ID"
    )
  }

  switch (template.f_version) {
    case "1.1.0":
    case "1.0.0":
      const _auditors = auditors || (await config().get("flow.auditors"))

      invariant(
        _auditors,
        "getInteractionTemplateAudits Error: Required configuration for 'fcl.auditors' is not set"
      )
      invariant(
        Array.isArray(_auditors),
        "getInteractionTemplateAudits Error: Required configuration for 'fcl.auditors' is not an array"
      )

      let FlowInteractionAuditContract = opts.flowInteractionAuditContract
      if (!FlowInteractionAuditContract) {
        const fclNetwork = await getChainId(opts)
        invariant(
          fclNetwork === "mainnet" || fclNetwork === "testnet",
          "getInteractionTemplateAudits Error: Unable to determine address for FlowInteractionTemplateAudit contract. Set configuration for 'fcl.network' to 'mainnet' or 'testnet'"
        )
        if (fclNetwork === "mainnet") {
          FlowInteractionAuditContract = "0xfd100e39d50a13e6"
        } else {
          FlowInteractionAuditContract = "0xf78bfc12d0a786dc"
        }
      }

      const audits = await query({
        cadence: `
        import FlowInteractionTemplateAudit from ${FlowInteractionAuditContract}
        access(all) fun main(templateId: String, auditors: [Address]): {Address:Bool} {
          return FlowInteractionTemplateAudit.getHasTemplateBeenAuditedByAuditors(templateId: templateId, auditors: auditors)
        }
        `,
        args: (arg: any, t: any) => [
          arg(recomputedTemplateID, t.String),
          arg(_auditors, t.Array(t.Address)),
        ],
      })

      return audits

    default:
      throw new Error(
        "getInteractionTemplateAudits Error: Unsupported template version"
      )
  }
}
