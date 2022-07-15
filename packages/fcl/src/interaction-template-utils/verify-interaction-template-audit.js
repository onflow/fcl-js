import {account, invariant} from "@onflow/sdk"
import {log} from "@onflow/util-logger"
import { query } from "../exec/query.js"
import {genHash} from "./utils/hash.js"
import {generateTemplateId} from "./generate-template-id.js"

const getAccountKeys = async (address) => {
    return query({
        cadence: `
        pub struct _PublicKey {
          pub var signatureAlgorithm: SignatureAlgorithm
          pub var publicKey: String
          
          init(pubKey: PublicKey) {
            self.signatureAlgorithm = pubKey.signatureAlgorithm
            self.publicKey = String.encodeHex(pubKey.publicKey)
          }
        }
        
        pub struct _AccountKey {
          pub var hashAlgorithm: HashAlgorithm
          pub var isRevoked: Bool
          pub var weight: UFix64
          pub var publicKey: _PublicKey
          pub var keyIndex: Int

          init(acctKey: AccountKey) {
             self.hashAlgorithm = acctKey.hashAlgorithm
             self.isRevoked = acctKey.isRevoked
             self.weight = acctKey.weight
             self.keyIndex = acctKey.keyIndex
             self.publicKey = _PublicKey(pubKey: acctKey.publicKey)
          }
        }
        
        pub fun main(addr: Address): AnyStruct? {
          let acct = getAccount(addr)
        
          let keys: {Int: AnyStruct} = {}
          var keyIndex: Int = 0
          var didNotFindKey: Bool = false
        
          while(!didNotFindKey) {
            let currKey = acct.keys.get(keyIndex: keyIndex)
            if let _currKey = currKey {
                keys[keyIndex] = _AccountKey(acctKey: _currKey)
            } else {
                didNotFindKey = true
            }
            keyIndex = keyIndex + 1
          }
        
          return keys
        }
        `,
        args: (arg, t) => ([arg(address, t.Address)])
    })
}

export async function verifyInteractionTemplateAudit({
    audit,
    template,
}) {
    invariant(audit != undefined, "verifyInteractionTemplateAudit({ audit }) -- audit must be defined")
    invariant(template != undefined, "verifyInteractionTemplateAudit({ template }) -- template must be defined")

    invariant(audit.f_type === "InteractionTemplateAudit", "verifyInteractionTemplateAudit({ audit }) -- audit must be an InteractionTemplateAudit")
    invariant(template.f_type === "InteractionTemplate", "verifyInteractionTemplateAudit({ template }) -- template must be an InteractionTemplate")

    log({
        title: "verifyInteractionTemplateAudit Debug",
        message: "verifyInteractionTemplateAudit debug messaging is enabled",
        level: 0
    })

    // Recompute ID to be sure it matches
    let recomputedTemplateID = await generateTemplateId({ template })

    if (recomputedTemplateID !== template.id) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: `Could not recompute and match template ID
                computed: ${recomputedTemplateID}
                template: ${template.id}
            `,
            level: 0
        })
        return false
    }

    // Ensure ID matches id in InteractionTemplateAudit
    if (template.id !== audit.data.id) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: `Recomputed template id does not match template id in audit
                template id: ${template.id}
                template id from audit: ${audit.data.id}
            `,
            level: 0
        })
        return false
    }

    // Ensure account that produced InteractionTemplateAudit exists
    let auditorAccount = await account(audit.data.signer.address)
    if (!auditorAccount) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: "Could not find account that produced InteractionTemplateAudit",
            level: 0
        })
        return false
    }

    // Ensure key that produced InteractionTemplateAudit exists
    let auditorAccountKeys = await getAccountKeys(audit.data.signer.address)
    if (!auditorAccountKeys) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: "Could not find auditor account keys",
            level: 0
        })
        return false
    }

    let auditorKey = auditorAccountKeys[audit.data.signer.key_id]
    if (!auditorKey) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: "Could not find auditor account keys",
            level: 0
        })
        return false
    }

    // Ensure key that produced InteractionTemplateAudit is not revoked
    if (auditorKey.isRevoked) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: "Auditor key that produced InteractionTemplateAudit is revoked",
            level: 0
        })
        return false
    }

    // Verify audit signature
    let isVerified;
    try {
        isVerified = await query({
            cadence: `
                pub fun main(
                    address: Address,
                    message: String,
                    keyIndex: Int,
                    signature: String,
                    domainSeparationTag: String,
                ): Bool {
                    let account = getAccount(address)

                    let accountKey = account.keys.get(keyIndex: keyIndex) ?? panic("Key provided does not exist on account")
                    
                    let messageBytes = message.decodeHex()
                    let sigBytes = signature.decodeHex()

                    // Ensure the key is not revoked
                    if accountKey.isRevoked {
                        return false
                    }

                    // Ensure the signature is valid
                    return accountKey.publicKey.verify(
                        signature: sigBytes,
                        signedData: messageBytes,
                        domainSeparationTag: domainSeparationTag,
                        hashAlgorithm: accountKey.hashAlgorithm
                    )
                }
            `,
            args: (arg, t) => ([
                arg(audit.data.signer.address, t.Address),
                arg(template.id, t.String),
                arg(String(audit.data.signer.key_id), t.Int),
                arg(audit.data.signer.signature, t.String),
                arg("FLOW-V0.0-user", t.String),
            ])
        })
    } catch(e) {
        log({
            title: "verifyInteractionTemplateAudit Debug Error",
            message: `Error executing verification script: ${e}`,
            level: 5
        })
        isVerified = false
    }

    return isVerified
}