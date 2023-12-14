import {normalize as normalize100to110} from "./interaction-template-interface-1.0.0-1.1.1"

export async function normalizeInteractionTemplateInterface(templateInterface) {
  if (templateInterface == null) return null

  switch (templateInterface["f_version"]) {
    case "1.1.0":
      return templateInterface
    case "1.0.0":
      return await normalizeInteractionTemplate(
        await normalize100to110({templateInterface})
      )
    default:
      throw new Error(
        "normalizeInteractionTemplateInterface Error: Invalid InteractionTemplateInterface"
      )
  }
}
