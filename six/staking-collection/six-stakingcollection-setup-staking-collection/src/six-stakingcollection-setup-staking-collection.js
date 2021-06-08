import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const DEPS = new Set([
    "0xSTAKINGCOLLECTIONADDRESS",
])

export const TITLE = "Setup Staking Collection"
export const DESCRIPTION = "Sets up a Staking Collection for an account."
export const VERSION = "0.0.0"
export const HASH = "801279c025228054c88eafd730766a3abc046dd324b8a3dfa19abeb82ca01637"
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

export const template = async ({ proposer, authorization, payer }) => {
    for (let addr of DEPS) await addressCheck(addr)
    
    return sdk.pipe([
        sdk.transaction(CODE),
        sdk.proposer(proposer),
        sdk.authorizations([authorization]),
        sdk.payer(payer),
        sdk.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
