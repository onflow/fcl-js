import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    FLOWSTAKINGCOLLECTION: "0xLOCKEDTOKENADDRESS",
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

export const TITLE = "Register Delegator"
export const DESCRIPTION = "Register a delegator held in a Staking Collection."
export const VERSION = "0.0.0"
export const HASH = "dcae4faa6d689873f7caf7c5efef669f9fe1d4113e58b474b7aec1e07113a7ff"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

/// Registers a delegator in the staking collection resource
/// for the specified nodeID and the amount of tokens to commit

transaction(id: String, amount: UFix64) {
    
    let stakingCollectionRef: &FlowStakingCollection.StakingCollection

    prepare(account: AuthAccount) {
        self.stakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        self.stakingCollectionRef.registerDelegator(nodeID: id, amount: amount)      
    }
}
`

export const template = async ({ proposer, authorization, payer, nodeId = "", amount = ""}) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.FLOWSTAKINGCOLLECTION, Env[env][Deps.FLOWSTAKINGCOLLECTION])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(nodeId, t.String), sdk.arg(amount, t.String)]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator((ix, {Ok, Bad}) => {
            if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
            return Ok(ix)
        })
    ])
}
