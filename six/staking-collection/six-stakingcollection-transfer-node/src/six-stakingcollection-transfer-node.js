import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const DEPS = new Set([
    "0xSTAKINGCOLLECTIONADDRESS",
])

export const TITLE = "Transfer Node"
export const DESCRIPTION = "Transfers a node from one Staking Collection to another."
export const VERSION = "0.0.0"
export const HASH = "325fbb74ca1aece78692ba0a23a0277c1b6dd837758612866c65d603b8e9183e"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

// Transfers a NodeStaker object from an authorizers accoount
// and adds the NodeStaker to another accounts Staking Collection
// identified by the to Address.

transaction(nodeID: String, to: Address) {
    let fromStakingCollectionRef: &FlowStakingCollection.StakingCollection
    let toStakingCollectionCap: &FlowStakingCollection.StakingCollection{FlowStakingCollection.StakingCollectionPublic}

    prepare(account: AuthAccount) {
        // The account to transfer the NodeStaker object to must have a valid Staking Collection in order to receive the NodeStaker.
        if (!FlowStakingCollection.doesAccountHaveStakingCollection(address: to)) {
            panic("Destination account must have a Staking Collection set up.")
        }

        // Get a reference to the authorizers StakingCollection
        self.fromStakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")

        // Get the PublicAccount of the account to transfer the NodeStaker to. 
        let toAccount = getAccount(to)

        // Borrow a capability to the public methods available on the receivers StakingCollection.
        self.toStakingCollectionCap = toAccount.getCapability<&FlowStakingCollection.StakingCollection{FlowStakingCollection.StakingCollectionPublic}>(FlowStakingCollection.StakingCollectionPublicPath).borrow()
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        // Remove the NodeStaker from the authorizers StakingCollection.
        let nodeStaker <- self.fromStakingCollectionRef.removeNode(nodeID: nodeID)

        // Deposit the NodeStaker to the receivers StakingCollection.
        self.toStakingCollectionCap.addNodeObject(<- nodeStaker!)
    }
}
`

class UndefinedConfigurationError extends Error {
    constructor(address) {
      const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-withdraw-unstaked-flow/README.md`.trim()
      super(msg)
      this.name = "Stored Interaction Undefined Address Configuration Error"
    }
}

const addressCheck = async address => {
    if (!await config().get(address)) throw new UndefinedConfigurationError(address)
}

export const template = async ({ proposer, authorization, payer, nodeId = "", delegatorId = null, amount = ""}) => {
    for (let addr of DEPS) await addressCheck(addr)

    return sdk.pipe([
        sdk.transaction(CODE),
        sdk.args([sdk.arg(nodeId, t.String), sdk.arg(delegatorId, t.Optional(t.UInt32), sdk.arg(amount, t.UFix64))]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
