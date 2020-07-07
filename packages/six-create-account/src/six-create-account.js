import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Create Account"
export const DESCRIPTION = "Create an Account on Flow with given code and public keys."
export const VERSION = "0.0.0"
export const HASH = "b4b6397f2985d89662dbe4c2b8577545d49d64bce477935379c32cecaea63484"
export const CODE = 
`
transaction(code: String, publicKeys: [String]) {
    prepare(signer: AuthAccount) {
        let acct = AuthAccount(payer: signer)
        for key in publicKeys {
            acct.addPublicKey(key)
        }
        acct.setCode(code.decodeHex())
    }
}
`

export const template = ({ proposer, authorization, payer, code = "", publicKeys = [] }) => sdk.pipe([
    sdk.invariant(publicKeys.length > 0, "template({publicKeys}) -- must include one public key when creating an account."),
    sdk.transaction(CODE),
    sdk.args([sdk.arg(code, t.String), sdk.arg(publicKeys.map(k => Buffer.from(k).toString("hex")), t.Array(t.String))]),
    sdk.proposer(proposer),
    sdk.authorizations([authorization]),
    sdk.payer(payer),
    sdk.validate((ix, {Ok, Bad}) => {
        if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
        return Ok(ix)
    })
])
