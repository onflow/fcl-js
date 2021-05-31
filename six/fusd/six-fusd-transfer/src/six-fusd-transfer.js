import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "FUSD Transfer"
export const DESCRIPTION = "Transfer FUSD to another Flow account."
export const VERSION = "0.0.1"
export const HASH = "34303bce7380715d79eb4f3c5a2a7482b0869247f336030aa4c7139b45d0d821"
export const CODE = 
`import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction(amount: UFix64, to: Address) {

  // The Vault resource that holds the tokens being transferred
  let sentVault: @FungibleToken.Vault

  prepare(signer: AuthAccount) {
    // Get a reference to the signer's stored vault
    let vaultRef = signer
      .borrow<&FUSD.Vault>(from: /storage/fusdVault)
      ?? panic("Could not borrow reference to the owner's Vault!")

    // Withdraw tokens from the signer's stored vault
    self.sentVault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    // Get the recipient's public account object
    let recipient = getAccount(to)

    // Get a reference to the recipient's Receiver
    let receiverRef = recipient
      .getCapability(/public/fusdReceiver)
      .borrow<&{FungibleToken.Receiver}>()
      ?? panic("Could not borrow receiver reference to the recipient's Vault")

    // Deposit the withdrawn tokens in the recipient's receiver
    receiverRef.deposit(from: <-self.sentVault)
  }
}
`

export const template = ({ proposer, authorization, payer }) => fcl.pipe([
    fcl.transaction(CODE),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer),
    fcl.validator(ix => {
        if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
        return ix
    })
])
