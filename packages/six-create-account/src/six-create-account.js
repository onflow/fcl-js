import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Create Account"
export const DESCRIPTION = "Create an Account on Flow with given code and public keys."
export const VERSION = "0.0.0"
export const HASH = "655d4c6d55b2bb42a208ee9d0793f11499f3f2c3e714cf47dee660ff4185285a"
export const CODE = 
`
transaction(code: String, publicKeys: [String]) {
    prepare(signer: AuthAccount) {
        let acct = AuthAccount(payer: signer)
        for key in publicKeys {
            acct.addPublicKey(key.decodeHex())
        }
        acct.setCode(code.decodeHex())
    }
}
`

export const template = ({ proposer, authorization, payer, code = "", publicKeys = [] }) => sdk.pipe([
    sdk.invariant(publicKeys.length > 0, "template({publicKeys}) -- must include one public key when creating an account."),
    sdk.transaction(CODE),
    sdk.args([sdk.arg(Buffer.from(code).toString("hex"), t.String), sdk.arg(publicKeys, t.Array(t.String))]),
    sdk.proposer(proposer),
    sdk.authorizations([authorization]),
    sdk.payer(payer),
    sdk.validate((ix, {Ok, Bad}) => {
        if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
        return Ok(ix)
    })
])
