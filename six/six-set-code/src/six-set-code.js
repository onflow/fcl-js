import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "Set Account Code"
export const DESCRIPTION = "Set an Account Code on Flow with given code."
export const VERSION = "0.0.6"
export const HASH = "7375dc3feb96e2f8061eff548220a96bf77ceb17affd1ac113f10d15411a92c4"
export const CODE = 
`transaction(code: String) {
    prepare(acct: AuthAccount) {
        acct.setCode(code.decodeHex())
    }
}`

export const template = ({ proposer, authorization, payer, code = "" }) => fcl.pipe([
    fcl.transaction(CODE),
    fcl.args([fcl.arg(Buffer.from(code, "utf8").toString("hex"), t.String)]),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer),
    fcl.validator(ix => {
        if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
        return ix
    }),
])
