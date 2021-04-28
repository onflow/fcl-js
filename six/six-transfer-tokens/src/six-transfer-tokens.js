import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    FungibleToken: "0xFungibleToken"
}

const Env = {
    local: {
        [Deps.FungibleToken]: "0xee82856bf20e2aa6",
    },
    testnet: {
        [Deps.FungibleToken]: "0x9a0766d93b6608b7",
    },
    mainnet: {
        [Deps.FungibleToken]: "0xf233dcee88fe0abe"
    }
}

export const TITLE = "Transfer Tokens"
export const DESCRIPTION = "Transfer tokens from one account to another."
export const VERSION = "0.0.0"
export const HASH = "47851586d962335e3f7d9e5d11a4c527ee4b5fd1c3895e3ce1b9c2821f60b166"
export const CODE = 
`import FungibleToken from ${Deps.FungibleToken}
transaction(amount: UFix64, to: Address) {
let vault: @FungibleToken.Vault
prepare(signer: AuthAccount) {
self.vault <- signer
.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
.withdraw(amount: amount)
}
execute {
getAccount(to)
.getCapability(/public/flowTokenReceiver)!
.borrow<&{FungibleToken.Receiver}>()!
.deposit(from: <-self.vault)
}
}`

export const template = async ({ proposer, authorization, payer, amount = "", to = "" }) => {
    const env = await config().get("env", "mainnet")
    const code = CODE.replace(Deps.FungibleToken, Env[env][Deps.FungibleToken])

    return fcl.pipe([
        fcl.transaction(code),
        fcl.args([fcl.arg(amount, t.UFix64), fcl.arg(to, t.Address)]),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer),
        fcl.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
