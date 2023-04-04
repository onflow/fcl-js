import {normalize as normalize100to110} from "./interaction-template-1.0.0-1.1.0"

export async function normalizeInteractionTemplate(template) {
  if (template == null) return null

  switch (template["f_version"]) {
    case "1.1.0":
      return template
    case "1.0.0":
      return await normalizeInteractionTemplate(
        await normalize100to110({template})
      )
    default:
      throw new Error(
        "normalizeInteractionTemplate Error: Invalid InteractionTemplate"
      )
  }
}
