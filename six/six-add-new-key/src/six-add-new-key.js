import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "Add New Key"
export const DESCRIPTION = "Add a new key to an Account on Flow."
export const VERSION = "0.0.7"
export const HASH = "595c86561441b32b2b91ee03f9e10ca6efa7b41bcc994f51317ec0aa9d8f8a42"
export const CODE = 
`transaction(publicKey: String) {
prepare(signer: AuthAccount) {
signer.addPublicKey(publicKey.decodeHex())
}
}`

export const template = ({ proposer, authorization, payer, publicKey = "" }) => fcl.pipe([
    fcl.invariant(publicKey !== "", "template({publicKey}) -- publicKey must not be an empty string."),
    fcl.transaction(CODE),
    fcl.args([fcl.arg(publicKey, t.String)]),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer),
    fcl.validator(ix => {
        if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
        return ix
    })
])
