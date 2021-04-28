import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    FLOWTOKENADDRESS: "0xFLOWTOKENADDRESS",
    LOCKEDTOKENADDRESS: "0xLOCKEDTOKENADDRESS",
}

const Env = {
    local: {
        [Deps.FLOWTOKENADDRESS]: "0x0",
        [Deps.LOCKEDTOKENADDRESS]: "0x0",
    },
    testnet: {
        [Deps.FLOWTOKENADDRESS]: "0x7e60df042a9c0868",
        [Deps.LOCKEDTOKENADDRESS]: "0x95e019a17d0e23d7",
    },
    mainnet: {
        [Deps.FLOWTOKENADDRESS]: "0x1654653399040a61",
        [Deps.LOCKEDTOKENADDRESS]: "0x8d0e87b65159ae63",
    }
}

export const TITLE = "Register Delegator"
export const DESCRIPTION = "Register a Delegator on Flow."
export const VERSION = "0.0.7"
export const HASH = "3cb357a97a57d9abbe5c68f0df342ee96ba97ade2013753fd2ddf47695a8c08a"
export const CODE =
`import FlowToken from 0xFLOWTOKENADDRESS
import LockedTokens from 0xLOCKEDTOKENADDRESS

transaction(id: String, amount: UFix64) {

    let holderRef: &LockedTokens.TokenHolder

    let vaultRef: &FlowToken.Vault

    prepare(account: AuthAccount) {
        self.holderRef = account.borrow<&LockedTokens.TokenHolder>(from: LockedTokens.TokenHolderStoragePath) 
            ?? panic("TokenHolder is not saved at specified path")

        self.vaultRef = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow flow token vault reference")
    }

    execute {
        self.holderRef.createNodeDelegator(nodeID: id)

        let delegatorProxy = self.holderRef.borrowDelegator()

        let lockedBalance = self.holderRef.getLockedAccountBalance()

        if amount <= lockedBalance {

            delegatorProxy.delegateNewTokens(amount: amount)

        } else if ((amount - lockedBalance) <= self.vaultRef.balance) {

            self.holderRef.deposit(from: <-self.vaultRef.withdraw(amount: amount - lockedBalance))

            delegatorProxy.delegateNewTokens(amount: amount)

        } else {
            panic("Not enough tokens to stake!")
        }
    }
}
`

export const template = async ({ proposer, authorization, payer, id = "", amount = ""}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])
    code = code.replace(Deps.FLOWTOKENADDRESS, Env[env][Deps.FLOWTOKENADDRESS])

    return fcl.pipe([
        fcl.transaction(code),
        fcl.args([fcl.arg(id, t.String), fcl.arg(amount, t.UFix64)]),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer),
        fcl.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
