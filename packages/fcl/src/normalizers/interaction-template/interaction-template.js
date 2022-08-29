export function normalizeInteractionTemplate(template) {
  if (template == null) return null

  switch (template["f_version"]) {
    case "1.0.0":
      return template

    default:
      throw new Error(
        "normalizeInteractionTemplate Error: Invalid InteractionTemplate"
      )
  }
}
