import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Send Flow Tokens"
export const DESCRIPTION = "Send Flow Tokens to another account on Flow."
export const VERSION = "0.0.0"
export const HASH = "6aece03bd093e0421c22b70ed453160d57242884cdc8cecda96ccb18b8332344"
export const CODE = `
import FungibleToken from 0xee82856bf20e2aa6
import ExampleToken from 0xTOKENADDRESS

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&ExampleToken.Vault>(from: /storage/exampleTokenVault)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(/public/exampleTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}
`
export const template = ({ amount, to, proposer, from, payer }) =>
  sdk.pipe([
    sdk.invariant(amount > 0, "template({amount}) -- amount must be greater than 0"),
    sdk.invariant(to, "Needs to be a thing"),
    sdk.transaction(CODE),
    sdk.args([
      sdk.arg(amount, t.UFix64),
      sdk.arg(to, t.Address),
    ]),
    sdk.proposer(proposer),
    sdk.authorizations([from]),
    sdk.payer(payer),
    sdk.validate((ix, {Ok, Bad}) => {
      if (!hasSingleAuthorization(ix)) return Bad(ix, "Should only need a single authorization")
      return Ok(ix)
    })
  ])