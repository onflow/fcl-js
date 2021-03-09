import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Set Account Code"
export const DESCRIPTION = "Set an Account Code on Flow with given code."
export const VERSION = "0.0.0"
export const HASH = "7375dc3feb96e2f8061eff548220a96bf77ceb17affd1ac113f10d15411a92c4"
export const CODE = 
`transaction(code: String) {
    prepare(acct: AuthAccount) {
        acct.setCode(code.decodeHex())
    }
}`

export const template = ({ proposer, authorization, payer, code = "" }) => sdk.pipe([
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
