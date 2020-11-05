import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    LOCKEDTOKENADDRESS: "0xLOCKEDTOKENADDRESS",
    STAKINGPROXYADDRESS: "0xSTAKINGPROXYADDRESS"
}

const Env = {
    local: {
        [Deps.LOCKEDTOKENADDRESS]: "0x0",
        [Deps.STAKINGPROXYADDRESS]: "0x0",
    },
    testnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0x95e019a17d0e23d7",
        [Deps.STAKINGPROXYADDRESS]: "0x7aad92e5a0715d21",
    },
    mainnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0x8d0e87b65159ae63",
        [Deps.STAKINGPROXYADDRESS]: "0x62430cf28c26d095",
    }
}

export const TITLE = "Unstake Flow"
export const DESCRIPTION = "Unstakes Flow for an account."
export const VERSION = "0.0.1"
export const HASH = "28d1719c5b21c88c62665db5ba04886809f3234c27057b057c36d5f265ee9de4"
export const CODE = 
`import LockedTokens from 0xLOCKEDTOKENADDRESS
import StakingProxy from 0xSTAKINGPROXYADDRESS

transaction() {

    let holderRef: &LockedTokens.TokenHolder

    prepare(acct: AuthAccount) {
        self.holderRef = acct.borrow<&LockedTokens.TokenHolder>(from: LockedTokens.TokenHolderStoragePath)
            ?? panic("Could not borrow reference to TokenHolder")
    }

    execute {
        let stakerProxy = self.holderRef.borrowStaker()

        stakerProxy.unstakeAll()
    }
}`

export const template = async ({ proposer, authorization, payer }) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])
    code = code.replace(Deps.STAKINGPROXYADDRESS, Env[env][Deps.STAKINGPROXYADDRESS])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator((ix, {Ok, Bad}) => {
            if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
            return Ok(ix)
        })
    ])
}
