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
 * @description Returns whether a set of auditors have audited a given Interaction Template
 *
 * @param {GetInteractionTemplateAuditsParams} opts
 * @param {InteractionTemplate} opts.template Interaction Template to check audits for
 * @param {string[]} opts.auditors [auditors=undefined] Auditors to check
 * @param {GetInteractionTemplateAuditsOpts} opts
 * @returns {Promise<Record<string, boolean>>} Whether the template has been audited by the auditors
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
