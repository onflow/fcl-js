import * as fcl from "@onflow/fcl"
import {config} from "@onflow/config"

const DEPS = new Set([
    "0xFUNGIBLETOKENADDRESS",
    "0xFUSDADDRESS"
])

export const TITLE = "FUSD Setup"
export const DESCRIPTION = "Set up a FUSD Vault and Receiver for an account."
export const VERSION = "0.0.4"
export const HASH = "944bcb6058b3d5e8304e3657251207fd505e7c9381b022c55365451cfda5b48c"
export const CODE = 
`// This transaction configures the signer's account with an empty FUSD vault.
//
// It also links the following capabilities:
//
// - FungibleToken.Receiver: this capability allows this account to accept FUSD deposits.
// - FungibleToken.Balance: this capability allows anybody to inspect the FUSD balance of this account.

import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FUSD from 0xFUSDADDRESS

transaction {

    prepare(signer: AuthAccount) {

        // It's OK if the account already has a Vault, but we don't want to replace it
        if(signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) != nil) {
            return
        }
        
        // Create a new FUSD Vault and put it in storage
        signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
            /public/fusdReceiver,
            target: /storage/fusdVault
        )

        // Create a public capability to the Vault that only exposes
        // the balance field through the Balance interface
        signer.link<&FUSD.Vault{FungibleToken.Balance}>(
            /public/fusdBalance,
            target: /storage/fusdVault
        )
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

export const template = async ({ proposer, authorization, payer }) => {
    for (let addr of DEPS) await addressCheck(addr)

    return fcl.pipe([
        fcl.transaction(CODE),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer)
    ])
}
