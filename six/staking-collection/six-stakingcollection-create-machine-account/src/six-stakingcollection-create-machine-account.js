import * as fcl from "@onflow/fcl"
import {t, config} from "@onflow/fcl"

const DEPS = new Set([
    "0xSTAKINGCOLLECTIONADDRESS",
])

export const TITLE = "Create Machine Account"
export const DESCRIPTION = "Creates a Machine Account for node held in Staking Collection."
export const VERSION = "0.0.1"
export const HASH = "55ca5fe85d9b09aa9ab9fbaf3a2618d0cc5f23f5ad37b5bf045c022cd9058c27"
export const CODE = 
`import FlowStakingCollection from 0xSTAKINGCOLLECTIONADDRESS

/// Creates a machine account for a node that is already in the staking collection
/// and adds public keys to the new account

transaction(nodeID: String, publicKeys: [String]) {
    
    let stakingCollectionRef: &FlowStakingCollection.StakingCollection

    prepare(account: AuthAccount) {
        self.stakingCollectionRef = account.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath)
            ?? panic("Could not borrow ref to StakingCollection")

        if let machineAccount = self.stakingCollectionRef.createMachineAccountForExistingNode(nodeID: nodeID, payer: account) {
            if publicKeys == nil || publicKeys!.length == 0 {
                panic("Cannot provide zero keys for the machine account")
            }
            for key in publicKeys! {
                machineAccount.addPublicKey(key.decodeHex())
            }
        } else {
            panic("Could not create a machine account for the node")
        }
    }
}
`

class UndefinedConfigurationError extends Error {
    constructor(address) {
      const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-stakingcollection-create-machine-account/README.md`.trim()
      super(msg)
      this.name = "Stored Interaction Undefined Address Configuration Error"
    }
}

const addressCheck = async address => {
    if (!await config().get(address)) throw new UndefinedConfigurationError(address)
}

export const template = async ({ proposer, authorization, payer, nodeId = "", publicKeys = []}) => {
    for (let addr of DEPS) await addressCheck(addr)

    return fcl.pipe([
        fcl.transaction(CODE),
        fcl.args([fcl.arg(nodeId, t.String), fcl.arg(publicKeys, t.Array(t.String))]),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer),
        fcl.validator(ix => {
            if (ix.authorizations.length > 1) throw new error("template only requires one authorization.")
            return ix
        })
    ])
}
