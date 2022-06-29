import { encode as rlpEncode } from "@onflow/rlp"
import {genHash} from "./utils/hash.js"

export async function generateTemplateAuditId({
    audit,
}) {
    invariant(template != undefined, "audit must be defined")
    invariant(typeof template === "object", "audit must be an object")
    invariant(typeof template.f_type === "InteractionTemplateAudit", "Object must be an InteractionTemplate")

    const auditData = audit.data

    const encodedHex = rlpEncode([
        auditData.id,
        auditData.signer.account,
        auditData.signer.key_id,
        auditData.signer.signature,
    ]).toString("hex")

    return genHash(encodedHex)
}