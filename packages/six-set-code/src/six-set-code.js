import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Set Account Code"
export const DESCRIPTION = "Set an Account Code on Flow with given code."
export const VERSION = "0.0.0"
export const HASH = "922bc35cadb81d7a449956aa02f57bcd052859e9cc212e84af2b7035d2af001d"
export const CODE = 
`
transaction(code: String) {
    prepare(signer: AuthAccount) {
        let acct = AuthAccount(payer: signer)
        acct.setCode(code.decodeHex())
    }
}
`

export const template = ({ proposer, authorization, payer, code = "" }) => sdk.pipe([
    sdk.invariant(!!code, "template({CODE}) -- must include code to set on an account."),
    sdk.transaction(CODE),
    sdk.args([sdk.arg(Buffer.from(code, "utf8").toString("hex"), t.String)]),
    sdk.proposer(proposer),
    sdk.authorizations([authorization]),
    sdk.payer(payer),
    sdk.validator((ix, {Ok, Bad}) => {
        if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
        return Ok(ix)
    })
])
