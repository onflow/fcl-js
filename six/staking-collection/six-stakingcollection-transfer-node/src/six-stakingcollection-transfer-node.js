import * as fcl from "@onflow/fcl"
import {t, config} from "@onflow/fcl"

const DEPS = new Set([
    "0xSTAKINGCOLLECTIONADDRESS",
])

export const TITLE = "Transfer Node"
export const DESCRIPTION = "Transfers a Node from one Staking Collection to another."
export const VERSION = "0.0.5"
export const HASH = "466783ba26ad0c4efeb794114242dc839325103721a18fec4ef6fbed965e7129"
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

        let machineAccountInfo = self.fromStakingCollectionRef.getMachineAccounts()[nodeID]
            ?? panic("Could not get machine account info for the specified node ID")

        // Remove the NodeStaker from the authorizers StakingCollection.
        let nodeStaker <- self.fromStakingCollectionRef.removeNode(nodeID: nodeID)

        // Deposit the NodeStaker to the receivers StakingCollection.
        self.toStakingCollectionCap.addNodeObject(<- nodeStaker!, machineAccountInfo: machineAccountInfo)
    }
}`

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

export const template = async ({ proposer, authorization, payer, nodeId = "", to = ""}) => {
    for (let addr of DEPS) await addressCheck(addr)

    return fcl.pipe([
        fcl.transaction(CODE),
        fcl.args([fcl.arg(nodeId, t.String), fcl.arg(to, t.Address)]),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer)
    ])
}
