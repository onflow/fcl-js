export function normalizeInteractionTemplate(template) {
    if (template == null) return null

    switch (template["f_vsn"]) {
        case "1.0.0":
            return template

        default:
            throw new Error("normalizeInteractionTemplate Error: Invalid InteractionTemplate")
    }
}
  