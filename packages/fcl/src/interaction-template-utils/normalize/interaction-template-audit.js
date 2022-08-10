export function normalizeInteractionTemplateAudit(audit) {
  if (audit == null) return null

  switch (audit["f_version"]) {
    case "1.0.0":
      return audit

    default:
      throw new Error(
        "normalizeInteractionTemplateAudit Error: Invalid InteractionTemplateAudit"
      )
  }
}
