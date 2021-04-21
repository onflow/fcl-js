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

export const TITLE = "Close Stake"
export const DESCRIPTION = "Closes a stake held in a Staking Collection."
export const VERSION = "0.0.0"
export const HASH = "dcae4faa6d689873f7caf7c5efef669f9fe1d4113e58b474b7aec1e07113a7ff"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

// Closes out a staking object in the staking collection
// This does not remove the record from the identity table,
// but it does mean that the account that closes it cannot ever access it again

transaction(nodeID: String, delegatorID: UInt32?) {
    
    let stakingCollectionRef: &FlowStakingCollection.StakingCollection

    prepare(account: AuthAccount) {
        self.stakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        self.stakingCollectionRef.closeStake(nodeID: nodeID, delegatorID: delegatorID)
    }
}
`

export const template = async ({ proposer, authorization, payer, nodeId = "", delegatorId = null}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.FLOWSTAKINGCOLLECTION, Env[env][Deps.FLOWSTAKINGCOLLECTION])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(nodeId, t.String), sdk.arg(delegatorId, t.Optional(t.UInt32))]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator(ix => {
            if (ix.authorizations.length > 1) throw new error("template only requires one authorization.")
            return ix
        })
    ])
}
