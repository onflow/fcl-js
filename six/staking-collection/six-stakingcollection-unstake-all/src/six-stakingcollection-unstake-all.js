import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Request Unstaking"
export const DESCRIPTION = "Requests unstaking for a stake held in a Staking Collection."
export const VERSION = "0.0.0"
export const HASH = "02bab465a5a406f66700753a4f7889ab9a3c83ba1cf5e8aee792c80aea9ed7c1"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

/// Requests to unstake ALL tokens for the specified node or delegator in the staking collection

transaction(nodeID: String) {
    
    let stakingCollectionRef: &FlowStakingCollection.StakingCollection

    prepare(account: AuthAccount) {
        self.stakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        self.stakingCollectionRef.unstakeAll(nodeID: nodeID)
    }
}
`

export const template = async ({ proposer, authorization, payer, nodeId = "", delegatorId = null, amount = ""}) => {
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
