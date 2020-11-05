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

export const TITLE = "Get Delegator ID"
export const DESCRIPTION = "Gets a delegators ID."
export const VERSION = "0.0.1"
export const HASH = "20236b89c6f8ac93f51c4b7785cbe266727b41141d4ffc97229c9d60a4605ed8"
export const CODE = 
`import LockedTokens from 0xLOCKEDTOKENADDRESS

pub fun main(account: Address): UInt32 {

    let lockedAccountInfoRef = getAccount(account)
        .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
        .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")

    return lockedAccountInfoRef.getDelegatorID()!
}`

export const template = async ({ account = "" }) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])

    return sdk.pipe([
        sdk.script(code),
        sdk.args([sdk.arg(account, t.Address)])
    ])
}
