import { encode as rlpEncode } from "@onflow/rlp"
import {genHash} from "./utils/hash.js"
import { normalizeInteractionTemplateAudit } from "./normalize/interaction-template-audit.js"

export async function generateTemplateAuditId({
    audit,
}) {
    invariant(audit != undefined, "generateTemplateAuditId({ audit }) -- audit must be defined")
    invariant(typeof audit === "object", "generateTemplateAuditId({ audit }) -- audit must be an object")
    invariant(typeof audit.f_type === "InteractionTemplateAudit", "generateTemplateAuditId({ audit }) -- audit object must be an InteractionTemplate")

    audit = normalizeInteractionTemplateAudit(audit)

    switch(audit.f_vsn) {
        case("1.0.0"):
            const auditData = audit.data

            const encodedHex = rlpEncode([
                await genHash(auditData.id),
                await genHash(auditData.signer.account),
                await genHash(String(auditData.signer.key_id)),
                await genHash(auditData.signer.signature),
            ]).toString("hex")
        
            return genHash(encodedHex)

        default:
            throw new Error("generateTemplateAuditId Error: Unsupported audit version")
    }
}