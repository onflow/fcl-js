import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Add New Key"
export const DESCRIPTION = "Add a new key to an Account on Flow."
export const VERSION = "0.0.0"
export const HASH = "595c86561441b32b2b91ee03f9e10ca6efa7b41bcc994f51317ec0aa9d8f8a42"
export const CODE = 
`transaction(publicKey: String) {
prepare(signer: AuthAccount) {
signer.addPublicKey(publicKey.decodeHex())
}
}`

export const template = ({ proposer, authorization, payer, publicKey = "" }) => sdk.pipe([
    sdk.invariant(publicKey !== "", "template({publicKey}) -- publicKey must not be an empty string."),
    sdk.transaction(CODE),
    sdk.args([sdk.arg(publicKey, t.String)]),
    sdk.proposer(proposer),
    sdk.authorizations([authorization]),
    sdk.payer(payer),
    sdk.validator((ix, {Ok, Bad}) => {
        if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
        return Ok(ix)
    })
])
