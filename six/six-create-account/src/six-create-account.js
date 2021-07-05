import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "Create Account"
export const DESCRIPTION = "Create an Account on Flow with public keys."
export const VERSION = "0.0.7"
export const HASH = "eef2d0494448554177612e63026256258339230cbc6931ded78d6149443c6173"
export const CODE = 
`transaction(publicKeys: [String]) {
prepare(signer: AuthAccount) {
let acct = AuthAccount(payer: signer)
for key in publicKeys {
acct.addPublicKey(key.decodeHex())
}
}
}`

export const template = ({ proposer, authorization, payer, publicKeys = [] }) => fcl.pipe([
    fcl.invariant(publicKeys.length > 0, "template({publicKeys}) -- must include one public key when creating an account."),
    fcl.transaction(CODE),
    fcl.args([fcl.arg(publicKeys, t.Array(t.String))]),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer)
])
