import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"


export const createAccount = (code = "", publicKeys = []) => sdk.pipe([
    sdk.transaction`
        transaction(code: String, publicKeys: [String]) {
            prepare(signer: AuthAccount) {
                let acct = AuthAccount(payer: signer)
                for key in publicKeys {
                    acct.addPublicKey(key)
                }
                acct.setCode("%s".decodeHex())
            }
        }
    `,
    sdk.args([sdk.arg(code, t.String), sdk.arg(publicKeys, t.Array(t.String))])
])
