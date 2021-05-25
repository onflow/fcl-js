import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const TITLE = "Request Unstaking"
export const DESCRIPTION = "Requests unstaking for a stake held in a Staking Collection."
export const VERSION = "0.0.0"
export const HASH = "efea1c7da0fd94f662ffe25630b451606f63ec73b92410bad24eda1f16f4e20d"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

/// Requests unstaking for the specified node or delegator in the staking collection

transaction(nodeID: String, delegatorID: UInt32?, amount: UFix64) {
    
    let stakingCollectionRef: &FlowStakingCollection.StakingCollection

    prepare(account: AuthAccount) {
        self.stakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        self.stakingCollectionRef.requestUnstaking(nodeID: nodeID, delegatorID: delegatorID, amount: amount)
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
