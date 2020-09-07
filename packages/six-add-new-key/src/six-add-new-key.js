import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Add New Key"
export const DESCRIPTION = "Add a new key to an Account on Flow."
export const VERSION = "0.0.0"
export const HASH = "9f2e43f75e6f001879c66b16137e3cddbe3adeb56c1915831022babe84d6b0ee"
export const CODE = 
`transaction(publicKey: String) {
prepare(signer: AuthAccount) {
let acct = AuthAccount(payer: signer)
acct.addPublicKey(publicKey.decodeHex())
}
}`

export const template = ({ payer, proposer, authorization, publicKey = "" }) => sdk.pipe([
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
