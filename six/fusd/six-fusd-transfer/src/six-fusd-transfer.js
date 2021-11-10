import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const DEPS = new Set([
  "0xFUNGIBLETOKENADDRESS",
  "0xFUSDADDRESS"
])

export const TITLE = "FUSD Transfer"
export const DESCRIPTION = "Transfer FUSD to another Flow account."
export const VERSION = "0.0.6"
export const HASH = "f30aca02eb7fea98c55396c1eda24eacf7d85b48f88a1a337e7bae154e898587"
export const CODE = 
`// This transaction withdraws FUSD from the signer's account and deposits it into a recipient account. 
// This transaction will fail if the recipient does not have an FUSD receiver. 
// No funds are transferred or lost if the transaction fails.
//
// Parameters:
// - amount: The amount of FUSD to transfer (e.g. 10.0)
// - to: The recipient account address.
//
// This transaction will fail if either the sender or recipient does not have
// an FUSD vault stored in their account. To check if an account has a vault
// or initialize a new vault, use check_fusd_vault_setup.cdc and setup_fusd_vault.cdc
// respectively.

import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FUSD from 0xFUSDADDRESS

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}
`

class UndefinedConfigurationError extends Error {
  constructor(address) {
    const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-delegate-new-locked-flow/README.md`.trim()
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
      fcl.payer(payer)
  ])
}
