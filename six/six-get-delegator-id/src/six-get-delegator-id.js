import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const DEPS = new Set([
    "0xLOCKEDTOKENADDRESS"
])

export const TITLE = "Get Delegator ID"
export const DESCRIPTION = "Gets a delegators ID."
export const VERSION = "0.0.7"
export const HASH = "20236b89c6f8ac93f51c4b7785cbe266727b41141d4ffc97229c9d60a4605ed8"
export const CODE = 
`import LockedTokens from 0xLOCKEDTOKENADDRESS

pub fun main(account: Address): UInt32 {

    let lockedAccountInfoRef = getAccount(account)
        .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
        .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")

    return lockedAccountInfoRef.getDelegatorID()!
}
`

class UndefinedConfigurationError extends Error {
    constructor(address) {
      const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-get-delegator-id/README.md`.trim()
      super(msg)
      this.name = "Stored Interaction Undefined Address Configuration Error"
    }
}

const addressCheck = async address => {
    if (!await config().get(address)) throw new UndefinedConfigurationError(address)
}

export const template = async ({ account = "" }) => {
    for (let addr of DEPS) await addressCheck(addr)

    return fcl.pipe([
        fcl.script(CODE),
        fcl.args([fcl.arg(account, t.Address)])
    ])
}
