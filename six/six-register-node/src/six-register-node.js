import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {config} from "@onflow/config"

const Deps = {
    FLOWTOKENADDRESS: "0xFLOWTOKENADDRESS",
    LOCKEDTOKENADDRESS: "0xLOCKEDTOKENADDRESS",
    STAKINGPROXYADDRESS: "0xSTAKINGPROXYADDRESS",
}

const Env = {
    local: {
        [Deps.FLOWTOKENADDRESS]: "0x0",
        [Deps.LOCKEDTOKENADDRESS]: "0x0",
        [Deps.STAKINGPROXYADDRESS]: "0x0",
    },
    testnet: {
        [Deps.FLOWTOKENADDRESS]: "0x7e60df042a9c0868",
        [Deps.LOCKEDTOKENADDRESS]: "0x95e019a17d0e23d7",
        [Deps.STAKINGPROXYADDRESS]: "0x7aad92e5a0715d21",
    },
    mainnet: {
        [Deps.FLOWTOKENADDRESS]: "0x1654653399040a61",
        [Deps.LOCKEDTOKENADDRESS]: "0x8d0e87b65159ae63",
        [Deps.STAKINGPROXYADDRESS]: "0x62430cf28c26d095",
    }
}

export const TITLE = "Register Node"
export const DESCRIPTION = "Register a Node on Flow."
export const VERSION = "0.0.6"
export const HASH = "b64e0e3ed9eb28789198f2b0437f55f750bfa76da99450f63be6543bde66122a"
export const CODE = 
`import FlowToken from 0xFLOWTOKENADDRESS
import LockedTokens from 0xLOCKEDTOKENADDRESS
import StakingProxy from 0xSTAKINGPROXYADDRESS

transaction(id: String, role: UInt8, networkingAddress: String, networkingKey: String, stakingKey: String, amount: UFix64) {

    let holderRef: &LockedTokens.TokenHolder

    let vaultRef: &FlowToken.Vault

    prepare(account: AuthAccount) {
        self.holderRef = account.borrow<&LockedTokens.TokenHolder>(from: LockedTokens.TokenHolderStoragePath)
            ?? panic("Could not borrow ref to TokenHolder")

        self.vaultRef = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow flow token vault reference")
    }

    execute {
        let nodeInfo = StakingProxy.NodeInfo(id: id, role: role, networkingAddress: networkingAddress, networkingKey: networkingKey, stakingKey: stakingKey)

        let lockedBalance = self.holderRef.getLockedAccountBalance()

        if amount <= lockedBalance {

            self.holderRef.createNodeStaker(nodeInfo: nodeInfo, amount: amount)

        } else if ((amount - lockedBalance) <= self.vaultRef.balance) {

            self.holderRef.deposit(from: <-self.vaultRef.withdraw(amount: amount - lockedBalance))

            self.holderRef.createNodeStaker(nodeInfo: nodeInfo, amount: amount)

        } else {
            panic("Not enough tokens to stake!")
        }
        
    }
}
`


export const template = async ({ proposer, authorization, payer, nodeID = "", nodeRole = "", networkingAddress = "", networkingKey = "", stakingKey = "", amount = "" }) => {
    const env = await config().get("env", "mainnet")
    let code = CODE.replace(Deps.LOCKEDTOKENADDRESS, Env[env][Deps.LOCKEDTOKENADDRESS])
    code = code.replace(Deps.STAKINGPROXYADDRESS, Env[env][Deps.STAKINGPROXYADDRESS])
    code = code.replace(Deps.FLOWTOKENADDRESS, Env[env][Deps.FLOWTOKENADDRESS])

    return fcl.pipe([
        fcl.transaction(code),
        fcl.args([fcl.arg(nodeID, t.String), fcl.arg(nodeRole, t.UInt8), fcl.arg(networkingAddress, t.String), fcl.arg(networkingKey, t.String), fcl.arg(stakingKey, t.String), fcl.arg(amount, t.UFix64)]),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer),
        fcl.validator(ix => {
            if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
            return ix
        })
    ])
}
