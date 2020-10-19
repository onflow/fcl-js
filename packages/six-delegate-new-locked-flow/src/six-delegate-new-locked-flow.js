import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    LOCKEDTOKENADDRESS: "0xLOCKEDTOKENADDRESS",
    FUNGIBLETOKENADDRESS: "0xFUNGIBLETOKENADDRESS",
    FLOWTOKENADDRESS: "0xFLOWTOKENADDRESS",
}

const Env = {
    local: {
        [Deps.LOCKEDTOKENADDRESS]: "0x0",
        [Deps.FUNGIBLETOKENADDRESS]: "0x0",
        [Deps.FLOWTOKENADDRESS]: "0x0",
    },
    testnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0xbe9b485f7d5e7787",
        [Deps.FUNGIBLETOKENADDRESS]: "0x9a0766d93b6608b7",
        [Deps.FLOWTOKENADDRESS]: "0x7e60df042a9c0868",
    },
    mainnet: {
        [Deps.LOCKEDTOKENADDRESS]: "0x31aed847945124fd",
        [Deps.FUNGIBLETOKENADDRESS]: "0xf233dcee88fe0abe",
        [Deps.FLOWTOKENADDRESS]: "0x1654653399040a61",
    }
}

export const TITLE = "Delegate New Locked Flow"
export const DESCRIPTION = "Delegate New Locked Flow for an account."
export const VERSION = "0.0.1"
export const HASH = "802354d8b3e7908e584bcb5217637fb9f4ef045427c32d57d81ad4a390ed1a60"
export const CODE = 
`import FlowToken from 0xFLOWTOKENADDRESS
import FungibleToken from 0xFUNGIBLETOKENADDRESS
import LockedTokens from 0xLOCKEDTOKENADDRESS

transaction(amount: UFix64) {

    let holderRef: &LockedTokens.TokenHolder

    let vaultRef: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.holderRef = acct.borrow<&LockedTokens.TokenHolder>(from: LockedTokens.TokenHolderStoragePath)
            ?? panic("Could not borrow reference to TokenHolder")

        self.vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow flow token vault reference")
    }

    execute {
        let stakerProxy = self.holderRef.borrowDelegator()

        let lockedBalance = self.holderRef.getLockedAccountBalance()

        if amount <= lockedBalance {

            stakerProxy.delegateNewTokens(amount: amount)

        } else if ((amount - lockedBalance) <= self.vaultRef.balance) {

            self.holderRef.deposit(from: <-self.vaultRef.withdraw(amount: amount - lockedBalance))

            stakerProxy.delegateNewTokens(amount: amount)
        } else {
            panic("Not enough tokens to stake!")
        }
    }
}`

export const template = async ({ proposer, authorization, payer, amount = ""}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])
    code = code.replace(Deps.FUNGIBLETOKENADDRESS, Env[env][Deps.FUNGIBLETOKENADDRESS])
    code = code.replace(Deps.FLOWTOKENADDRESS, Env[env][Deps.FLOWTOKENADDRESS])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(amount, t.UFix64)]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator((ix, {Ok, Bad}) => {
            if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
            return Ok(ix)
        })
    ])
}
