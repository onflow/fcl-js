import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

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

export const template = async ({ proposer, authorization, payer }) => {
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
