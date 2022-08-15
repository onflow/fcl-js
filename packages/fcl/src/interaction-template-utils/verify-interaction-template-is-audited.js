import {config, invariant} from "@onflow/sdk"
import {log, LEVELS} from "@onflow/util-logger"
import {query} from "../exec/query.js"
import {generateTemplateId} from "./generate-template-id.js"
import {normalizeInteractionTemplate} from "./normalize/interaction-template.js"

export async function verifyInteractionTemplateIsAudited({template, auditors}) {
  invariant(
    template != undefined,
    "verifyInteractionTemplateIsAudited({ template }) -- template must be defined"
  )

  template = normalizeInteractionTemplate(template)

  invariant(
    template.f_type === "InteractionTemplate",
    "verifyInteractionTemplateIsAudited({ template }) -- template must be an InteractionTemplate"
  )

  // Recompute ID to be sure it matches
  let recomputedTemplateID = await generateTemplateId({template})

  if (recomputedTemplateID !== template.id) {
    log({
      title: "verifyInteractionTemplateAudit Debug Error",
      message: `Could not recompute and match template ID
                computed: ${recomputedTemplateID}
                template: ${template.id}
            `,
      level: LEVELS.debug,
    })
    return false
  }

  switch (template.f_version) {
    case "1.0.0":
      const _auditors = auditors || (await config().get("fcl.auditors", []))

      invariant(
        _auditors,
        "verifyInteractionTemplateIsAudited Error: Required configuration for 'fcl.auditors' is not set"
      )
      invariant(
        Array.isArray(_auditors),
        "verifyInteractionTemplateIsAudited Error: Required configuration for 'fcl.auditors' is not an array"
      )

      let FlowInteractionAuditContract = await config().get(
        "0xFlowInteractionAudit"
      )

      if (!FlowInteractionAuditContract) {
        const fclNetwork = await config().get("flow.network")
        invariant(
          fclNetwork === "mainnet" || fclNetwork === "testnet",
          "verifyInteractionTemplateIsAudited Error: Unable to set address for placeholder '0xFlowInteractionAudit'. Either set the address for placeholder '0xFlowInteractionAudit' manually in config, or set configuration for 'fcl.network' to 'mainnet' or 'testnet'"
        )
        if (fclNetwork === "mainnet") {
          FlowInteractionAuditContract = ""
        } else {
          FlowInteractionAuditContract = "0xf8a5da6d9710021a"
        }
      }

      const audits = await config.overload(
        {
          "0xFlowInteractionAudit": FlowInteractionAuditContract,
        },
        async () =>
          query({
            cadence: `
            import FlowInteractionAudit from 0xFlowInteractionAudit
            pub fun main(templateId: String, auditors: [Address]): {Address:Bool} {
              return FlowInteractionAudit.getHasAuditedTemplateByAuditors(templateId: templateId, auditors: auditors)
            }
            `,
            args: (arg, t) => [
              arg(recomputedTemplateID, t.String),
              arg(_auditors, t.Array(t.Address)),
            ],
          })
      )

      return Boolean(Object.values(audits).find(a => a === true))

    default:
      throw new Error(
        "verifyInteractionTemplateIsAudited Error: Unsupported template version"
      )
  }
}
