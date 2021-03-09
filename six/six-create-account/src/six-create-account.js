import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Create Account"
export const DESCRIPTION = "Create an Account on Flow with public keys."
export const VERSION = "0.0.0"
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

export const template = ({ proposer, authorization, payer, publicKeys = [] }) => sdk.pipe([
    sdk.invariant(publicKeys.length > 0, "template({publicKeys}) -- must include one public key when creating an account."),
    sdk.transaction(CODE),
    sdk.args([sdk.arg(publicKeys, t.Array(t.String))]),
    sdk.proposer(proposer),
    sdk.authorizations([authorization]),
    sdk.payer(payer),
    sdk.validator((ix, {Ok, Bad}) => {
        if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
        return Ok(ix)
    })
])
