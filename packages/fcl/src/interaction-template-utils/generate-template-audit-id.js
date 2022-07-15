import { encode as rlpEncode } from "@onflow/rlp"
import {genHash} from "./utils/hash.js"

export async function generateTemplateAuditId({
    audit,
}) {
    invariant(template != undefined, "generateTemplateAuditId({ audit }) -- audit must be defined")
    invariant(typeof template === "object", "generateTemplateAuditId({ audit }) -- audit must be an object")
    invariant(typeof template.f_type === "InteractionTemplateAudit", "generateTemplateAuditId({ audit }) -- audit object must be an InteractionTemplate")

    const auditData = audit.data

    const encodedHex = rlpEncode([
        await genHash(auditData.id),
        await genHash(auditData.signer.account),
        await genHash(String(auditData.signer.key_id)),
        await genHash(auditData.signer.signature),
    ]).toString("hex")

    return genHash(encodedHex)
}