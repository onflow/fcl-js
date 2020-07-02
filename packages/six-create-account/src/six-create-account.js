import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const CREATE_ACCOUNT_CADENCE = 
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

export const CREATE_ACCOUNT_CADENCE_sha256_AS_hex = "b4b6397f2985d89662dbe4c2b8577545d49d64bce477935379c32cecaea63484"

export const createAccount = (code = "", publicKeys = []) => sdk.pipe([
    sdk.transaction(CREATE_ACCOUNT_CADENCE),
    sdk.args([sdk.arg(code, t.String), sdk.arg(publicKeys, t.Array(t.String))])
])
