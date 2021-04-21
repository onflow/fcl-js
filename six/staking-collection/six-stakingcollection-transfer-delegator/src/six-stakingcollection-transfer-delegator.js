import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    FLOWSTAKINGCOLLECTION: "0xSTAKINGCOLLECTIONADDRESS",
}

const Env = {
    local: {
        [Deps.FLOWSTAKINGCOLLECTION]: "0x0",
    },
    testnet: {
        [Deps.FLOWSTAKINGCOLLECTION]: "0x0",
    },
    mainnet: {
        [Deps.FLOWSTAKINGCOLLECTION]: "0x0",
    }
}

export const TITLE = "Transfer Delegator"
export const DESCRIPTION = "Transfers a delegator from one Staking Collection to another."
export const VERSION = "0.0.0"
export const HASH = "dcae4faa6d689873f7caf7c5efef669f9fe1d4113e58b474b7aec1e07113a7ff"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

// Transfers a NodeDelegator object from an authorizers accoount
// and adds the NodeDelegator to another accounts Staking Collection
// identified by the to Address.

transaction(nodeID: String, delegatorID: UInt32, to: Address) {
    let fromStakingCollectionRef: &FlowStakingCollection.StakingCollection
    let toStakingCollectionCap: &FlowStakingCollection.StakingCollection{FlowStakingCollection.StakingCollectionPublic}

    prepare(account: AuthAccount) {
        // The account to transfer the NodeDelegator object to must have a valid Staking Collection in order to receive the NodeDelegator.
        if (!FlowStakingCollection.doesAccountHaveStakingCollection(address: to)) {
            panic("Destination account must have a Staking Collection set up.")
        }

        // Get a reference to the authorizers StakingCollection
        self.fromStakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")

        // Get the PublicAccount of the account to transfer the NodeDelegator to. 
        let toAccount = getAccount(to)

        // Borrow a capability to the public methods available on the receivers StakingCollection.
        self.toStakingCollectionCap = toAccount.getCapability<&FlowStakingCollection.StakingCollection{FlowStakingCollection.StakingCollectionPublic}>(FlowStakingCollection.StakingCollectionPublicPath).borrow()
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        // Remove the NodeDelegator from the authorizers StakingCollection.
        let nodeDelegator <- self.fromStakingCollectionRef.removeDelegator(nodeID: nodeID, delegatorID: delegatorID)

        // Deposit the NodeDelegator to the receivers StakingCollection.
        self.toStakingCollectionCap.addDelegatorObject(<- nodeDelegator!)
    }
}
`

export const template = async ({ proposer, authorization, payer, nodeId = "", to = ""}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.FLOWSTAKINGCOLLECTION, await sdk.config().get(Deps.FLOWSTAKINGCOLLECTION, Env[env][Deps.FLOWSTAKINGCOLLECTION]))

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(nodeId, t.String), sdk.arg(to, t.Address)]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
