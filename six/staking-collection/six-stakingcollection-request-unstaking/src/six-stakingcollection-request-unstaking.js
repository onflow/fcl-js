import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const DEPS = new Set([
    "0xSTAKINGCOLLECTIONADDRESS",
])

export const TITLE = "Request Unstaking"
export const DESCRIPTION = "Requests unstaking for a stake held in a Staking Collection."
export const VERSION = "0.0.2"
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
    
    return fcl.pipe([
        fcl.transaction(CODE),
        fcl.args([fcl.arg(nodeId, t.String), fcl.arg(delegatorId, t.Optional(t.UInt32), fcl.arg(amount, t.UFix64))]),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer),
        fcl.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
