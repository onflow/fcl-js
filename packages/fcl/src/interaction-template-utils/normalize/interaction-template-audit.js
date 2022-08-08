export function normalizeInteractionTemplateAudit(service) {
    if (service == null) return null

    switch (service["f_vsn"]) {
        case "1.0.0":
            return service

        default:
            throw new Error("normalizeInteractionTemplateAudit Error: Invalid InteractionTemplateAudit")
    }
}
  