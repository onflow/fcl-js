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

export const TITLE = "Setup Staking Collection"
export const DESCRIPTION = "Sets up a Staking Collection for an account."
export const VERSION = "0.0.0"
export const HASH = "dcae4faa6d689873f7caf7c5efef669f9fe1d4113e58b474b7aec1e07113a7ff"
export const CODE = 
`import StakingCollection from 0xSTAKINGCOLLECTION

transaction() {

    prepare(nodeOperator: AuthAccount) {
        let stakingCollection <- StakingCollection()

        nodeOperator.save(<-proxyHolder, to: StakingProxy.NodeOperatorCapabilityStoragePath)

        nodeOperator.link<&StakingProxy.NodeStakerProxyHolder{StakingProxy.NodeStakerProxyHolderPublic}>(
            StakingProxy.NodeOperatorCapabilityPublicPath,
            target: StakingProxy.NodeOperatorCapabilityStoragePath
        )
    }
}
`

export const template = async ({ proposer, authorization, payer }) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.FLOWSTAKINGCOLLECTION, Env[env][Deps.FLOWSTAKINGCOLLECTION])

    return sdk.pipe([
        sdk.transaction(code),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
