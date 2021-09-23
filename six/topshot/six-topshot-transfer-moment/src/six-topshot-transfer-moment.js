import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const DEPS = new Set([
  "0xTOPSHOT",
  "0xNONFUNGIBLETOKEN"
])

export const TITLE = "NBA Top Shot Transfer Moment"
export const DESCRIPTION = "Transfers a moment from an authorizer's NBA Top Shot collection to another account's."
export const VERSION = "0.0.1"
export const HASH = "3bb66424f129bee4605ef2f932ce8c133385beea019518f316bae7a5c34aa7bd"
export const CODE = 
`import NonFungibleToken from 0xNONFUNGIBLETOKEN
import TopShot from 0xTOPSHOT

// This transaction transfers a moment to a recipient

// This transaction is how a topshot user would transfer a moment
// from their account to another account
// The recipient must have a TopShot Collection object stored
// and a public MomentCollectionPublic capability stored at
// \`/public/MomentCollection\`

// Parameters:
//
// recipient: The Flow address of the account to receive the moment.
// withdrawID: The id of the moment to be transferred

transaction(recipient: Address, withdrawID: UInt64) {

    // local variable for storing the transferred token
    let transferToken: @NonFungibleToken.NFT
    
    prepare(acct: AuthAccount) {

        // borrow a reference to the owner's collection
        let collectionRef = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
            ?? panic("Could not borrow a reference to the stored Moment collection")
        
        // withdraw the NFT
        self.transferToken <- collectionRef.withdraw(withdrawID: withdrawID)
    }

    execute {
        
        // get the recipient's public account object
        let recipient = getAccount(recipient)

        // get the Collection reference for the receiver
        let receiverRef = recipient.getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>()!

        // deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken)
    }
}`

class UndefinedConfigurationError extends Error {
  constructor(address) {
    const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-topshot-transfer-moment/README.md`.trim()
    super(msg)
    this.name = "Stored Interaction Undefined Address Configuration Error"
  }
}

const addressCheck = async address => {
  if (!await config().get(address)) throw new UndefinedConfigurationError(address)
}

export const template = async ({ proposer, authorization, payer, recipient = "", withdrawID = ""}) => {
  for (let addr of DEPS) await addressCheck(addr)

  return fcl.pipe([
    fcl.transaction(CODE),
    fcl.args([fcl.arg(recipient, t.Address), fcl.arg(withdrawID, t.UInt64)]),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer)
  ])
}
