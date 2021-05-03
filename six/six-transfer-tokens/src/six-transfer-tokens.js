import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const DEPS = new Set([
    "0xFUNGIBLETOKENADDRESS",
])

export const TITLE = "Transfer Tokens"
export const DESCRIPTION = "Transfer tokens from one account to another."
export const VERSION = "0.0.0"
export const HASH = "47851586d962335e3f7d9e5d11a4c527ee4b5fd1c3895e3ce1b9c2821f60b166"
export const CODE = 
`import FungibleToken from 0xFUNGIBLETOKENADDRESS
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

class UndefinedConfigurationError extends Error {
    constructor(address) {
      const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-transfer-tokens/README.md`.trim()
      super(msg)
      this.name = "Stored Interaction Undefined Address Configuration Error"
    }
}

const addressCheck = async address => {
    if (!await config().get(address)) throw new UndefinedConfigurationError(address)
}

export const template = async ({ proposer, authorization, payer, amount = "", to = "" }) => {
    for (let addr of DEPS) await addressCheck(addr)

    return fcl.pipe([
        fcl.transaction(CODE),
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
