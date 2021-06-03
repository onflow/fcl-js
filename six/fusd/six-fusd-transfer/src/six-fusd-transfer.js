import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const DEPS = new Set([
  "0xFUNGIBLETOKENADDRESS",
  "0xFUSDADDRESS"
])

export const TITLE = "FUSD Transfer"
export const DESCRIPTION = "Transfer FUSD to another Flow account."
export const VERSION = "0.0.4"
export const HASH = "0459184235a66fd5d7aef72a0b0e15de2b1b6c540a6aa7b68880860ff219979e"
export const CODE = 
`import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FUSD from 0xFUSDADDRESS

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

export const template = ({ proposer, authorization, payer, amount = "", to = "" }) => {
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
