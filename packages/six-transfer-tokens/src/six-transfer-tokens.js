import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Transfer Tokens"
export const DESCRIPTION = "Transfer tokens from one account to another."
export const VERSION = "0.0.1"
export const HASH = "ca80b628d985b358ae1cb136bcd976997c942fa10dbabfeafb4e20fa66a5a5e2"
export const CODE = 
`import FungibleToken from 0xee82856bf20e2aa6
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

export const template = ({ proposer, authorization, payer, amount = "", to = "" }) => sdk.pipe([
    sdk.transaction(CODE),
    sdk.args([sdk.arg(amount, t.UFix64), sdk.arg(to, t.Address)]),
    sdk.proposer(proposer),
    sdk.authorizations([authorization]),
    sdk.payer(payer),
    sdk.validator((ix, {Ok, Bad}) => {
        if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
        return Ok(ix)
    })
])
