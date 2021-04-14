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

export const TITLE = "Register Node"
export const DESCRIPTION = "Register a node held in a Staking Collection."
export const VERSION = "0.0.0"
export const HASH = "dcae4faa6d689873f7caf7c5efef669f9fe1d4113e58b474b7aec1e07113a7ff"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

/// Registers a delegator in the staking collection resource
/// for the specified node information and the amount of tokens to commit

transaction(id: String,
            role: UInt8,
            networkingAddress: String,
            networkingKey: String,
            stakingKey: String,
            amount: UFix64) {
    
    let stakingCollectionRef: &FlowStakingCollection.StakingCollection

    prepare(account: AuthAccount) {
        self.stakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")
    }

    execute {
        self.stakingCollectionRef.registerNode(
            id: id,
            role: role,
            networkingAddress: networkingAddress,
            networkingKey: networkingKey,
            stakingKey: stakingKey,
            amount: amount)
    }
}
`

export const template = async ({ proposer, authorization, payer, nodeID = "", nodeRole = "", networkingAddress = "", networkingKey = "", stakingKey = "", amount = "" }) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.FLOWSTAKINGCOLLECTION, Env[env][Deps.FLOWSTAKINGCOLLECTION])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.args([sdk.arg(nodeID, t.String), sdk.arg(nodeRole, t.UInt8), sdk.arg(networkingAddress, t.String), sdk.arg(networkingKey, t.String), sdk.arg(stakingKey, t.String), sdk.arg(amount, t.UFix64)]),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator((ix, {Ok, Bad}) => {
            if (ix.authorizations.length > 1) return Bad(ix, "template only requires one authorization.")
            return Ok(ix)
        })
    ])
}
