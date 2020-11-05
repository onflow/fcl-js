import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    LOCKEDTOKENADDRESS: "0xLOCKEDTOKENADDRESS",
}

const Env = {
    local: {
        [Deps.LOCKEDTOKENADDRESS]: "0x0",
    },
    testnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0x95e019a17d0e23d7",
    },
    mainnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0x8d0e87b65159ae63",
    }
}

export const TITLE = "Register Delegator"
export const DESCRIPTION = "Register a Delegator on Flow."
export const VERSION = "0.0.1"
export const HASH = "94a37cfffbd452d6139967282862be747297c60f9f0c78b1bb2c27c59cb9dbf6"
export const CODE = 
`import LockedTokens from 0xLOCKEDTOKENADDRESS

transaction(id: String, amount: UFix64) {

    let holderRef: &LockedTokens.TokenHolder

    prepare(acct: AuthAccount) {
        self.holderRef = acct.borrow<&LockedTokens.TokenHolder>(from: LockedTokens.TokenHolderStoragePath) 
            ?? panic("TokenHolder is not saved at specified path")
    }

    execute {
        self.holderRef.createNodeDelegator(nodeID: id)

        let delegatorProxy = self.holderRef.borrowDelegator()

        delegatorProxy.delegateNewTokens(amount: amount)
    }
}
`

export const template = async ({ proposer, authorization, payer, id = "", amount = ""}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(id, t.String), sdk.arg(amount, t.UFix64)]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator((ix, {Ok, Bad}) => {
            if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
            return Ok(ix)
        })
    ])
}
